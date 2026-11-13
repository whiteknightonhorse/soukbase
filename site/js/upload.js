/* The "File" block of the listing form and the edit page (T-0779, T-0809). Progressive enhancement: without this file the block is a
 * link (new tab) and a "Refresh status" button, both server-rendered. Here: "Choose a file" is a label for a file input inside the
 * block. When a file is chosen the script asks the seller's own page (/s/<handle>/manage/uploads, which holds the session) for an
 * upload, sends the file straight to the files service with one PUT (progress in the block, Cancel aborts), and then reads the
 * state from the catalogue only: every 2 seconds for the first 30 seconds, then every 5 seconds, for at most 30 minutes.
 * The words match src/web/file-block.ts (test/browser/upload.test.ts compares them). */
(function () {
  "use strict";
  var d = document, win = window;
  var POLL_FAST_MS = 2000, POLL_FAST_FOR_MS = 30000, POLL_SLOW_MS = 5000, POLL_MAX_MS = 1800000;
  var GIB = 1073741824;
  var FORMATS = { "application/pdf": "PDF", "application/epub+zip": "EPUB", "application/zip": "ZIP", "text/plain": "Text", "text/markdown": "Markdown", "application/json": "JSON", "application/x-ndjson": "JSONL", "text/csv": "CSV", "image/png": "PNG", "image/jpeg": "JPEG", "image/webp": "WebP" };
  var REASONS = {
    too_large: "The file is bigger than the space you have left. Choose a smaller file.",
    type_not_allowed: "Use a type accepted for this category (table in /docs/sellers). DOCX, XLSX and PPTX are not accepted; export PDF or EPUB.",
    type_mismatch: "The content of the file does not match its extension. Save it in the format its name says, then choose it again.",
    pdf_scripts: "The PDF has scripts, attached files or automatic actions. Open it, choose Print, then Save as PDF, and upload that copy.",
    pdf_encrypted: "The PDF is encrypted. Save a copy without a password.",
    zip_unsafe: "The archive has unsafe entries: encrypted, links, odd paths or programs. Make a plain ZIP without them, then choose it again.",
    malware: "The file did not pass the virus check. Choose a clean copy; if you think the check is wrong, write to support@soukbase.com.",
    unstampable: "Soukbase could not prepare this file for personal copies. Export it again from the program that made it and choose the new copy; if it fails again, write to support@soukbase.com.",
    quota_exceeded: "You are over your 1 GiB of hosted files. Choose a smaller file, or write to support@soukbase.com.",
    service_full: "The files service is full. This is on our side. Try again in an hour."
  };
  var REASON_LINK = { pdf_scripts: { href: "/docs/sellers.md#pdf-files", label: "PDF rules" } };
  var CHECKING_SUB = "Usually under a minute. You can send the listing now; the check finishes by itself.";
  var WAIT_TEXT = "Wait until the upload finishes.";
  var NOTE_REST = "Replacing the file sends this listing back to review.";
  var NOTE_CHOSEN = "New file chosen. Saving sends this listing back to review.";
  var ICONS = {
    plain: "",
    now: '<span class="fb-dot"></span>',
    auto: '<svg width="12" height="12" viewBox="0 0 12 12" focusable="false"><circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 3.2V6l1.8 1.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    ok: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="12" fill="#0B7A44"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#FFFDF9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    attn: "!"
  };
  /* the no-JS link words and the picker words they become */
  var PICK = { "Upload the file": "Choose a file", "Upload another file": "Choose another file" };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); };
  var size = function (n) {
    if (n <= 0) return "0 MB";
    if (n >= GIB) return (n / GIB).toFixed(1) + " GiB";
    if (n >= 1048576) return (n / 1048576).toFixed(1) + " MB";
    return Math.max(1, Math.round(n / 1024)) + " KB";
  };
  var formatOf = function (m) { return m ? FORMATS[m] || m : "file"; };

  /* cur: the file the listing holds (or null); up: an upload view, what the browser is doing, "unavailable" or null.
   * Same decisions as describeFile() in file-block.ts. */
  function describe(cur, up, o) {
    o = o || {};
    var curName = (cur && cur.name) || "the current file";
    var ready = function (name, bytes, mime, sha) {
      return { state: "ready", kind: "ok", main: name || "Your file", sub: [bytes == null ? "" : size(bytes), formatOf(mime), "ready", sha ? "sha256 " + sha.slice(0, 8) : ""].filter(Boolean).join(" · "), btn: "Replace" };
    };
    var checking = function (name) { return { state: "scanning", kind: "auto", main: "Checking " + (name || "the file"), sub: CHECKING_SUB, btn: "" }; };
    if (up === "unavailable") return { state: "unavailable", kind: "attn", main: o.error ? "Could not start the upload" : "Status not available", sub: o.error || "Press Refresh status, or try again in a minute.", btn: "" };
    if (!up) {
      if (!cur) return { state: "none", kind: "plain", main: "No file yet", sub: o.quota ? "Used " + size(o.quota.used) + " / " + size(o.quota.max) : "Up to 1 GiB of files in all", btn: "Choose a file" };
      if (cur.ready) return ready(cur.name, cur.bytes, cur.mime, cur.sha256);
      return checking(cur.name);
    }
    switch (up.state) {
      case "uploading":
        return { state: "uploading", kind: "now", main: up.name, sub: "Uploading · " + size(up.loaded) + " of " + size(up.total) + " · keep this page open", btn: "", pct: up.total > 0 ? Math.min(100, Math.floor(up.loaded / up.total * 100)) : 0 };
      case "toolarge":
        return { state: "toolarge", kind: "attn", main: "This file does not fit", sub: "It is larger than the space you have left (" + size(up.free) + ").", btn: "Choose a file" };
      case "failed": case "started": case "expired":
        return { state: "failed", kind: "attn", main: "Upload did not finish", sub: "Choose the file again.", btn: "Choose a file" };
      case "scanning":
        return cur ? { state: "replacing", kind: "now", main: "Replacing " + curName, sub: "Checking the new file · the current file stays until it is ready.", btn: "" } : checking(up.name);
      case "ready": return ready(up.name, up.bytes, up.mime, up.sha256);
      case "rejected": return { state: "rejected", kind: "attn", main: "File not accepted", sub: REASONS[up.reason] || "The file was not accepted. Choose another file; if it repeats, write to support@soukbase.com.", btn: "Choose another file", link: REASON_LINK[up.reason] || null };
      case "deleted": return { state: "deleted", kind: "plain", main: "File removed", sub: "Upload a file to deliver.", btn: "Choose a file" };
    }
    return describe(cur, "unavailable");
  }

  /* Same rule as fileChosen() in file-block.ts: a file is chosen while it is sent, checked, or ready and not the current file */
  function chosen(cur, up) {
    if (!up || up === "unavailable") return false;
    if (up.state === "uploading" || up.state === "scanning") return true;
    return up.state === "ready" && !(cur && up.sha256 && up.sha256 === cur.sha256);
  }

  function init(el) {
    var api = el.getAttribute("data-api"), listingId = el.getAttribute("data-listing-id");
    var form = el.closest("form"), row = el.querySelector(".fb"), idWrap = el.querySelector(".fb-id");
    var input = el.querySelector('input[name="upload_id"]');
    if (!api || !row || !input || !win.fetch || !win.XMLHttpRequest) return;
    var cur = el.hasAttribute("data-cur-mime") ? { name: el.getAttribute("data-cur-name") || null, bytes: Number(el.getAttribute("data-cur-bytes")), mime: el.getAttribute("data-cur-mime"), sha256: el.getAttribute("data-cur-sha"), ready: el.getAttribute("data-cur-ready") === "1" } : null;
    var quota = el.hasAttribute("data-quota-used") ? { used: Number(el.getAttribute("data-quota-used")), max: Number(el.getAttribute("data-quota-max")) } : null;
    var timer = 0, waited = 0, run = 0; /* run: the number of the choice being handled; a new choice or Cancel makes older callbacks stale */
    var xhr = null, busy = false; /* busy: a file is being sent (FB2); only then the form waits and the page asks before it is left */
    var live = null; /* the file name of the upload whose bytes reached the service */
    if (idWrap) idWrap.hidden = true; /* the id lives in the page now; the box and "Refresh status" are for the no-JS path */

    /* T-0807: a ready file fills an empty Formats field with the label the block shows, unless the seller typed in it */
    var fmt = form && form.elements.attr_formats;
    if (fmt) fmt.addEventListener("input", function () { fmt.setAttribute("data-edited", "1"); });
    function fillFormats(s, up) {
      var src = up && up !== "unavailable" ? up : !up ? cur : null;
      if (!fmt || s.state !== "ready" || !src || !src.mime || fmt.value.trim() !== "" || fmt.hasAttribute("data-edited")) return;
      fmt.value = formatOf(src.mime);
    }
    function picker(label) {
      return '<label class="btn btn-secondary fb-act fb-pick"' + (el.querySelector("#fb-warn") && label === "Replace" ? ' aria-describedby="fb-warn"' : "") + '><input type="file" class="fb-file"><span>' + esc(label) + "</span></label>";
    }
    function wire() {
      var f = row.querySelector(".fb-file");
      if (f) f.addEventListener("change", function () { var file = f.files && f.files[0]; if (file) choose(file); f.value = ""; });
      var c = row.querySelector(".fb-cancel");
      if (c) c.addEventListener("click", cancel);
    }
    function show(up, o) {
      var s = describe(cur, up, o);
      fillFormats(s, up);
      if (up && up !== "unavailable" && up.quota) quota = up.quota;
      if (up && up !== "unavailable" && up.quota && s.state === "none") s.sub = "Used " + size(up.quota.used) + " / " + size(up.quota.max);
      if (s.state !== "uploading") clearWait();
      var bar = s.pct === undefined ? "" : '<progress class="fb-bar" max="100" value="' + s.pct + '" aria-label="Upload"></progress>';
      row.className = "fb fb-" + s.kind;
      row.setAttribute("data-fb-state", s.state);
      row.innerHTML = '<span class="fb-ic" aria-hidden="true">' + ICONS[s.kind] + '</span><span class="fb-t"><span class="fb-main">' + esc(s.main) + "</span>" + bar + '<span class="fb-sub">' + esc(s.sub) + (s.link ? ' <a href="' + esc(s.link.href) + '">' + esc(s.link.label) + "</a>" : "") + "</span></span>" +
        (s.btn ? picker(s.btn) : "") + (s.pct === undefined ? "" : '<button type="button" class="fb-cancel">Cancel</button>');
      wire();
      var note = el.querySelector("#fb-warn"); /* only the edit form of a listing in the shop has it */
      if (note) {
        var c = chosen(cur, up);
        note.className = c ? "fb-warn" : "help";
        note.innerHTML = (c ? '<span class="fb-bang" aria-hidden="true">!</span>' : "") + esc(c ? NOTE_CHOSEN : NOTE_REST);
      }
      return s;
    }
    function progress(file, loaded, total) {
      var s = describe(cur, { state: "uploading", name: file.name, loaded: loaded, total: total });
      var bar = row.querySelector(".fb-bar"), sub = row.querySelector(".fb-sub");
      if (!bar || !sub) return show({ state: "uploading", name: file.name, loaded: loaded, total: total });
      bar.value = s.pct;
      sub.textContent = s.sub;
    }

    /* "Send for review" while the bytes are still going: stopped, with the reason under the button (FB9) */
    function clearWait() { var w = d.getElementById("fb-wait"); if (w && w.parentNode) w.parentNode.removeChild(w); }
    function showWait() {
      if (d.getElementById("fb-wait")) return;
      var btn = form && form.querySelector('.submit-row button[type="submit"]');
      if (!btn) return;
      var w = d.createElement("span");
      w.id = "fb-wait"; w.className = "help err fb-wait"; w.setAttribute("role", "alert");
      w.textContent = WAIT_TEXT;
      btn.parentNode.insertBefore(w, btn.nextSibling);
    }
    if (form) form.addEventListener("submit", function (ev) { if (busy) { ev.preventDefault(); showWait(); } });
    /* leaving the page while bytes are being sent asks first; in every other state the page leaves quietly */
    win.addEventListener("beforeunload", function (ev) { if (!busy) return; ev.preventDefault(); ev.returnValue = ""; });

    function stop() { if (timer) win.clearTimeout(timer); timer = 0; }
    function read() {
      var id = input.value;
      if (!id) return Promise.resolve(null);
      return win.fetch(api + "/" + encodeURIComponent(id), { credentials: "same-origin", headers: { accept: "application/json" } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, json: j }; }); })
        .catch(function () { return null; }); /* a failed read keeps what is on screen; the poll tries again */
    }
    /* the state is read from the catalogue only (data-api/<upload_id>) */
    function poll(me) {
      stop();
      var delay = waited < POLL_FAST_FOR_MS ? POLL_FAST_MS : POLL_SLOW_MS;
      timer = win.setTimeout(function () {
        timer = 0;
        waited += delay;
        if (me !== run) return;
        if (waited > POLL_MAX_MS) return; /* give up quietly; a reload reads the upload again */
        read().then(function (r) {
          if (me !== run) return;
          if (r === null || r.status >= 500 || r.status === 429) return poll(me); /* a lost read: next tick */
          if (r.status !== 200) { show("unavailable"); return; }
          var up = r.json;
          /* the bytes arrived: until the files service reports, the catalogue may still say "started" */
          if (live !== null && up.state === "started") up = { state: "scanning", reason: null, name: live, bytes: null, sha256: null, mime: null, quota: up.quota };
          if (live !== null && up.state === "scanning" && !up.name) up.name = live;
          var s = show(up);
          if (s.state === "scanning" || s.state === "replacing") poll(me);
          else if (s.state === "ready" || s.state === "rejected") live = null;
        });
      }, delay);
    }

    function fail(me) { if (me !== run) return; busy = false; xhr = null; input.value = ""; show({ state: "failed" }); }
    function choose(file) {
      var c = form ? form.querySelector('input[name="category"]:checked') : null;
      if (!c) { show("unavailable", { error: "Choose a category first." }); return; }
      var free = quota ? quota.max - quota.used : GIB;
      if (file.size > free) { show({ state: "toolarge", free: Math.max(0, free) }); return; } /* nothing is sent */
      stop();
      var me = ++run; /* a new choice always mints a new upload */
      waited = 0; live = null; input.value = ""; busy = true;
      input.dispatchEvent(new win.Event("change", { bubbles: true })); /* T-0872: the error about the earlier file leaves (manage.js) */
      show({ state: "uploading", name: file.name, loaded: 0, total: file.size });
      var body = { category: c.value };
      if (listingId) body.listing_id = listingId;
      win.fetch(api, { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, json: j }; }); })
        .then(function (r) {
          if (me !== run) return;
          if (r.status !== 201 || !r.json.popup_url || !r.json.upload_id) {
            busy = false;
            show("unavailable", { error: r.json.error || "Try again in a minute." });
            return;
          }
          send(me, file, r.json.upload_id, r.json.popup_url);
        })
        .catch(function () { if (me !== run) return; busy = false; show("unavailable", { error: "Try again in a minute." }); });
    }
    /* one PUT, the body is the File, the name goes in ?name= as the files page sends it, no credentials */
    function send(me, file, id, url) {
      var x = new win.XMLHttpRequest();
      xhr = x;
      x.open("PUT", url + (url.indexOf("?") < 0 ? "?" : "&") + "name=" + encodeURIComponent(file.name));
      x.setRequestHeader("Accept", "application/json");
      x.upload.onprogress = function (e) { if (me === run && e.lengthComputable) progress(file, e.loaded, e.total); };
      x.onload = function () {
        if (me !== run) return;
        if (x.status !== 202) return fail(me);
        busy = false; xhr = null;
        input.value = id; live = file.name;
        show({ state: "scanning", reason: null, name: file.name, bytes: null, sha256: null, mime: null, quota: quota || { used: 0, max: GIB } });
        poll(me);
      };
      x.onerror = function () { fail(me); };
      x.onabort = function () { fail(me); }; /* Cancel makes this callback stale first, see cancel() */
      x.send(file);
    }
    function cancel() {
      var x = xhr;
      run += 1; busy = false; xhr = null; stop(); input.value = "";
      if (x) { try { x.abort(); } catch (e) { /* already done */ } }
      show(null, { quota: quota });
    }

    /* the server printed a link for the no-JS path; here it becomes the picker, with the words of the picker */
    var first = row.querySelector(".fb-act");
    if (first) { var tmp = d.createElement("div"); tmp.innerHTML = picker(PICK[first.textContent] || first.textContent); first.parentNode.replaceChild(tmp.firstChild, first); wire(); }
    /* a page that opens with an upload being checked reads it; one stored in `started` shows FB6 and is not sent with the form */
    var st = el.getAttribute("data-upload-state");
    if (input.value && st === "started") input.value = "";
    if (input.value && st === "scanning") { waited = 0; poll(run); }
  }
  Array.prototype.forEach.call(d.querySelectorAll(".fileblock"), init);
})();
