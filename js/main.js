// Blue Jay Capital — shared scripts
(function () {
  'use strict';

  // ── Mobile nav toggle ──────────────────────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ── Active nav link ────────────────────────────────────────────────────────
  try {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  } catch (e) {}

  // ── Animated stat counter ──────────────────────────────────────────────────
  var statEls = document.querySelectorAll('.stat .num');
  if ('IntersectionObserver' in window && statEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        var target = parseFloat(el.dataset.target || el.textContent.replace(/[^\d.]/g, ''));
        var suffix = el.dataset.suffix || '';
        var prefix = el.dataset.prefix || '';
        if (!target || isNaN(target)) return;
        var duration = 1600;
        var start = performance.now();
        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
          var val = target * ease;
          var display = target >= 100 ? Math.round(val) : val.toFixed(1);
          el.textContent = prefix + display + suffix;
          if (p < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = prefix + (target % 1 === 0 ? target : target.toFixed(1)) + suffix;
          }
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (o) { io.observe(o); });
  }

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  // ── Footer year ────────────────────────────────────────────────────────────
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ── Header shadow on scroll ────────────────────────────────────────────────
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(33,72,126,0.10)'
        : '0 1px 3px rgba(33,72,126,0.06)';
    }, { passive: true });
  }

})();
