// Remembers the visitor's language choice. Loaded synchronously in <head> so the
// redirect happens before the page paints.
(function () {
  var KEY = 'yzn-lang';
  var root = document.documentElement;
  // Lets CSS hide reveal-on-scroll content only when JS is actually running.
  root.classList.add('js');
  var stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {}

  // Only the default (Arabic) entry point redirects; explicit /en/ links are always honoured.
  if (stored === 'en' && root.lang === 'ar' && root.dataset.altUrl) {
    location.replace(root.dataset.altUrl + location.hash);
    return;
  }

  document.addEventListener('click', function (e) {
    var link = e.target instanceof Element && e.target.closest('[data-lang-switch]');
    if (!link) return;
    try {
      localStorage.setItem(KEY, link.getAttribute('data-lang-switch'));
    } catch (err) {}
  });
})();
