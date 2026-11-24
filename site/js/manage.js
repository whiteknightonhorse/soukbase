/* Soukbase seller manage pages: progressive enhancement. Without this file every page works as plain HTML forms.
 * Sign-in page: one button (window.SoukbaseWallet from wallet-connect.js) connects, signs the session message,
 * then a real form POST to /manage/signin sets the cookie and redirects, as the no-JS path does. The paste page gets "Sign with your wallet".
 * Overview: copy buttons (the publish command, the APIbase form values), local times, History read marks.
 * Listing form: an error leaves when its field is changed (T-0872).
 * Status watch (T-0878, T-0883): the page reloads itself when a listing's state changed, and says when it stops. */
(function () {
  "use strict";
  var d = document, $ = function (i) { return d.getElementById(i); };
  var W = function () { return window.SoukbaseWallet || null; };
  /* T-0931: the legal-change line leaves on its effective date (the server prints it without reading the clock). */
  var lc = $("legal-change");
  if (lc && new Date().toISOString().slice(0, 10) >= lc.getAttribute("data-until")) lc.hidden = true;
  /* T-0851: a form that comes back with errors starts at its summary; each link in it jumps to the field. */
  var sum = d.querySelector(".errsum");
  if (sum) sum.focus();
  /* T-0872: an error leaves when its field is changed. One delegated listener per form that shows an error; the field is the control's name k,
   * its line is #f-<k>-e, its summary item the <li> whose link is #f-<k>. The heading words and number words come from the data attributes of .errsum.
   * Capture phase: it runs before a control's own listener (the refund chips remove their line themselves). No validation here; the server judges after Send. */
  Array.prototype.forEach.call(d.forms, function (form) {
    if (!form.querySelector('[aria-invalid="true"]') && !d.querySelector(".errsum")) return;
    form.addEventListener("change", function (ev) {
      var k = ev.target && ev.target.name, line = k && $("f-" + k + "-e");
      if (!line) return;
      var lid = line.id;
      line.remove();
      Array.prototype.forEach.call(form.elements, function (c) {
        if (c.name !== k) return;
        c.removeAttribute("aria-invalid");
        var ids = (c.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (x) { return x && x !== lid; });
        if (ids.length) c.setAttribute("aria-describedby", ids.join(" ")); else c.removeAttribute("aria-describedby");
      });
      var box = $("seg-" + k); if (box) box.classList.remove("bad");
      var s = d.querySelector(".errsum"); if (!s) return;
      Array.prototype.forEach.call(s.querySelectorAll("li"), function (li) {
        var a = li.querySelector("a"); if (a && a.getAttribute("href") === "#f-" + k) li.remove();
      });
      var n = s.querySelectorAll("li").length;
      if (!n) { s.remove(); return; }
      var words = []; try { words = JSON.parse(s.getAttribute("data-words") || "[]"); } catch (x) { /* keep the heading */ }
      var h = s.querySelector(".errsum-h");
      if (h) h.textContent = n === 1 ? s.getAttribute("data-head-one") : (n < 10 && words[n] ? words[n] : String(n)) + " " + s.getAttribute("data-head-many");
    }, true);
  });
  Array.prototype.forEach.call(d.querySelectorAll("[data-copy]"), function (b) {
    b.hidden = false;
    b.addEventListener("click", function () {
      var text = $(b.getAttribute("data-copy")).textContent, s = b.querySelector("span") || b, was = s.textContent;
      var ok = function () { s.textContent = "Copied"; setTimeout(function () { s.textContent = was; }, 2000); };
      var bad = function () { s.textContent = "Copy failed. Select the text and copy it by hand."; };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, bad); return; }
      var ta = d.createElement("textarea"); ta.value = text; d.body.appendChild(ta); ta.select();
      try { d.execCommand("copy"); ok(); } catch (x) { bad(); }
      ta.remove();
    });
  });
  /* Times the server printed in UTC (the title keeps the UTC value) show in the reader's local time, always with the zone name.
   * Plain data-local: "HH:MM zone", with "D Mon " in front when the local day is not today. data-local="day": "D Mon YYYY HH:MM zone".
   * Without Intl, formatToParts or a timeZoneName part the server text stays. */
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var zoneOf = function (x) {
    try {
      if (typeof Intl === "undefined" || !Intl.DateTimeFormat) return "";
      var f = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
      if (!f.formatToParts) return "";
      var p = f.formatToParts(x);
      for (var i = 0; i < p.length; i++) if (p[i].type === "timeZoneName" && p[i].value) return p[i].value;
    } catch (e) { /* keep the server text */ }
    return "";
  };
  Array.prototype.forEach.call(d.querySelectorAll("time[data-local]"), function (t) {
    var x = new Date(t.getAttribute("datetime"));
    if (isNaN(x.getTime())) return;
    var z = zoneOf(x);
    if (!z) return;
    var hm = ("0" + x.getHours()).slice(-2) + ":" + ("0" + x.getMinutes()).slice(-2);
    var day = x.getDate() + " " + MON[x.getMonth()];
    var n = new Date();
    if (t.getAttribute("data-local") === "day") t.textContent = day + " " + x.getFullYear() + " " + hm + " " + z;
    else if (x.getFullYear() === n.getFullYear() && x.getMonth() === n.getMonth() && x.getDate() === n.getDate()) t.textContent = hm + " " + z;
    else t.textContent = day + " " + hm + " " + z;
  });
  /* History: the first time it is opened, mark the notices that were new as read. */
  var hi = $("history");
  if (hi && hi.getAttribute("data-unread") && window.fetch) hi.addEventListener("toggle", function once() {
    if (!hi.open) return;
    hi.removeEventListener("toggle", once);
    fetch(hi.getAttribute("data-read-url"), { method: "POST", credentials: "same-origin", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "ids=" + encodeURIComponent(hi.getAttribute("data-unread")) });
  });
  /* T-0960: a link to #history (the "See sales" link) and a page load with that hash open the History fold; without script the link only scrolls to it. */
  var ho = function () { if (hi && hi.tagName === "DETAILS") hi.open = true; };
  if (location.hash === "#history") ho();
  Array.prototype.forEach.call(d.querySelectorAll('a[href="#history"]'), function (a) { a.addEventListener("click", ho); });
  /* T-0878, T-0883: on <main data-watch-url data-watch=token> ask for the token every 30 s while visible, and at once when the tab is shown again
   * (not within 5 s of the last ask, one in flight, 120 at most). New token: reload, or #watch-update when the seller is busy or a confirmation
   * banner ([data-flash], T-0940) is on the page: the page that confirms the money step is never reloaded away. A failed ask is tried
   * again; sign-out, 403, 404, a redirect and the cap stop the watch and show #watch-stopped. Only `hidden` is toggled. */
  var wm = d.querySelector("main[data-watch-url]"), wn = 0, wf = 0, wl = 0, wp = 0, wx = 0;
  if (wm && window.fetch) {
    var ws = function (id) { ["watch-note", "watch-update", "watch-stopped"].forEach(function (k) { if ($(k)) $(k).hidden = k !== id; }); };
    var wb = function () {
      var a = d.activeElement;
      return !!((a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) || (window.getSelection && String(window.getSelection())) || d.querySelector("details.change[open]"));
    };
    var wt = function () {
      if (wx || wp) return;
      wp = 1;
      setTimeout(function () { wp = 0; wa(); if (!wf) wt(); }, 30000);
    };
    var wa = function (soon) {
      if (wx || wf || d.visibilityState !== "visible" || (soon && Date.now() - wl < 5000)) return;
      wf = 1; wl = Date.now(); wn++;
      fetch(wm.getAttribute("data-watch-url"), { credentials: "same-origin", redirect: "manual" }).then(function (r) {
        if (r.type === "opaqueredirect" || /^40[134]$/.test(r.status)) return 0;
        if (r.status !== 200) throw r;
        return r.json().then(function (j) { if (!j || typeof j.token !== "string") throw j; return j.token; });
      }).catch(function () { return null; }).then(function (t) {
        wf = 0;
        if (t !== 0 && t !== null) {
          if (t === wm.getAttribute("data-watch")) ws("watch-note");
          else if (d.querySelector("[data-flash]") || wb()) ws("watch-update");
          else return location.reload();
        }
        if (t === 0 || wn >= 120) { wx = 1; ws("watch-stopped"); return; }
        wt();
      });
    };
    d.addEventListener("visibilitychange", function () { wa(1); });
    window.addEventListener("pageshow", function (e) { if (e.persisted) wa(1); });
    ws("watch-note"); wt();
  }
  /* T-0908: the paste page (/sell/message answer): with a browser wallet "Sign with your wallet" signs the shown message and submits it as via=manual-with-wallet. */
  var pb = $("sign-with-wallet");
  if (pb && W()) {
    var pf = pb.form, ps = pf.querySelector("[type=submit]");
    W().ready(400).then(function (ok) { if (ok) { pb.hidden = false; ps.className = "btn btn-secondary"; } });
    pb.addEventListener("click", function () {
      pb.disabled = true;
      W().connect({ anyChain: true }).then(function () {
        return W().signMessage(pf.elements.message.value, pf.elements.address.value, { quiet: true });
      }).then(function (sig) {
        pf.elements.signature.value = sig; pf.elements.via.value = "manual-with-wallet";
        HTMLFormElement.prototype.submit.call(pf);
      }).catch(function (x) {
        pb.disabled = false;
        if (!(x && (x.userMessage || x.code === "cancelled"))) $("wallet-state").textContent = "Signature rejected. Nothing was sent. Approve the signature in your wallet to continue.";
      });
    });
  }
  var f = $("signin-form");
  if (!f) return;
  /* T-0908: the page is final as the server prints it: one primary button, the fold closed. A press asks the wallet (EIP-6963 again, up to 400 ms), connects (the wallet window opens and asks for the account, T-0921),
   * signs the session message and posts /manage/signin. No wallet: the fold opens and nothing is sent. Only "Continue by hand" is a plain POST to /sell/message.
   * The message lands in the closed "What you sign" (#wallet-fold, shown when signing starts, never opened). Texts come from the page (data-texts). */
  var T = JSON.parse(f.getAttribute("data-texts") || "{}"), err = $("form-error"), btn = $("signin-btn"), fold = $("wallet-fold"), man = $("signin-manual"), other = $("signin-other"), label = btn.textContent, byHand = false;
  if (other) other.hidden = false;
  d.addEventListener("soukbase:wallet", function (e) { if (e.detail && e.detail.state === "signing") fold.hidden = false; });
  $("signin-manual-btn").addEventListener("click", function () { byHand = true; });
  var back = function () { btn.disabled = false; btn.textContent = label; };
  var none = function () { back(); man.open = true; f.elements.address.focus(); err.textContent = T.none; err.hidden = false; };
  var run = function () {
    btn.disabled = true; btn.textContent = T.busy; err.hidden = true;
    Promise.resolve(W() ? W().ready(400) : false).then(function (ok) {
      if (!ok) { none(); return; }
      /* T-0921: every connect() opens the wallet and asks for the account; the account it returns goes into the request, never into the hand field */
      return W().connect().then(function (r) {
        var ch = f.elements.chain_id, cid = ch ? ch.value : "";
        if (r.chainId && ch && ch.options && Array.prototype.some.call(ch.options, function (o) { return o.value === String(r.chainId); })) cid = String(r.chainId);
        return W().sign("session", { address: r.address, chain_id: cid });
      }).then(function (s) {
        var g = d.createElement("form"); g.method = "post"; g.action = "/manage/signin";
        [["message", s.message], ["signature", s.signature], ["to", f.elements.to ? f.elements.to.value : ""], ["via", "wallet"]].forEach(function (p) {
          var i = d.createElement("input"); i.type = "hidden"; i.name = p[0]; i.value = p[1]; g.appendChild(i);
        });
        d.body.appendChild(g); g.submit();
      });
    }).catch(function (x) {
      back();
      var e2 = x && x.body && x.body.errors;
      if (x && (x.userMessage || x.code === "cancelled")) return; /* wallet-connect.js already shows it in #wallet-state */
      err.textContent = (e2 && (e2.address || e2.chain_id)) || "Signature rejected. Nothing was sent. Approve the signature in your wallet to continue.";
      err.hidden = false;
    });
  };
  if (other) other.addEventListener("click", function () { if (!btn.disabled) run(); });
  f.addEventListener("submit", function (e) {
    var hand = byHand || man.contains(d.activeElement); byHand = false;
    if (hand) return; /* plain POST: the next page shows the message and a signature field */
    e.preventDefault();
    if (!btn.disabled) run();
  });
})();
