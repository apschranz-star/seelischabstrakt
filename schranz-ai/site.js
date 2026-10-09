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

  /* Headings that slide up word by word. Each word gets a mask and an inner
     span; the heading itself keeps its text for screen readers. */
  doc.querySelectorAll("[data-split]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = "";
    words.forEach(function (w, i) {
      var outer = doc.createElement("span");
      outer.className = "w";
      outer.setAttribute("aria-hidden", "true");
      var inner = doc.createElement("span");
      inner.textContent = w;
      inner.style.setProperty("--wi", i);
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(doc.createTextNode(" "));
    });
    el.classList.add("reveal-split");
  });

  /* Reveal: elements enter once, staggered by their --d custom property. */
  var reveals = doc.querySelectorAll(".reveal, .split");
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
      /* The line of light fills down to the live step; steps above it are done. */
      var list = steps[0].parentNode;
      var lr = list.getBoundingClientRect();
      var fill = Math.max(0, Math.min(1, (mid - lr.top) / lr.height));
      list.style.setProperty("--sp", fill.toFixed(3));
      steps.forEach(function (s) {
        var r = s.getBoundingClientRect();
        s.classList.toggle("done", r.top + 30 < mid);
      });
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

  /* Header and tab bar: the current section lights up in both. */
  var nav = doc.querySelector(".nav");
  var links = Array.prototype.slice.call(doc.querySelectorAll(".nav-links a[href^='#'], .tabbar a[href^='#']"));
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

  /* Scroll progress along the top, and a slow drift of the hero light. */
  var prog = doc.querySelector(".progress");
  var aurora = doc.querySelector(".aurora");
  var pt = false;
  var onProgress = function () {
    if (pt) return;
    pt = true;
    requestAnimationFrame(function () {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY || window.pageYOffset;
      if (prog) prog.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
      if (aurora && !reduce && y < window.innerHeight * 1.2) aurora.style.setProperty("--py", (y * 0.35).toFixed(1) + "px");
      pt = false;
    });
  };
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();

  /* Light that follows the pointer across glass cards. */
  if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    doc.querySelectorAll("[data-light]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
    /* Buttons that lean a little towards the pointer. */
    if (!reduce) {
      doc.querySelectorAll("[data-magnet]").forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.18;
          var y = (e.clientY - r.top - r.height / 2) * 0.28;
          el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
        });
        el.addEventListener("pointerleave", function () { el.style.transform = ""; });
      });
    }
  }

  /* Rails: cards that slide. Buttons step one card, the line shows how far,
     a mouse can drag, and a card that has come into view stays lit. */
  doc.querySelectorAll(".rail-wrap").forEach(function (wrap) {
    var rail = wrap.querySelector(".rail");
    var bar = wrap.querySelector(".rail-track i");
    var prev = wrap.querySelector('[data-dir="-1"]');
    var next = wrap.querySelector('[data-dir="1"]');
    var cards = Array.prototype.slice.call(rail.children);
    var stepW = function () { return cards[0] ? cards[0].getBoundingClientRect().width + 16 : rail.clientWidth; };
    var update = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var p = max > 0 ? rail.scrollLeft / max : 1;
      var view = rail.clientWidth / rail.scrollWidth;
      if (bar) bar.style.setProperty("--rp", Math.min(1, view + p * (1 - view)).toFixed(3));
      if (prev) prev.disabled = rail.scrollLeft < 4;
      if (next) next.disabled = rail.scrollLeft > max - 4;
      var rr = rail.getBoundingClientRect();
      cards.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.left < rr.right - r.width * 0.35 && r.right > rr.left + r.width * 0.35) c.classList.add("seen");
      });
    };
    [prev, next].forEach(function (b) {
      if (!b) return;
      b.addEventListener("click", function () {
        rail.scrollBy({ left: stepW() * Number(b.getAttribute("data-dir")), behavior: reduce ? "auto" : "smooth" });
      });
    });
    rail.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { rail.scrollBy({ left: stepW(), behavior: "smooth" }); e.preventDefault(); }
      if (e.key === "ArrowLeft") { rail.scrollBy({ left: -stepW(), behavior: "smooth" }); e.preventDefault(); }
    });
    /* Drag with a mouse. Touch already scrolls natively. */
    var down = false, startX = 0, startL = 0, moved = false;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startL = rail.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) { moved = true; rail.classList.add("dragging"); }
      if (moved) rail.scrollLeft = startL - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      if (moved) {
        rail.classList.remove("dragging");
        /* Let snapping settle on the nearest card. */
        var w = stepW();
        rail.scrollTo({ left: Math.round(rail.scrollLeft / w) * w, behavior: reduce ? "auto" : "smooth" });
      }
    });
    if ("IntersectionObserver" in window) {
      var rio = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) { update(); }
      }, { threshold: 0.2 });
      rio.observe(rail);
    }
    update();
  });

  /* Segments: one choice out of a few, one panel at a time. Without
     JavaScript every panel stands open below the buttons. */
  doc.querySelectorAll(".seg").forEach(function (seg) {
    var btns = Array.prototype.slice.call(seg.querySelectorAll("[data-seg]"));
    var box = seg.nextElementSibling;
    if (!box) return;
    var panels = Array.prototype.slice.call(box.querySelectorAll("[data-seg-panel]"));
    var show = function (k, focus) {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-seg") === k;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      panels.forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-seg-panel") === k); });
    };
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { show(b.getAttribute("data-seg"), false); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = btns[(i + d + btns.length) % btns.length];
        show(n.getAttribute("data-seg"), true);
      });
    });
    var start = btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0] || btns[0];
    if (start) show(start.getAttribute("data-seg"), false);
  });

  /* The calculator. Everything stays on this page: no request, no storage. */
  var calc = doc.querySelector(".calc");
  if (calc) {
    var de = calc.getAttribute("data-lang") === "de";
    var nf = function (n) {
      try { return new Intl.NumberFormat(de ? "de-DE" : "en-GB", { maximumFractionDigits: 0 }).format(n); }
      catch (e) { return String(Math.round(n)); }
    };
    var euro = function (n) { return de ? nf(n) + " €" : "€" + nf(n); };
    var weeks = Number(calc.getAttribute("data-weeks")) || 46;
    var low = Number(calc.getAttribute("data-price-low"));
    var high = Number(calc.getAttribute("data-price-high"));
    var inputs = {};
    calc.querySelectorAll(".regler").forEach(function (r) {
      var inp = r.querySelector("input");
      var out = r.querySelector("output");
      inputs[r.getAttribute("data-key")] = inp;
      var paint = function () {
        var p = (inp.value - inp.min) / (inp.max - inp.min) * 100;
        r.style.setProperty("--p", p + "%");
        out.textContent = (r.getAttribute("data-key") === "rate" ? (de ? inp.value + " €" : "€" + inp.value) : inp.value + out.getAttribute("data-unit"));
      };
      inp.addEventListener("input", function () { paint(); run(); });
      paint();
    });
    var o = function (k) { return calc.querySelector('[data-out="' + k + '"]'); };
    var run = function () {
      var h = Number(inputs.hours.value) * Number(inputs.people.value) * weeks;
      var cost = h * Number(inputs.rate.value);
      var save = cost * Number(inputs.share.value) / 100;
      o("hours").textContent = nf(h) + " h";
      o("cost").textContent = euro(cost);
      o("save").textContent = euro(save);
      var pay = o("payback");
      if (save > 0) {
        var a = Math.max(1, Math.ceil(low / (save / 12)));
        var b = Math.max(1, Math.ceil(high / (save / 12)));
        pay.textContent = (a === b ? a : a + (de ? " bis " : " to ") + b) + " " + pay.getAttribute("data-months");
      } else {
        pay.textContent = pay.getAttribute("data-none");
      }
    };
    run();
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
