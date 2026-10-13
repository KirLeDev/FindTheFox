// FindTheFox — загрузка SVG-иконок

(function () {
  'use strict';

  const SVG_CACHE = {};

  function loadSVG(url) {
    if (SVG_CACHE[url]) return SVG_CACHE[url];

    fetch(url)
      .then(res => res.text())
      .then(svg => {
        SVG_CACHE[url] = svg;
        return svg;
      })
      .catch(() => '');

    return SVG_CACHE[url] || '';
  }

  function renderSVG(container, url) {
    const svg = loadSVG(url);
    if (!svg) return;

    container.innerHTML = svg;
  }

  window.FTSVG = {
    renderSVG: renderSVG,
    loadSVG: loadSVG,
  };
})();