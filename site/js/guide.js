/* /docs/listing-form: the server prints every example whole and nothing plays by itself. The script shows the button under each section
 * ("Show how it is filled in"); pressing it types that one example again, 45 ms per character, and the button comes back at the end.
 * Without this file, or with prefers-reduced-motion, there is no button and the controls hold the example. */
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var all = function (s, r) { return Array.prototype.slice.call(r.querySelectorAll(s)); };
  function play(sec) {
    var box = sec.querySelector(".g-control"), btn = sec.querySelector(".g-again");
    var txt = box.querySelector("textarea,input[type=text],input:not([type])");
    var pick = all("input:checked", box);
    btn.hidden = true;
    var done = function () { btn.hidden = false; };
    if (txt) {
      var full = txt.value, i = 0;
      txt.value = "";
      (function next() {
        txt.value = full.slice(0, ++i);
        if (i < full.length) setTimeout(next, 45); else done();
      })();
    } else if (pick.length) {
      pick.forEach(function (p) { p.checked = false; });
      setTimeout(function () { pick.forEach(function (p) { p.checked = true; }); done(); }, 600);
    } else done();
  }
  all(".g-sec", document).forEach(function (s) {
    var b = s.querySelector(".g-again");
    b.hidden = false;
    b.addEventListener("click", function () { play(s); });
  });
})();
