/* Soukbase seller forms: progressive enhancement. Without this file every form is a plain POST (see src/web/sell.ts).
 * Wallet contract with site/js/wallet-connect.js (cards 0712, 0798), looked up as window.SoukbaseWallet:
 *   connect({ anyChain, force }): Promise<{ address: string, chainId?: number, manual?: boolean }>
 *   signMessage(message: string, address: string, { quiet }): Promise<string>   // personal_sign, rejects when the person declines
 * When it is absent the form posts as plain HTML and the next page shows the message and a signature field. */
(function () {
  "use strict";
  var form = document.getElementById("sell-form");
  var $ = function (id) { return document.getElementById(id); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  qa(".js-only").forEach(function (e) { if (e.id !== "wallet-connect" && !e.closest("#wallet-row")) e.hidden = false; });
  qa("[data-count-for]").forEach(function (c) {
    var el = $(c.getAttribute("data-count-for"));
    var max = c.textContent.split("/")[1].trim();
    var upd = function () { c.textContent = el.value.length + " / " + max; };
    el.addEventListener("input", upd); upd();
  });

  /* ---- "Next: connect payments" countdown (SELLER-UX-1110 ruling-1 S0.8; WCAG 2.2.1) ----
   * JS only, never on reduced motion. 60 s, announced at the start and at 10 s through an aria-live="polite" span;
   * "Stay here", Escape, and focus or hover inside the box stop or pause it. Without this file the link is all there is. */
  function countdown(link) {
    var box = link.closest(".success");
    if (!box || box.querySelector(".cd") || link.getAttribute("data-countdown") !== "60") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var left = 60, paused = false, timer = null;
    var p = document.createElement("p"); p.className = "help cd";
    var lead = document.createTextNode("Taking you there in ");
    var shown = document.createElement("span"); shown.id = "sell-countdown-s"; shown.setAttribute("aria-hidden", "true");
    var live = document.createElement("span"); live.id = "sell-countdown-live"; live.className = "sr-only"; live.setAttribute("aria-live", "polite");
    var stay = document.createElement("button"); stay.type = "button"; stay.id = "sell-stay"; stay.className = "linklike"; stay.textContent = "Stay here";
    p.appendChild(lead); p.appendChild(shown); p.appendChild(live); p.appendChild(document.createTextNode(" \u00b7 ")); p.appendChild(stay);
    link.parentNode.parentNode.insertBefore(p, link.parentNode.nextSibling);
    var draw = function () { shown.textContent = left + " s"; };
    var stop = function () {
      if (timer === null) return;
      clearInterval(timer); timer = null;
      box.removeEventListener("mouseenter", hold); box.removeEventListener("focusin", hold);
      box.removeEventListener("mouseleave", release); box.removeEventListener("focusout", release);
      document.removeEventListener("keydown", onKey);
    };
    var cancel = function () { stop(); p.textContent = "You are staying on this page."; p.appendChild(live); live.textContent = "Staying on this page."; };
    var hold = function () { paused = true; p.setAttribute("data-paused", "true"); };
    var release = function () { paused = false; p.removeAttribute("data-paused"); };
    var onKey = function (ev) { if (ev.key === "Escape") cancel(); };
    box.addEventListener("mouseenter", hold); box.addEventListener("focusin", hold);
    box.addEventListener("mouseleave", release); box.addEventListener("focusout", release);
    document.addEventListener("keydown", onKey);
    stay.addEventListener("click", cancel);
    draw(); live.textContent = "Taking you to your seller page in 60 seconds. Press Escape or Stay here to stay on this page.";
    timer = setInterval(function () {
      if (paused) return;
      left -= 1; draw();
      if (left === 10) live.textContent = "Taking you to your seller page in 10 seconds.";
      if (left <= 0) { stop(); location.assign(link.getAttribute("href")); }
    }, 1000);
  }
  var nextLink = $("sell-next");
  if (nextLink && !nextLink.closest("[hidden]")) countdown(nextLink);

  /* ---- listing form v2 (T-0783; /#sell step 3 and the /manage listing pages) ----
   * Choosing a category preselects its delivery (the radio's data-delivery, from rules/categories.json) unless the seller
   * picked a delivery themselves; only the chosen mode's block, the chosen category's fields and, for a custom licence,
   * the terms box are shown; the delivery time select counts only for the webhook. Without this file every block shows
   * and the server applies the category's delivery when none is chosen. */
  var lform = document.querySelector(".lform");
  if (lform) listingForm(lform);
  function listingForm(root) {
    var host = root.closest("form");
    var radios = function (n) { return qa('input[name="' + n + '"]', host); };
    var picked = function (n) { var r = radios(n).filter(function (x) { return x.checked; })[0]; return r ? r.value : ""; };
    var lic = host.elements.attr_licence, time = host.elements.delivery_time;
    /* on an edit page the saved delivery is the seller's own choice */
    var touched = host.id !== "sell-form" && !!picked("delivery_mode");
    function sync() {
      var mode = picked("delivery_mode"), cat = picked("category");
      qa("[data-for]", root).forEach(function (b) { b.hidden = b.getAttribute("data-for") !== mode; });
      qa(".catf", root).forEach(function (fs) { fs.hidden = fs.getAttribute("data-cat") !== cat; });
      var cust = root.querySelector("[data-licence-custom]"); if (cust && lic) cust.hidden = lic.value !== "custom";
      if (time) time.disabled = mode !== "webhook";
      var adv = $("adv-webhook"); if (adv && mode === "webhook") adv.open = true;
    }
    radios("delivery_mode").forEach(function (r) { r.addEventListener("change", function () { touched = true; sync(); }); });
    radios("category").forEach(function (r) {
      r.addEventListener("change", function () {
        var d = r.getAttribute("data-delivery");
        if (!touched) radios("delivery_mode").forEach(function (x) { x.checked = x.value === d; });
        sync();
      });
    });
    if (lic) lic.addEventListener("change", sync);
    sync();
    /* T-0799: the price is written with two decimals ("3", "3.5", "3,50"); the purpose follows the description until the seller edits it;
     * a refund window must be chosen (the page's data-error words; the server checks it too). */
    var price = host.elements.price_usdc, desc = host.elements.description, purpose = host.elements.attr_purpose;
    if (price) price.addEventListener("blur", function () {
      var m = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(price.value.trim());
      if (m) price.value = m[1] + "." + ((m[2] || "") + "00").slice(0, 2);
    });
    if (desc && purpose) {
      var purposeFrom = function (d) {
        var t = d.trim().replace(/[ \t]+/g, " "), m = /^[^\n]*?[.!?](?=\s|$)/.exec(t), first = (m ? m[0] : t.split("\n")[0]).trim(), max = purpose.maxLength > 0 ? purpose.maxLength : 200;
        if (first.length <= max) return first;
        var cut = first.slice(0, max + 1), at = cut.lastIndexOf(" ");
        return (at > 0 ? cut.slice(0, at) : cut.slice(0, max)).replace(/[\s,;:]+$/, "");
      };
      /* a stored purpose (edit page) or one the seller changed is theirs */
      var own = purpose.value.trim() !== "" && (!!host.elements.stock || purpose.value !== purposeFrom(desc.value));
      desc.addEventListener("input", function () { if (!own) purpose.value = purposeFrom(desc.value); });
      purpose.addEventListener("input", function () { own = purpose.value.trim() !== ""; if (!own) purpose.value = purposeFrom(desc.value); });
    }
    var refunds = radios("refund_window_days"), box = $("seg-refund_window_days");
    if (refunds.length && box) {
      var clear = function () { var o = $("f-refund_window_days-e"); if (o) o.remove(); };
      refunds.forEach(function (r) { r.addEventListener("change", clear); });
      host.addEventListener("submit", function (ev) {
        if (picked("refund_window_days") !== "" || host.id === "sell-form") return;
        ev.preventDefault(); clear();
        var s = document.createElement("span"); s.className = "help err"; s.id = "f-refund_window_days-e"; s.setAttribute("role", "alert");
        s.textContent = box.getAttribute("data-error") || ""; box.appendChild(s);
        refunds[0].focus();
      });
    }
  }

  if (!form) return;

  /* ---- seller form v3, step 1 (SELLER-FORM-1110 ruling-1 §2.2) ----
   * Every text comes from the page (data-texts, rendered from src/web/content.ts STEP1). The wallet button connects,
   * gets the bind message from /sell/message, asks for one signature and submits the form to /sell/send, which answers
   * 303 to the first-listing page. Without this file the button posts to /sell/message and the manual path follows. */
  var T = JSON.parse(form.getAttribute("data-texts"));
  var API = form.getAttribute("data-api");
  var CHAINS = form.getAttribute("data-chain-ids").split(",").map(Number);
  var f = function (n) { return form.elements[n]; };
  var val = function (n) { var e = f(n); if (!e) return ""; return e.type === "checkbox" ? (e.checked ? "yes" : "") : String(e.value).trim(); };
  var wallet = function () { return window.SoukbaseWallet || null; };
  var excluded = (f("country").getAttribute("data-excluded") || "").split(",");
  var manualBox = $("sell-manual");

  /* ---- messages: an error replaces the hint under the same field ---- */
  var ICON_WARN = '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  /* aria-describedby keeps the hint id and gains the error id while an error shows. */
  function describe(el, id, errId) {
    if (!el || !el.setAttribute || el.type === "radio" || !id) return;
    var ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (x) { return x && x !== id + "-e"; });
    if (errId) ids.push(errId);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" ")); else el.removeAttribute("aria-describedby");
  }
  function setErr(name, msg) {
    var el = f(name); if (!el) return;
    var id = el.id, old = $(id + "-e"), hint = $(id + "-h");
    if (old) old.remove();
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    describe(el, id, msg ? id + "-e" : "");
    if (hint && name !== "handle") hint.hidden = !!msg;
    if (!msg) return;
    var s = document.createElement("span"); s.className = "help err"; s.id = id + "-e"; s.setAttribute("role", "alert");
    s.innerHTML = ICON_WARN; var t = document.createElement("span"); t.textContent = msg; s.appendChild(t);
    if (msg === T.country.excluded) { var a = document.createElement("a"); a.href = "/legal/seller-requirements"; a.textContent = T.country.excludedLink; t.appendChild(document.createTextNode(" ")); t.appendChild(a); }
    var anchor = el.type === "checkbox" ? el.closest("label") : (hint || el);
    anchor.parentNode.insertBefore(s, anchor.nextSibling);
  }
  function banner(msg, link) {
    var b = $("form-error"); b.textContent = ""; b.hidden = !msg; if (!msg) return;
    b.innerHTML = ICON_WARN; var t = document.createElement("span"); t.textContent = msg; b.appendChild(t);
    if (link) { var a = document.createElement("a"); a.href = link; a.textContent = msg.slice(msg.lastIndexOf(". ") + 2).replace(/\.$/, ""); t.textContent = msg.slice(0, msg.lastIndexOf(". ") + 2); t.appendChild(a); t.appendChild(document.createTextNode(".")); }
    b.scrollIntoView && b.scrollIntoView({ block: "center" });
  }
  function status(msg) { $("sell-status").textContent = msg || ""; }

  /* ---- validation: the words of ruling §2.2; the server checks the same and the API stays the authority ---- */
  var handleState = "";
  function validate(manual) {
    var e = {};
    var dn = val("display_name"); if (dn.length < 2 || dn.length > 60) e.display_name = T.name.error;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("contact_email")) || val("contact_email").length > 254) e.contact_email = T.email.error;
    if (!/^[a-z0-9-]{3,40}$/.test(val("handle"))) e.handle = T.handle.rule;
    else if (handleState === "taken") e.handle = T.handle.taken;
    else if (handleState === "reserved") e.handle = T.handle.reserved;
    if (!val("country")) e.country = T.country.error;
    else if (excluded.indexOf(val("country")) >= 0) e.country = T.country.excluded;
    if (!val("consent")) e.consent = T.consentError;
    if (manual && !/^0x[0-9a-fA-F]{40}$/.test(val("address"))) e.address = "Wallet address must be 0x followed by 40 hex characters.";
    return e;
  }
  var FIELD_NAMES = ["display_name", "contact_email", "handle", "country", "consent", "address", "chain_id"];
  var shownErr = {};
  function showErrors(e) {
    FIELD_NAMES.forEach(function (n) {
      shownErr[n] = e[n] || "";
      if (n === "handle") { if (e[n]) handleHelp(e[n], "bad"); } else setErr(n, e[n] || "");
    });
    if (e.address || e.chain_id) manualBox.open = true;
    var first = FIELD_NAMES.filter(function (n) { return e[n]; })[0]; if (first && f(first).focus) f(first).focus();
  }
  /* After a submit attempt a field that shows an error is re-checked as it changes; the others stay quiet. */
  function liveRevalidate(ev) {
    var n = ev.target && ev.target.name; if (!n || n === "handle" || !shownErr[n]) return;
    var e = validate(n === "address"); shownErr[n] = e[n] || ""; setErr(n, e[n] || "");
  }
  form.addEventListener("input", liveRevalidate);
  form.addEventListener("change", liveRevalidate);

  /* ---- page address: filled from the name until the seller edits it; live check, 300 ms debounce ---- */
  var timer = null, seq = 0, suggesting = false, handleOwn = !!val("handle");
  /* an error is the same element as every field error (setErr: icon, .help.err, aria-invalid); the other states use the hint line */
  function handleHelp(msg, kind) {
    var h = $("f-handle-h");
    if (kind === "bad" && msg) { h.textContent = ""; h.className = "help"; setErr("handle", msg); return; }
    setErr("handle", ""); h.textContent = msg; h.className = "help" + (kind === "ok" ? " ok" : "");
  }
  function slug(s) { return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, ""); }
  f("display_name").addEventListener("input", function () {
    if (handleOwn) return;
    suggesting = true; f("handle").value = slug(val("display_name")); f("handle").dispatchEvent(new Event("input")); suggesting = false;
  });
  f("handle").addEventListener("input", function () {
    if (!suggesting) handleOwn = !!this.value;
    var h = val("handle").toLowerCase(); this.value = h; handleState = ""; clearTimeout(timer); setErr("handle", ""); seq++;
    if (!h) { handleHelp(""); return; }
    if (!/^[a-z0-9-]{3,40}$/.test(h)) { handleState = "invalid"; handleHelp(suggesting ? "" : T.handle.rule, "bad"); return; }
    handleHelp(T.handle.checking);
    var my = seq;
    timer = setTimeout(function () {
      fetch(API + "/handles/" + encodeURIComponent(h)).then(function (r) { return r.json(); }).then(function (j) {
        if (my !== seq) return;
        if (j.available) { handleState = "available"; handleHelp(T.handle.available, "ok"); }
        else if (j.reason === "taken") { handleState = "taken"; handleHelp(T.handle.taken, "bad"); }
        else if (j.reason === "reserved") { handleState = "reserved"; handleHelp(T.handle.reserved, "bad"); }
        else { handleState = "invalid"; handleHelp(T.handle.rule, "bad"); }
      }).catch(function () { if (my === seq) { handleState = ""; handleHelp(T.handle.unchecked); } });
    }, 300);
  });

  /* ---- country: a suggestion from the browser's language region (en-GB -> GB) while none is chosen, never an excluded
   * country (the select then stays on "Choose a country", no hint, no error); the hint shows only while the value is the
   * suggestion; an excluded country the person picks is refused at once ---- */
  (function () {
    var c = f("country"); if (c.value) return;
    var m = /-([A-Za-z]{2})\b/.exec((navigator.languages && navigator.languages[0]) || navigator.language || "");
    var code = m && m[1].toUpperCase();
    if (code && excluded.indexOf(code) < 0 && qa("option", c).some(function (o) { return o.value === code; })) {
      c.value = code; $("f-country-h").textContent = T.country.suggested;
    }
  })();
  f("country").addEventListener("change", function () {
    $("f-country-h").textContent = "";
    var bad = excluded.indexOf(val("country")) >= 0 ? T.country.excluded : "";
    if (bad || shownErr.country) { shownErr.country = bad; setErr("country", bad); }
  });

  /* ---- the button: connect, sign, submit ---- */
  var busy = false;
  function loading(on) {
    busy = on; var b = $("submit-btn"); b.setAttribute("aria-disabled", on ? "true" : "false"); b.setAttribute("aria-busy", on ? "true" : "false");
    qa(".spin", form).forEach(function (s) { s.hidden = !on; }); form.setAttribute("aria-busy", on ? "true" : "false");
  }
  function short(a) { return a.slice(0, 6) + "…" + a.slice(-4); }
  function useWallet(r) {
    var chain = CHAINS.indexOf(r.chainId) >= 0 ? r.chainId : CHAINS[0];
    f("address").value = r.address; f("chain_id").value = String(chain);
    $("wallet-short").textContent = short(r.address); $("wallet-chosen").hidden = false;
  }
  document.addEventListener("soukbase:wallet", function (ev) {
    if (!busy) return;
    var st = ev.detail && ev.detail.state;
    if (st === "choosing") status(T.status.choose); else if (st === "connecting") status(T.status.connect); else if (st === "signing") status(T.status.sign);
  });
  function hidden(name, value) { var i = f(name); if (!i || i.type !== "hidden") { i = document.createElement("input"); i.type = "hidden"; i.name = name; form.appendChild(i); } i.value = value; }
  function formBody() { var o = {}; qa("input,select,textarea", form).forEach(function (e) { if (!e.name || e.type === "submit") return; if (e.type === "checkbox") { if (e.checked) o[e.name] = "yes"; } else o[e.name] = e.value; }); return o; }
  function handled() { var e = new Error("handled"); e.handled = true; return e; }
  function fail(err) {
    if (err && err.handled) return;
    var c = err && err.code;
    if (c === "cancelled") return;
    if (c === 4001) banner(T.errors.declined);
    else if (c === "no_wallet") { manualBox.open = true; banner(T.errors.noWallet); }
    else if (c === "bad_signature") banner(T.errors.contract);
    else if (c === "network") banner(T.errors.network);
    else banner((err && err.userMessage) || T.errors.network);
  }
  function go() {
    loading(true); status(T.status.connect);
    Promise.resolve().then(function () { return wallet().connect({ anyChain: true }); }).then(function (r) {
      if (r.manual) { manualBox.open = true; banner(T.errors.noWallet); throw handled(); }
      useWallet(r);
      return fetch("/sell/message", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(formBody()) })
        .then(null, function () { var e = new Error("network"); e.code = "network"; throw e; })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (j) {
            if (res.status === 200 && typeof j.message === "string") return j;
            if (res.status === 422 && j.errors) { showErrors(j.errors); throw handled(); }
            if (j.code === "seller_exists") { banner(T.errors.exists, "/manage"); throw handled(); }
            banner(j.error || T.errors.network); throw handled();
          });
        });
    }).then(function (m) {
      status(T.status.sign);
      return wallet().signMessage(m.message, val("address"), { quiet: true }).then(function (sig) {
        status(T.status.creating);
        hidden("stage", "bind"); hidden("message", m.message); hidden("signature", sig); hidden("via", "wallet");
        form.setAttribute("action", "/sell/send");
        HTMLFormElement.prototype.submit.call(form); /* the page moves on; the button stays busy */
      });
    }).catch(function (err) { status(""); loading(false); fail(err); });
  }
  var via = "wallet";
  $("submit-btn").addEventListener("click", function () { via = "wallet"; });
  $("manual-btn").addEventListener("click", function () { via = "manual"; });
  $("wallet-change").addEventListener("click", function () {
    if (busy || !wallet()) return;
    Promise.resolve().then(function () { return wallet().connect({ anyChain: true, force: true }); }).then(function (r) { if (!r.manual) useWallet(r); }, fail);
  });
  form.addEventListener("submit", function (ev) {
    if (busy) { ev.preventDefault(); return; }
    var manual = via === "manual"; via = "wallet";
    banner(""); var e = validate(manual); showErrors(e);
    if (Object.keys(e).length) { ev.preventDefault(); return; }
    if (manual) return; /* plain POST: the next page shows the message and a signature field */
    ev.preventDefault();
    if (!wallet()) { manualBox.open = true; banner(T.errors.noWallet); return; }
    go();
  });
})();
