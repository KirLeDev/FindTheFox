// FindTheFox — звуковые эффекты (синтез через Web Audio, без файлов)

window.FTSfx = (function () {
  'use strict';

  let ctx = null;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Одна нота: частота, длительность, задержка, тип волны, громкость
  function tone(freq, dur, delay, type, vol) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + (delay || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.25, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Скольжение частоты (для «бу-у» и «ой»)
  function slide(from, to, dur, delay, type, vol) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + (delay || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    gain.gain.setValueAtTime(vol || 0.2, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  const SOUNDS = {
    // Тап по кнопке
    tap:    function () { tone(660, 0.07, 0, 'sine', 0.2); },
    // Хороший выбор: восходящий аккорд
    good:   function () {
      tone(523, 0.12, 0,    'triangle', 0.22);
      tone(659, 0.12, 0.08, 'triangle', 0.22);
      tone(784, 0.2,  0.16, 'triangle', 0.22);
    },
    // Плохой выбор: нисходящее «бу»
    bad:    function () { slide(330, 110, 0.35, 0, 'sawtooth', 0.12); },
    // Нейтральный: короткий щелчок
    neutral: function () { tone(440, 0.09, 0, 'sine', 0.18); },
    // Лиса довольна: мелодичная трель
    love:   function () {
      [784, 988, 1175, 988, 1319].forEach(function (f, i) {
        tone(f, 0.12, i * 0.07, 'sine', 0.2);
      });
    },
    // Победа: фанфары
    win:    function () {
      [523, 523, 523, 659].forEach(function (f, i) {
        tone(f, 0.14, i * 0.14, 'square', 0.12);
      });
      tone(784, 0.5, 0.56, 'square', 0.14);
      tone(523, 0.6, 0.56, 'triangle', 0.14);
    },
    // Поражение: грустный спад
    lose:   function () {
      [392, 349, 311, 262].forEach(function (f, i) {
        tone(f, 0.25, i * 0.22, 'triangle', 0.2);
      });
    },
    // Переход / переворот страницы
    page:   function () { slide(800, 1200, 0.08, 0, 'sine', 0.12); }
  };

  // Звук играет только если включён в настройках
  function play(name) {
    const s = window.FTSettings ? FTSettings.load() : { sound: true };
    if (!s.sound) return;
    const fn = SOUNDS[name];
    if (fn) fn();
  }

  return { play };
})();
