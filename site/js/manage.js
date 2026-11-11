/* Soukbase seller manage pages: progressive enhancement. Without this file every page works as plain HTML forms.
 * Sign-in page: the wallet button (window.SoukbaseWallet from wallet-connect.js, unchanged) signs the session message,
 * then a real form POST to /manage/signin sets the cookie and redirects, as the no-JS path does.
 * Overview: copy buttons (the publish command, the APIbase form values), local times, History read marks. */
(function () {
  "use strict";
  var d = document, $ = function (i) { return d.getElementById(i); };
  var W = function () { return window.SoukbaseWallet || null; };
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
  var f = $("signin-form");
  if (!f) return;
  var c = $("wallet-connect"), err = $("form-error"), on = false;
  var show = function () { if (W() && c) { c.hidden = false; c.closest(".row").hidden = false; } };
  show(); window.addEventListener("load", show);
  if (c) c.addEventListener("click", function () {
    c.disabled = true; /* wallet-connect.js writes the state text and the reason when it fails */
    W().connect().then(function (r) {
      f.elements.address.value = r.address; on = true;
      var ch = f.elements.chain_id;
      if (r.chainId && ch && ch.options && Array.prototype.some.call(ch.options, function (o) { return o.value === String(r.chainId); })) ch.value = String(r.chainId);
    }).catch(function () { on = false; }).then(function () { c.disabled = false; });
  });
  f.addEventListener("submit", function (e) {
    if (!on || !W()) return; /* plain POST: the next page shows the message and a signature field */
    e.preventDefault();
    var btn = f.querySelector("[type=submit]");
    btn.disabled = true; err.hidden = true;
    W().sign("session", { address: f.elements.address.value.trim(), chain_id: f.elements.chain_id.value }).then(function (s) {
      var g = d.createElement("form"); g.method = "post"; g.action = "/manage/signin";
      [["message", s.message], ["signature", s.signature], ["to", f.elements.to ? f.elements.to.value : ""]].forEach(function (p) {
        var i = d.createElement("input"); i.type = "hidden"; i.name = p[0]; i.value = p[1]; g.appendChild(i);
      });
      d.body.appendChild(g); g.submit();
    }).catch(function (x) {
      btn.disabled = false;
      var e2 = x && x.body && x.body.errors;
      if (x && x.userMessage) return; /* wallet-connect.js already shows it in #wallet-state */
      err.textContent = (x && x.userMessage) || (e2 && (e2.address || e2.chain_id)) || "Signature rejected. Nothing was sent. Approve the signature in your wallet to continue.";
      err.hidden = false;
    });
  });
})();
