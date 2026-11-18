/* ============================================================
   ODERO PRODUCTIONS — script.js

   Loaded in <head> (not deferred) so the starting state is set before
   the page first paints. Nothing is ever hidden without JavaScript,
   with reduced motion on, or if anything below fails.
   ============================================================ */

(function () {
  "use strict";
  var root = document.documentElement;
  var reducedMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion) root.classList.add("js");

  // Failsafe: if the page never finishes wiring up, show everything anyway
  var failsafe = setTimeout(function () {
    root.classList.add("is-lit");
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }, 4000);

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    /* ---------- Lights up ----------
       The hero starts as an unlit room; one frame later the lamp comes on. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add("is-lit"); });
    });

    /* ---------- Header: solid once you leave the top ---------- */
    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------- Phone menu ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("nav");
    if (toggle && nav) {
      var setOpen = function (open) {
        root.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      toggle.addEventListener("click", function () { setOpen(!root.classList.contains("nav-open")); });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && root.classList.contains("nav-open")) { setOpen(false); toggle.focus(); }
      });
      window.addEventListener("resize", function () { if (window.innerWidth > 860) setOpen(false); });
    }

    /* ---------- Scroll reveal ---------- */
    var reveals = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        // items that arrive together come in a beat apart, left to right
        var batch = entries.filter(function (e) { return e.isIntersecting; });
        batch.forEach(function (entry, i) {
          entry.target.style.setProperty("--d", (i * 0.08).toFixed(2) + "s");
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
    clearTimeout(failsafe);

    /* ---------- Work rail arrows ---------- */
    var rail = document.getElementById("work-rail");
    var prev = document.querySelector('[data-rail="prev"]');
    var next = document.querySelector('[data-rail="next"]');
    if (rail && prev && next) {
      var step = function () {
        var tile = rail.querySelector(".tile");
        return tile ? (tile.offsetWidth + 20) * 2 : 400;
      };
      var update = function () {
        prev.disabled = rail.scrollLeft < 8;
        next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
      };
      prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: reducedMotion ? "auto" : "smooth" }); });
      next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: reducedMotion ? "auto" : "smooth" }); });
      rail.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    }

    /* ---------- Hero video (only once there is one in the page) ---------- */
    var heroVideo = document.querySelector(".hero-media video");
    if (heroVideo) {
      var heroMedia = heroVideo.closest(".hero-media");
      if (reducedMotion) {
        heroVideo.removeAttribute("autoplay");
        heroVideo.pause();
      } else {
        var show = function () { heroMedia.classList.add("is-playing"); };
        var hide = function () { heroMedia.classList.remove("is-playing"); };
        if (!heroVideo.paused && heroVideo.currentTime > 0) show();
        heroVideo.addEventListener("playing", show);
        heroVideo.addEventListener("pause", hide);
        heroVideo.addEventListener("error", hide);
        // Phones can refuse autoplay (Low Power Mode). Ask again on first touch.
        var play = function () { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); };
        play();
        ["touchstart", "scroll", "click"].forEach(function (ev) {
          window.addEventListener(ev, function () { if (heroVideo.paused) play(); }, { once: true, passive: true });
        });
      }
    }

    /* ---------- Project pages: load the player only when asked ----------
       The video comes from Cloudflare Stream. Nothing is requested from
       them until the visitor presses play. */
    document.querySelectorAll(".player[data-video]").forEach(function (player) {
      player.addEventListener("click", function () {
        if (player.classList.contains("is-playing")) return;
        var id = player.getAttribute("data-video");
        if (!/^[a-f0-9]{32}$/.test(id)) return;
        var frame = document.createElement("iframe");
        frame.src = "https://customer-f98idm6pe7bos5qf.cloudflarestream.com/" + id + "/iframe?autoplay=true&preload=auto";
        frame.title = player.getAttribute("data-title") || "Video player";
        frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        frame.allowFullscreen = true;
        var holder = document.createElement("div");
        holder.className = "player is-playing";
        holder.appendChild(frame);
        player.replaceWith(holder);
        frame.focus();
      });
    });

    /* ---------- Footer year ---------- */
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  });
})();

/* ============================================================
   Feature sections
   ============================================================ */
(function () {
  "use strict";
  var reducedMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function start() {
    /* ---------- Intro statement: words light up as they scroll in ----------
       Without JavaScript, or with reduced motion on, the text is simply lit. */
    var statement = document.querySelector("[data-light-up]");
    if (statement && !reducedMotion) {
      var words = statement.textContent.trim().split(/\s+/);
      statement.textContent = "";
      var spans = words.map(function (word, i) {
        var span = document.createElement("span");
        span.className = "w";
        span.textContent = word;
        statement.appendChild(span);
        if (i < words.length - 1) statement.appendChild(document.createTextNode(" "));
        return span;
      });
      var queued = false;
      var light = function () {
        queued = false;
        var rect = statement.getBoundingClientRect();
        var vh = window.innerHeight;
        // 0 when the top edge is 85% down the screen, 1 when the bottom edge reaches 45%
        var progress = (vh * 0.85 - rect.top) / (rect.height + vh * 0.4);
        var count = Math.round(Math.max(0, Math.min(1, progress)) * spans.length);
        spans.forEach(function (span, i) { span.classList.toggle("lit", i < count); });
      };
      var onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(light); } };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      light();
    }

    /* ---------- Contact panel: the lamp follows the pointer ---------- */
    var spot = document.querySelector("[data-spotlight]");
    if (spot && !reducedMotion && window.matchMedia("(hover: hover)").matches) {
      spot.addEventListener("pointermove", function (e) {
        var rect = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        spot.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
      spot.addEventListener("pointerleave", function () {
        spot.style.removeProperty("--mx");
        spot.style.removeProperty("--my");
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
