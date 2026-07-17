// EVAN Hospital — interaction layer
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky nav shadow on scroll */
  var nav = document.getElementById('siteNav');
  var onScroll = function () {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.getElementById('menuToggle');
  var navInner = document.querySelector('.nav-inner');
  toggle.addEventListener('click', function () {
    var open = navInner.classList.toggle('mobile-open');
    toggle.setAttribute('aria-expanded', open);
    var primary = document.querySelector('nav.primary');
    if (open) {
      primary.style.display = 'flex';
      primary.style.position = 'absolute';
      primary.style.top = '64px';
      primary.style.left = '0';
      primary.style.right = '0';
      primary.style.flexDirection = 'column';
      primary.style.background = '#06080D';
      primary.style.padding = '24px';
      primary.style.borderBottom = '1px solid rgba(255,255,255,0.12)';
      primary.style.gap = '18px';
    } else {
      primary.style.display = '';
    }
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });

    var pulse = document.querySelector('.pulse-divider');
    if (pulse) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { pulse.classList.add('in-view'); pio.unobserve(pulse); }
        });
      }, { threshold: 0.4 });
      pio.observe(pulse);
    }
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    var pd = document.querySelector('.pulse-divider');
    if (pd) pd.classList.add('in-view');
  }

  /* Department marquee loop */
  var deptScroll = document.getElementById('deptScroll');
  if (deptScroll && !reduceMotion) {
    var deptTrack = deptScroll.querySelector('.dept-track');
    if (!deptTrack) {
      var deptChildren = Array.from(deptScroll.children);
      deptTrack = document.createElement('div');
      deptTrack.className = 'dept-track';
      deptChildren.forEach(function (child) {
        deptTrack.appendChild(child);
      });
      deptScroll.appendChild(deptTrack);
    }

    var deptCards = Array.from(deptTrack.children);
    if (deptCards.length > 0 && deptCards.length < 35) {
      deptCards.forEach(function (card) {
        deptTrack.appendChild(card.cloneNode(true));
      });
    }
  }

  /* Count-up numbers */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { cio.observe(el); });
  }

  /* Cursor glow (desktop only, subtle) */
  var glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    document.addEventListener('mousemove', function (e) {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
  }

  /* Contact form (demo submit) */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Request sent ✓';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2600);
    });
  }
})();
