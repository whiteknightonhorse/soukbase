/* Soukbase browser wallet helper (cards 0712, 0729, 0798). Vanilla ES2020. window.SoukbaseWallet:
 * connect({anyChain, force}) -> {address, chainId, manual?}: chooser if needed; anyChain skips the chain check
 * wallets() -> [{name, rdns}]; signMessage(msg, addr, {quiet}) -> 0x sig (quiet: message not shown)
 * sign(stage, values) -> {stage, message, signature}: message from POST /sell/message, then signMessage
 * Each state change is a "soukbase:wallet" event on document. The server builds the message; only ALLOWED methods
 * reach a provider (no transaction). Contract wallets (EIP-1271) are not supported. Nothing is asked of a wallet
 * before the person picks it, with one exception: a page opened at "#signed-out" (after Sign out) asks one wallet, the
 * remembered one or the only one present, once, wallet_revokePermissions for this site; every answer is ignored. */
(function () {
  "use strict";
  var ALLOWED = ["eth_requestAccounts", "eth_chainId", "wallet_switchEthereumChain", "wallet_addEthereumChain", "personal_sign", "wallet_requestPermissions", "wallet_revokePermissions"];
  var PERMS = [{ eth_accounts: {} }];
  var ADDR = /^0x[0-9a-fA-F]{40}$/, SIG = /^0x[0-9a-fA-F]{130}$/;
  var NETS = {
    8453: { chainName: "Base", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, rpcUrls: ["https://mainnet.base.org"], blockExplorerUrls: ["https://basescan.org"] }
  };
  var doc = document, win = window;
  var $ = function (id) { return doc.getElementById(id); };
  var btn = $("wallet-connect"), stateEl = $("wallet-state");
  var cfg = { chains: [8453], timeoutMs: 120000, messageUrl: "/sell/message" };
  var user = win.SoukbaseWalletConfig || {};
  Object.keys(user).forEach(function (k) { cfg[k] = user[k]; });
  var attr = btn && btn.getAttribute("data-chain-ids");
  if (attr) cfg.chains = attr.split(",").map(Number).filter(Boolean);

  var KEY = "soukbase.wallet.rdns", RDNS = /^[A-Za-z0-9.-]{1,64}$/, CTRL = /[\u0000-\u001f\u007f-\u009f]/g;
  var LABEL = { idle: "Connect wallet", choosing: "Choose a wallet", connecting: "Connecting…", signing: "Signing…", signed: "Signed", rejected: "Try again", error: "Try again", expired: "Try again", "no-wallet": "Connect wallet", "wrong-chain": "Switch to Base" };
  var TEXT = {
    connecting: "Connecting to your wallet…",
    signing: "Waiting for your signature. Check your wallet.",
    signed: "Signed. Nothing was sent to the chain.",
    rejected: "You declined the signature. Nothing was sent.",
    expired: "Signature request expired, try again.",
    "wrong-chain": "Your wallet is on another network. Switch to Base to continue.",
    "no-wallet": "No browser wallet found. Sign the message by hand: use `cast wallet sign` or any wallet's \"sign message\", then paste the signature. Contract wallets cannot sign yet."
  };
  var current = "idle", address = "", chosen = null, sticky = "", forced = false, chooser = null;
  var RETRY = ["rejected", "error", "expired", "wrong-chain"];

  function mem(set, v) {
    try { var s = win.localStorage; if (set === 1) s.setItem(KEY, v); else if (set === 2) s.removeItem(KEY); else return s.getItem(KEY) || ""; } catch (x) { /* storage blocked */ }
    return "";
  }

  /* discovery: EIP-6963; window.ethereum only when nothing is announced */
  var list = [];
  var cut = function (s, n) { return String(s).replace(CTRL, "").trim().slice(0, n); };
  win.addEventListener("eip6963:announceProvider", function (ev) {
    var d = ev && ev.detail, i = d && d.info, p = d && d.provider;
    if (!p || typeof p.request !== "function" || !i || typeof i.uuid !== "string" || typeof i.rdns !== "string" || !RDNS.test(i.rdns) || typeof i.name !== "string") return;
    var name = cut(i.name, 40);
    if (!name || list.some(function (e) { return e.uuid === i.uuid || e.provider === p; })) return;
    list.push({ uuid: i.uuid, name: name, rdns: i.rdns, icon: i.icon, provider: p });
    if (current === "idle") relabel();
    updateOther();
  });
  function ask() { win.dispatchEvent(new Event("eip6963:requestProvider")); }
  function entries() {
    var e = win.ethereum, l = list.filter(function (x) { return x.provider === e; }).concat(list.filter(function (x) { return x.provider !== e; }));
    if (!l.length && e && typeof e.request === "function") l = [{ name: "Browser wallet", rdns: "", icon: "", provider: e, legacy: true }];
    return l;
  }
  function byRdns(ws, r) { for (var i = 0; r && i < ws.length; i++) if (ws[i].rdns === r) return ws[i]; return null; }
  function wallets() { return entries().map(function (e) { return { name: e.name, rdns: e.rdns }; }); }

  function relabel() {
    if (current !== "idle" || sticky) return;
    var ws = entries(), e = ws.length === 1 ? ws[0] : byRdns(ws, mem());
    setLabel(e ? "Connect " + cut(e.name, 24) : LABEL.idle);
  }
  function setLabel(text) {
    if (!btn) return;
    var n = btn.lastChild;
    if (n && n.nodeType === 3) n.nodeValue = text; else btn.appendChild(doc.createTextNode(text));
  }
  var other = null;
  function updateOther() {
    var row = $("wallet-row");
    if (!other && row) {
      other = doc.createElement("button"); other.type = "button"; other.id = "wallet-other"; other.className = "link"; other.textContent = "Other wallet"; other.hidden = true;
      other.addEventListener("click", function () { forced = true; btn.click(); });
      row.appendChild(other);
    }
    if (other) other.hidden = !(btn && (current === "idle" || current === "connected" || RETRY.indexOf(current) >= 0) && entries().length);
  }
  function setState(name, text, label) {
    current = name; sticky = name === "idle" && label ? label : "";
    if (btn) { btn.setAttribute("data-state", name); setLabel(label || LABEL[name] || LABEL.idle); }
    if (stateEl) {
      if (!stateEl.getAttribute("aria-live")) stateEl.setAttribute("aria-live", "polite");
      stateEl.textContent = text != null ? text : (TEXT[name] || "");
    }
    if (name === "idle") relabel();
    updateOther();
    try { doc.dispatchEvent(new CustomEvent("soukbase:wallet", { detail: { state: name } })); } catch (x) { /* old browser */ }
  }
  function short(a) { return a.slice(0, 6) + "…" + a.slice(-4); }
  /* {W} starts a sentence, {w} sits inside one; the unnamed wallet is "Your wallet" */
  function say(t) {
    var n = chosen && !chosen.legacy ? chosen.name : "";
    return t.replace(/\{([Ww])\}/g, function (m, k) { return n || (k === "W" ? "Your wallet" : "your wallet"); });
  }
  function fail(name, code, message) {
    message = say(message);
    setState(name, message);
    var e = new Error(message); e.code = code; e.userMessage = message; return e;
  }
  /* one plain text per known provider error (E2E-WALLET-1102 D15) */
  function providerFail(err, what) {
    if (err && err.userMessage) return err;
    var c = err && err.code, m = (err && typeof err.message === "string") ? err.message : "", F = function (t, st) { return fail(st || "error", c, t); };
    if (c === 4001 || c === "ACTION_REJECTED" || (c == null && /reject|denied/i.test(m))) {
      return fail("rejected", 4001, what === "sign" ? "You declined the signature in {w}. Nothing was sent." : "You declined the connection in {w}. Nothing was sent.");
    }
    if (c === "timeout") { mem(2); return F("{W} did not answer in two minutes. If it is not set up yet, finish its setup, or choose another wallet.", "expired"); }
    if (c === 4100) return F("{W} has not authorised this site for that account. Connect again and approve the account in {w}.");
    if (c === 4200) { mem(2); return F("{W} cannot sign a message (personal_sign). Choose another wallet."); }
    if (c === 4900 || c === 4901) return F("{W} is disconnected from the network. Open {w}, check its connection, and try again.");
    if (c === 4902) return F("{W} does not know this network. Add it in {w}, then try again.");
    if (c === -32002) return F(/tab|active|focus/i.test(m) ? "{W} only answers while this tab is in front. Keep this tab active and try again." : "{W} already has a request open. Open {w}, finish or close that request, then try again.");
    if (c === -32603) { mem(2); return F("{W} could not answer. If {w} is not set up yet, finish its setup, or choose another wallet."); }
    if ((c === -32000 || c === -32602) && what === "sign") return F("{W} is on a different account than " + short(address) + ". Switch {w} to that account, or connect again.");
    if (typeof c === "number") return F("{W} returned error " + c + ". Try again or choose another wallet.");
    return fail("error", "wallet_error", "{W} returned an error. Try again or choose another wallet.");
  }

  function rpc(p, method, params) {
    return new Promise(function (resolve, reject) {
      if (ALLOWED.indexOf(method) < 0) { reject(new Error("method not allowed: " + method)); return; }
      Promise.resolve(p.request({ method: method, params: params || [] })).then(resolve, reject);
    });
  }
  var hex = function (n) { return "0x" + n.toString(16); };
  var utf8hex = function (s) { return "0x" + Array.prototype.map.call(new TextEncoder().encode(s), function (b) { return (b < 16 ? "0" : "") + b.toString(16); }).join(""); };

  function detach() {
    var h = chosen && chosen.h; if (!h) return;
    chosen.h = null;
    if (typeof chosen.provider.removeListener === "function") Object.keys(h).forEach(function (k) { chosen.provider.removeListener(k, h[k]); });
  }
  function gone() { detach(); address = ""; setState("idle", say("{W} disconnected this site. Connect again."), "Connect again"); }
  function attach() {
    var p = chosen.provider;
    if (typeof p.on !== "function") return;
    detach();
    chosen.h = {
      accountsChanged: function (l) {
        var a = l && l[0];
        if (!a) return gone();
        if (typeof a !== "string" || !ADDR.test(a)) return;
        address = a;
        var f = $("f-address");
        if (f) { f.value = a; f.dispatchEvent(new Event("input", { bubbles: true })); }
        setState("connected", "Connected: " + a + " via " + chosen.name + ".", short(a));
      },
      chainChanged: function (id) { if (cfg.chains.indexOf(parseInt(id, 16)) < 0) setState("wrong-chain"); },
      disconnect: gone
    };
    Object.keys(chosen.h).forEach(function (k) { p.on(k, chosen.h[k]); });
  }

  var GENERIC = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path transform="matrix(1 0 0 -1 0 960)" fill="#14201A" d="M864 704h-640c-17.7 0-32 14.3-32 32s14.3 32 32 32h544c17.7 0 32 14.3 32 32s-14.3 32-32 32h-544c-53 0-96-43-96-96v0-512c0-53 43-96 96-96h640c35.3 0 64 28.7 64 64v0 448c0 35.3-28.7 64-64 64zM864 192h-640c-17.7 0-32 14.3-32 32v0 421.5c9.5-3.5 20.4-5.5 31.9-5.5 0 0 0.1 0 0.1 0h640zM672 432c0 26.5 21.5 48 48 48s48-21.5 48-48c0-26.5-21.5-48-48-48c-26.5 0-48 21.5-48 48z"/></svg>');
  function el(tag, cls, text) {
    var e = doc.createElement(tag); e.className = cls || ""; e.textContent = text || "";
    if (tag === "button") e.type = "button";
    return e;
  }
  function closeChooser(reason) {
    var c = chooser; if (!c) return;
    chooser = null; c.el.remove();
    if (reason) { var e = new Error("cancelled"); e.code = "cancelled"; c.reject(e); }
  }
  function choose(ws) {
    return new Promise(function (resolve, reject) {
      var box = el("div"); box.id = "wallet-chooser"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Choose a wallet");
      chooser = { el: box, reject: reject };
      var pick = function (v) { closeChooser(); resolve(v); };
      var cancel = function () { closeChooser(true); setState("idle"); };
      ws.forEach(function (w) {
        var b = el("button", "wallet-opt"), img = el("img");
        b.setAttribute("data-rdns", w.rdns);
        img.width = 24; img.height = 24; img.alt = "";
        img.src = typeof w.icon === "string" && w.icon.indexOf("data:image/") === 0 && w.icon.length < 262144 ? w.icon : GENERIC;
        b.appendChild(img); b.appendChild(el("span", "wallet-name", w.name)); b.appendChild(el("span", "wallet-rdns", w.rdns));
        b.onclick = function () { pick(w); };
        box.appendChild(b);
      });
      var no = el("button", "link", "Cancel"), more = el("a", "link", "Other wallets");
      no.onclick = cancel;
      /* no wallet in this list: close the chooser and open the manual path (the folded block of the form, its address field) */
      more.href = "#sell-manual";
      more.onclick = function (ev) { ev.preventDefault(); cancel(); var m = $("sell-manual"); if (m) m.open = true; var a = $("f-address"); if (a && a.focus) a.focus(); };
      box.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { ev.preventDefault(); cancel(); } });
      box.appendChild(el("p", "help", "Use MetaMask, Rabby or another browser wallet. Phone: open this page in your wallet app."));
      box.appendChild(more);
      box.appendChild(no);
      ($("wallet-row") || $("wallet-pick") || doc.body).appendChild(box);
      setState("choosing", "Choose a wallet");
      box.querySelector("button").focus();
    });
  }

  function checkChain(p, mayAsk) {
    return rpc(p, "eth_chainId").then(function (id) {
      var chain = parseInt(id, 16);
      if (cfg.chains.indexOf(chain) >= 0) return chain;
      if (!mayAsk) throw fail("wrong-chain", "wrong_chain", TEXT["wrong-chain"]);
      var want = hex(cfg.chains[0]);
      return rpc(p, "wallet_switchEthereumChain", [{ chainId: want }]).catch(function (e) {
        var cp = cfg.chainParams || NETS[cfg.chains[0]]; if (!e || e.code !== 4902 || !cp) throw e;
        return rpc(p, "wallet_addEthereumChain", [Object.assign({ chainId: want }, cp)]).catch(function () { throw e; });
      }).then(function () { return checkChain(p, false); });
    });
  }
  function timed(prom) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject({ code: "timeout" }); }, cfg.timeoutMs);
      prom.then(function (v) { clearTimeout(t); resolve(v); }, function (x) { clearTimeout(t); reject(x); });
    });
  }
  function start(w, anyChain, pick) {
    if (chosen && chosen !== w) detach();
    if (mem() !== w.rdns) mem(2);
    chosen = w;
    var p = w.provider, retrySwitch = current === "wrong-chain";
    setState("connecting");
    /* pick: the wallet shows its own account choice first; 4001 is the person's refusal, any other error means the method is unknown */
    var perm = pick ? timed(rpc(p, "wallet_requestPermissions", PERMS)).then(null, function (e) { if (e && (e.code === 4001 || e.code === "ACTION_REJECTED")) throw e; }) : Promise.resolve();
    return perm.then(function () { return timed(rpc(p, "eth_requestAccounts")); }).then(function (accts) {
      var a = accts && accts[0];
      if (typeof a !== "string" || !ADDR.test(a)) throw fail("error", "no_account", "{W} did not share an account. Unlock it, pick an account, and try again.");
      address = a;
      if (w.rdns) mem(1, w.rdns);
      return (anyChain ? rpc(p, "eth_chainId").then(function (id) { return parseInt(id, 16); }) : checkChain(p, retrySwitch)).then(function (chain) {
        attach();
        setState("connected", "Connected: " + a + " via " + w.name + ". " + (btn && btn.getAttribute("data-signing-note") || "Signing happens when you send for review."), short(a));
        return { address: a, chainId: chain };
      });
    }).catch(function (e) { throw providerFail(e, "connect"); });
  }
  function connect(o) {
    closeChooser(true);
    ask();
    var any = !!(o && o.anyChain), ws = entries(), force = forced || !!(o && o.force), r = mem(), known = byRdns(ws, r), w = null;
    forced = false;
    if (!ws.length) return manualConnect();
    if (r && !known) mem(2);
    if (!force) {
      if (ws.length === 1) w = ws[0];
      else if (chosen && ws.indexOf(chosen) >= 0 && RETRY.indexOf(current) >= 0) w = chosen;
      else w = known;
    }
    var pick = !!(o && o.pick);
    return w ? start(w, any, pick) : choose(ws).then(function (c) { return c ? start(c, any, pick) : manualConnect(); });
  }
  function manualConnect() {
    var field = $("f-address"), a = field ? String(field.value).trim() : "";
    detach(); chosen = null;
    setState("no-wallet");
    if (!ADDR.test(a)) throw fail("no-wallet", "no_wallet", TEXT["no-wallet"] + " Paste your wallet address above first.");
    address = a;
    return Promise.resolve({ address: a, manual: true });
  }

  /* ---- the message and the signature ---- */
  function panel() {
    var el = $("wallet-sign");
    if (el) return el;
    el = doc.createElement("div"); el.id = "wallet-sign"; el.className = "msg";
    var row = $("wallet-row") || btn || doc.body;
    row.parentNode.insertBefore(el, row.nextSibling);
    return el;
  }
  function showMessage(message) {
    var el = panel(); el.textContent = ""; el.hidden = false;
    var label = doc.createElement("span"); label.className = "msg-label"; label.textContent = "Message you will sign";
    var pre = doc.createElement("pre"); pre.id = "wallet-message"; pre.tabIndex = 0; pre.textContent = message;
    el.appendChild(label); el.appendChild(pre);
    return el;
  }
  function manualSign(message) {
    var el = showMessage(message);
    setState("no-wallet");
    var ta = doc.createElement("textarea"), lab = doc.createElement("label"), ok = doc.createElement("button"), err = doc.createElement("span");
    ta.id = "wallet-signature"; ta.rows = 3; ta.spellcheck = false; ta.setAttribute("autocomplete", "off"); ta.placeholder = "0x…";
    lab.htmlFor = ta.id; lab.textContent = "Signature (0x…)";
    ok.type = "button"; ok.className = "btn btn-secondary"; ok.textContent = "Use this signature";
    err.className = "help err"; err.setAttribute("role", "alert");
    el.appendChild(lab); el.appendChild(ta); el.appendChild(ok); el.appendChild(err);
    ta.focus();
    return new Promise(function (resolve) {
      ok.addEventListener("click", function () {
        var s = ta.value.trim();
        if (!SIG.test(s)) { err.textContent = "That is not a 65-byte 0x signature. Sign the exact message above with personal_sign (EIP-191)."; ta.setAttribute("aria-invalid", "true"); ta.focus(); return; }
        el.hidden = true; setState("signed"); resolve(s);
      });
    });
  }
  function signMessage(message, addr, o) {
    var p = chosen && chosen.provider;
    if (!p) return manualSign(message);
    if (!(o && o.quiet)) showMessage(message);
    setState("signing");
    var timer, done = false;
    return new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        if (done) return; done = true;
        reject(fail("expired", "timeout", TEXT.expired));
      }, cfg.timeoutMs);
      rpc(p, "personal_sign", [utf8hex(message), addr || address]).then(function (sig) {
        if (done) return; done = true;
        if (typeof sig !== "string" || !SIG.test(sig)) { reject(typeof sig === "string" && /^0x[0-9a-fA-F]+$/.test(sig) && sig.length > 132 ? fail("error", "bad_signature", "{W} signed as a smart-contract account. Soukbase accepts only key-based (EOA) wallets in v1: use a key-based account or another wallet.") : providerFail({}, "sign")); return; }
        setState("signed"); resolve(sig);
      }, function (e) {
        if (done) return; done = true;
        reject(providerFail(e, "sign"));
      });
    }).then(function (s) { clearTimeout(timer); var ws = $("wallet-sign"); if (ws) ws.hidden = true; return s; }, function (e) { clearTimeout(timer); throw e; });
  }

  /* a retry always asks for a fresh message */
  function prepare(stage, values) {
    var body = {}; Object.keys(values || {}).forEach(function (k) { body[k] = values[k]; });
    body.stage = stage;
    return fetch(cfg.messageUrl, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 200 && typeof j.message === "string") return j;
        var e = new Error(j.error || "Request failed"); e.status = r.status; e.body = j; e.code = j.code;
        if (r.status === 422) { if (address) setState("connected", "Connected: " + address + ". Fix the highlighted fields, then send again.", short(address)); }
        else { var text = (j.error || "Something went wrong.") + (j.code ? " (" + j.code + ")" : ""); e.userMessage = text; setState("error", text); }
        throw e;
      });
    }, function () {
      throw fail("error", "network", "Could not reach the server. Check your connection and try again. Nothing is lost on this page.");
    });
  }
  function sign(stage, values) {
    return prepare(stage, values).then(function (m) {
      return signMessage(m.message, (values && values.address) || address).then(function (signature) {
        return { stage: m.stage, message: m.message, signature: signature };
      });
    });
  }

  win.SoukbaseWallet = { connect: connect, wallets: wallets, signMessage: signMessage, sign: sign, state: function () { return current; } };
  ask();
  setState("idle");

  /* after Sign out (location.hash "#signed-out"): ask one wallet once to forget this site; answers and errors are ignored */
  if (win.location.hash === "#signed-out") {
    try { win.history.replaceState(null, "", win.location.pathname + win.location.search); } catch (x) { /* no history */ }
    var asked = false, stop = 0;
    var revoke = function () {
      if (asked) return;
      var ws = entries(), e = ws.length === 1 ? ws[0] : byRdns(ws, mem());
      if (!e) return;
      asked = true; clearTimeout(stop); win.removeEventListener("eip6963:announceProvider", revoke);
      try { rpc(e.provider, "wallet_revokePermissions", PERMS).then(null, function () {}); } catch (x) { /* ignored */ }
    };
    win.addEventListener("eip6963:announceProvider", revoke);
    stop = setTimeout(function () { asked = true; win.removeEventListener("eip6963:announceProvider", revoke); }, 3000);
    revoke();
  }
})();
