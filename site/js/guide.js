/* /docs/listing-form: types each example into its control when the section scrolls into view, once; "Show again" repeats it.
 * Without this file, or with prefers-reduced-motion, the controls already hold the example (the server filled them in). */
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
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
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); play(e.target); } });
  }, { threshold: 0.6 });
  all(".g-sec", document).forEach(function (s) {
    s.querySelector(".g-again").addEventListener("click", function () { play(s); });
    io.observe(s);
  });
})();
