/* FindTheFox — прогресс по главам */

window.FTProgress = (function () {
  'use strict';

  const KEY = 'findthefox_progress';

  // Главы 1..4. Индексы 0..3.
  // Возможные статусы: 'locked' | 'unlocked' | 'done'
  const DEFAULTS = ['unlocked', 'locked', 'locked', 'locked'];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return DEFAULTS.slice();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length !== 4) return DEFAULTS.slice();
      return arr;
    } catch (e) {
      return DEFAULTS.slice();
    }
  }

  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function getStatus(index) {
    const arr = load();
    return arr[index] || 'locked';
  }

  function markDone(index) {
    const arr = load();
    arr[index] = 'done';
    if (index + 1 < arr.length && arr[index + 1] === 'locked') {
      arr[index + 1] = 'unlocked';
    }
    save(arr);
    document.dispatchEvent(new CustomEvent('ft-progress-changed', {
      detail: { index: index, status: 'done' }
    }));
  }

  function reset() {
    save(DEFAULTS.slice());
    document.dispatchEvent(new CustomEvent('ft-progress-changed', {
      detail: { reset: true }
    }));
  }

  return { load, save, getStatus, markDone, reset };
})();