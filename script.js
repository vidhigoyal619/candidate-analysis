/* Candidate Details – wireframe behaviour.
   Only controls that already exist in the current product are wired:
   theme toggle, rail collapse, IDs / Actions / Status dropdowns,
   sidebar section switching. Everything else is static. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  themeBtn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  /* ---------- Rail collapse / expand ---------- */
  var rail = document.getElementById('rail');
  var railToggle = document.getElementById('rail-toggle');
  railToggle.addEventListener('click', function () {
    var open = rail.getAttribute('data-open') === 'true';
    rail.setAttribute('data-open', String(!open));
    railToggle.setAttribute('aria-expanded', String(!open));
    railToggle.setAttribute('aria-label', open ? 'Expand main navigation' : 'Collapse main navigation');
  });

  /* ---------- Dropdowns (IDs, Actions, Status) ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-dd]'));

  function closeAll(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      document.getElementById(t.getAttribute('data-dd')).hidden = true;
    });
  }
  function openTrigger() {
    return triggers.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
  }

  triggers.forEach(function (t) {
    t.addEventListener('click', function () {
      var menu = document.getElementById(t.getAttribute('data-dd'));
      var wasOpen = t.getAttribute('aria-expanded') === 'true';
      closeAll(t);
      t.setAttribute('aria-expanded', String(!wasOpen));
      menu.hidden = wasOpen;
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dd')) closeAll();
  });
  document.addEventListener('focusin', function (e) {
    if (!e.target.closest('.dd')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var t = openTrigger();
    if (t) { closeAll(); t.focus(); }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-menu-item]'), function (item) {
    item.addEventListener('click', function () {
      var t = openTrigger();
      closeAll();
      if (t) t.focus();
    });
  });

  /* ---------- Sidebar: one section visible at a time ---------- */
  var tabbar = document.getElementById('tabbar');
  var secButtons = Array.prototype.slice.call(document.querySelectorAll('.sec-btn'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));

  function showSection(id) {
    secButtons.forEach(function (b) {
      b.setAttribute('aria-current', String(b.getAttribute('data-target') === id));
    });
    panels.forEach(function (p) {
      p.hidden = p.id !== 'panel-' + id;
    });
    var panel = document.getElementById('panel-' + id);
    var heading = panel.querySelector('h2');
    // If the user had scrolled down, bring the new section to the top, below the sticky bar.
    var limit = tabbar.offsetHeight + 16;
    if (panel.getBoundingClientRect().top < limit) panel.scrollIntoView({ block: 'start' });
    heading.focus({ preventScroll: true });
  }
  secButtons.forEach(function (b) {
    b.addEventListener('click', function () { showSection(b.getAttribute('data-target')); });
  });

  /* ---------- Compact identity in the sticky bar once the header card is out of view ---------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      tabbar.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(document.getElementById('profile'));
  }

  /* ---------- Top tabs: only "Candidate Details" exists in this wireframe ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
