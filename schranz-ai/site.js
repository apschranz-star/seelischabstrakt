/* SCHRANZ AI SOLUTIONS. Inlined by build.mjs. No dependencies.
   Everything here is an enhancement: the page reads completely without it. */
(function () {
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* Die Sprache steckt in der Adresse der Seite, Deutsch unter / und Englisch
     unter /en/. Es gibt deshalb nichts zu speichern. Frueher lag hier ein Wert
     im lokalen Speicher, der nie wieder gelesen wurde; ein Wert, den niemand
     braucht, gehoert nicht auf das Geraet des Besuchers. */

  /* Reveal: elements enter once, staggered by their --d custom property. */
  var reveals = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  /* If anything never intersected (a hidden tab, a print), show it after a while. */
  setTimeout(function () {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }, 4000);

  /* Thesis lines light up one after another as the block reaches the middle. */
  var thesis = doc.querySelector(".thesis-lines");
  if (thesis) {
    var lines = Array.prototype.slice.call(thesis.children);
    var lit = false;
    var light = function () {
      if (lit) return;
      lit = true;
      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add("on"); }, reduce ? 0 : 260 * i);
      });
    };
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { light(); tio.disconnect(); }
      }, { threshold: 0.5 });
      tio.observe(thesis);
    } else { light(); }
  }

  /* Counters: numbers that count up once, in the time the eye needs to arrive. */
  var counters = doc.querySelectorAll("[data-count]");
  var fmt = function (n, sample) {
    var s = String(Math.round(n));
    var sep = sample.indexOf(".") > -1 && sample.indexOf(",") === -1 ? "." : ",";
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  };
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var sample = el.getAttribute("data-sample") || el.textContent;
    if (!isFinite(target) || reduce) { return; }
    var start = null;
    var dur = 1100;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, sample);
      if (p < 1) requestAnimationFrame(step); else el.textContent = sample;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* The funds bar grows its segments when it comes into view. */
  var bars = doc.querySelectorAll(".bar");
  if ("IntersectionObserver" in window && !reduce) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("on"); bio.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { bio.observe(el); });
  } else {
    bars.forEach(function (el) { el.classList.add("on"); });
  }

  /* Method steps: the step nearest the middle of the viewport is the live one. */
  var steps = Array.prototype.slice.call(doc.querySelectorAll(".step"));
  if (steps.length) {
    var pick = function () {
      var mid = window.innerHeight * 0.5;
      var best = null, bestD = Infinity;
      steps.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var c = r.top + r.height / 2;
        var d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; best = s; }
      });
      steps.forEach(function (s) { s.classList.toggle("on", s === best && bestD < window.innerHeight * 0.6); });
    };
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { pick(); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    pick();
  }

  /* Header: the current section in the menu, and the mobile drawer. */
  var nav = doc.querySelector(".nav");
  var links = Array.prototype.slice.call(doc.querySelectorAll(".nav-links a[href^='#']"));
  var sections = links.map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var current = null;
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + current;
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { sio.observe(s); });
  }
  var menuBtn = doc.querySelector(".menu-btn");
  if (nav && menuBtn) {
    var setOpen = function (open) {
      if (open) nav.setAttribute("data-open", ""); else nav.removeAttribute("data-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function () { setOpen(!nav.hasAttribute("data-open")); });
    doc.querySelectorAll(".drawer a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.hasAttribute("data-open")) { setOpen(false); menuBtn.focus(); }
    });
  }

  /* Copy the email address. */
  var copy = doc.querySelector("[data-copy]");
  if (copy && navigator.clipboard) {
    var label = copy.textContent;
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(copy.getAttribute("data-copy")).then(function () {
        copy.textContent = copy.getAttribute("data-copied");
        setTimeout(function () { copy.textContent = label; }, 1800);
      });
    });
  } else if (copy) {
    copy.hidden = true;
  }
})();
