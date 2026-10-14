// Сборка: node tools/build.js — собирает проект в один index.html.
// Исходник меню — src/menu.html (index.html перезаписывается сборкой).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MENU_SRC = path.join(ROOT, 'src', 'menu.html');
const PAGE_NAMES = [
  'index.html',
  'chapters.html',
  'scene_intro.html',
  'game1_tinder.html',
  'scene_fox_escapes.html',
  'game2_tolpa.html',
  'game3_date.html',
];

const read = (f) => f === 'index.html'
  ? fs.readFileSync(MENU_SRC, 'utf8')
  : fs.readFileSync(path.join(ROOT, f), 'utf8');

const pages = {};
for (const name of PAGE_NAMES) {
  let html = read(name);

  html = html.replace('<link rel="stylesheet" href="shared/style.css">',
    () => '<style>\n' + read('shared/style.css') + '\n</style>');

  html = html.replace(/<script src="shared\/(\w+)\.js"><\/script>/g, (m, f) => {
    const js = read('shared/' + f + '.js').replace(/<\/script/gi, '<\\/script');
    return '<script>\n' + js + '\n</script>';
  });

  html = html.replace(/(?:window\.)?location\.href\s*=\s*([^;]+);/g,
    (m, url) => 'parent.FTRouter.go(' + url + ');');

  html = html.replace(/\blocation\.hash\b/g, '(window.__ftHash || "")');

  pages[name] = html;
}

// Экранируем '<' в JSON, чтобы </script> внутри страниц не закрыл тег.
const pagesJson = JSON.stringify(pages).split('<').join('\\u003c');

const out = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>FindTheFox</title>
<style>
  html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
  #stage { position: fixed; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
</style>
</head>
<body>
<iframe id="stage" title="FindTheFox" allow="autoplay"></iframe>
<script>
(function () {
  'use strict';

  const PAGES = ${pagesJson};
  const stage = document.getElementById('stage');

  // Хранилище для страниц-iframe: свой localStorage -> localStorage родителя -> память.
  // Без этого на file:// (у srcdoc непрозрачный origin) настройки и прогресс не сохраняются.
  function storageShim() {
    function works(st) {
      try { st.setItem('__ft', '1'); st.removeItem('__ft'); return true; } catch (e) { return false; }
    }
    var own = null;
    try { own = window.localStorage; } catch (e) {}
    if (own && works(own)) return;
    var st = null;
    try { st = parent.localStorage; } catch (e) {}
    if (!(st && works(st))) {
      var mem = parent.__ftMem = parent.__ftMem || {};
      st = {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
    try { Object.defineProperty(window, 'localStorage', { value: st, configurable: true }); } catch (e) {}
  }

  function show(url) {
    const parts = String(url).split('#');
    const name = parts[0] || 'index.html';
    const hash = parts.length > 1 ? '#' + parts.slice(1).join('#') : '';
    const html = PAGES[name];
    if (!html) { console.error('Нет страницы: ' + name); return; }
    const prelude = '<script>(' + storageShim.toString() + ')();window.__ftHash = ' + JSON.stringify(hash) + ';<\\/script>';
    stage.srcdoc = html.replace('<head>', function () { return '<head>' + prelude; });
  }

  window.FTRouter = { go: show };
  show('index.html');
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), out, 'utf8');
console.log('index.html собран, байт: ' + Buffer.byteLength(out, 'utf8'));
