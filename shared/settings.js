/* FindTheFox — настройки (localStorage, вибрация, аудио-задел) */

window.FTSettings = (function () {
  'use strict';

  const KEY = 'findthefox_settings';
  const DEFAULTS = { sound: true, music: true, vibration: true };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULTS, parsed);
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function save(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function apply(obj) {
    // Пока заглушка — реальное аудио подключается на этапе 17.
    // Все, кто хочет реагировать на смену настроек, слушают событие.
    document.dispatchEvent(new CustomEvent('ft-settings-applied', {
      detail: obj
    }));
  }

  function vibrate(ms) {
    const s = load();
    if (!s.vibration) return;
    if (navigator.vibrate) navigator.vibrate(ms || 10);
  }

  // Привязать чекбоксы к настройкам. Возвращает функцию persist().
  function bindToggles(soundEl, musicEl, vibEl) {
    const s = load();
    if (soundEl) soundEl.checked = s.sound;
    if (musicEl) musicEl.checked = s.music;
    if (vibEl)   vibEl.checked   = s.vibration;

    function persist() {
      const cur = {
        sound:     soundEl ? soundEl.checked : s.sound,
        music:     musicEl ? musicEl.checked : s.music,
        vibration: vibEl   ? vibEl.checked   : s.vibration,
      };
      save(cur);
      apply(cur);
      return cur;
    }

    [soundEl, musicEl, vibEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('change', function () {
        vibrate();
        persist();
      });
    });

    return persist;
  }

  // Автоматически навесить скейл .scene под окно
  function fitScene(sceneEl) {
    function resize() {
      const scale = Math.min(
        window.innerWidth / 720,
        window.innerHeight / 1280
      );
      sceneEl.style.transform =
        'translate(-50%, -50%) scale(' + scale + ')';
    }
    window.addEventListener('resize', resize);
    resize();
    return resize;
  }

  return { load, save, apply, vibrate, bindToggles, fitScene };
})();