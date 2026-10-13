// FindTheFox — фоновая музыка: трек заранее отрисовывается в буфер и зацикливается без шва

window.FTMusic = (function () {
  'use strict';

  const BARS = 8;               // длина цикла в тактах
  const STEPS_PER_BAR = 8;      // восьмые в такте
  const CHORD_BARS = 2;         // аккорд держится 2 такта
  const TAIL = 3;               // запас на затухание звуков, сек (уходит в начало цикла)

  // Треки. chords — прогрессия, melody — 4 паттерна по 8 шагов (-1 = пауза)
  const TRACKS = {
    // Лес и меню: медленно, задумчиво, минор + колокольчики
    forest: {
      bpm: 92, hat: 0.02,
      chords: [
        { root: 220, tones: [220, 262, 330] },   // Am
        { root: 175, tones: [175, 220, 262] },   // F
        { root: 262, tones: [262, 330, 392] },   // C
        { root: 196, tones: [196, 247, 294] }    // G
      ],
      melody: [
        [440, -1, 523, 440, 392, -1, 330, -1],
        [349, -1, 440, 523, 440, -1, 392, -1],
        [523, -1, 392, 440, 523, -1, 659, -1],
        [494, -1, 440, 392, 494, -1, 392, -1]
      ],
      bass: [0, 4], pad: true, lead: 'triangle',
      arp: [1, 3, 5, 7], bell: true,
      kick: [], snare: [], hats: [2, 6]
    },
    // Город: бодро, быстрее, барабаны и бас на каждую восьмую
    city: {
      bpm: 124, hat: 0.07,
      chords: [
        { root: 262, tones: [262, 330, 392] },   // C
        { root: 196, tones: [196, 247, 294] },   // G
        { root: 220, tones: [220, 262, 330] },   // Am
        { root: 175, tones: [175, 220, 262] }    // F
      ],
      melody: [
        [659, 784, -1, 659, 523, -1, 587, 523],
        [523, 659, -1, 784, 659, -1, 523, 440],
        [440, 523, -1, 659, 698, -1, 659, 523],
        [587, 698, -1, 587, 494, -1, 587, 659]
      ],
      bass: [0, 1, 2, 3, 4, 5, 6, 7], pad: true, lead: 'square',
      arp: [0, 2, 4, 6], bell: false,
      kick: [0, 4], snare: [2, 6], hats: [1, 3, 5, 7]
    },
    // Кафе: тёплый лаунж, мягкие барабаны, колокольчики
    cafe: {
      bpm: 116, hat: 0.05,
      chords: [
        { root: 262, tones: [262, 330, 392] },   // C
        { root: 220, tones: [220, 262, 330] },   // Am
        { root: 175, tones: [175, 220, 262] },   // F
        { root: 196, tones: [196, 247, 294] }    // G
      ],
      melody: [
        [659, -1, 784, 659, 523, -1, 587, 523],
        [523, -1, 659, 523, 440, -1, 523, 440],
        [349, -1, 440, 523, 698, -1, 659, 523],
        [587, -1, 494, 587, 784, -1, 698, 587]
      ],
      bass: [0, 2, 4, 6], pad: true, lead: 'square',
      arp: [1, 3, 5, 7], bell: true,
      kick: [0, 4], snare: [2, 6], hats: [1, 3, 5, 7], softSnare: true
    }
  };

  let ctx = null, master = null;
  let wanted = null;           // что должно играть
  let cur = null;              // { name, src, out }
  const cache = {};            // имя трека -> Promise<AudioBuffer>
  const POS_KEY = 'findthefox_music_pos';   // позиция в треке — чтобы продолжить на следующей странице

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    return ctx;
  }

  // ── Инструменты (работают и в онлайн, и в офлайн контексте) ──

  function noiseBuf(ac) {
    if (!ac._ftNoise) {
      const n = Math.floor(ac.sampleRate * 0.5);
      const b = ac.createBuffer(1, n, ac.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      ac._ftNoise = b;
    }
    return ac._ftNoise;
  }

  function envelope(g, t, attack, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  // Щипок: бас, аккордовые арпеджио
  function pluck(ac, out, t, f, dur, vol, type) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(f, t);
    envelope(g, t, 0.005, vol, dur);
    o.connect(g).connect(out);
    o.start(t); o.stop(t + dur + 0.05);
  }

  // Соло: мягкий звук с фильтром
  function lead(ac, out, t, f, dur, vol, type) {
    const o = ac.createOscillator(), flt = ac.createBiquadFilter(), g = ac.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f, t);
    flt.type = 'lowpass';
    flt.frequency.value = 2200;
    envelope(g, t, 0.02, vol, dur);
    o.connect(flt).connect(g).connect(out);
    o.start(t); o.stop(t + dur + 0.05);
  }

  // Пэд: два расстроенных пилообразных на каждую ноту, мягкий фильтр
  function pad(ac, out, t, freqs, dur, vol) {
    const flt = ac.createBiquadFilter(), g = ac.createGain();
    flt.type = 'lowpass';
    flt.frequency.value = 900;
    flt.Q.value = 0.5;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.25);
    g.gain.setValueAtTime(vol, t + dur);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
    flt.connect(g).connect(out);
    freqs.forEach(function (f) {
      [-6, 6].forEach(function (cents) {
        const o = ac.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, t);
        o.detune.value = cents;
        o.connect(flt);
        o.start(t); o.stop(t + dur + 0.5);
      });
    });
  }

  // Колокольчик: синус + октава
  function bell(ac, out, t, f, dur, vol) {
    [[1, 1], [2, 0.25]].forEach(function (p) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(f * p[0], t);
      envelope(g, t, 0.004, vol * p[1], dur);
      o.connect(g).connect(out);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }

  // Бочка: синус с падающей частотой
  function kick(ac, out, t, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    envelope(g, t, 0.003, vol, 0.35);
    o.connect(g).connect(out);
    o.start(t); o.stop(t + 0.4);
  }

  // Малый барабан: шум + короткий тон
  function snare(ac, out, t, vol) {
    const n = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf(ac);
    flt.type = 'bandpass';
    flt.frequency.value = 1800;
    flt.Q.value = 0.8;
    envelope(g, t, 0.002, vol, 0.18);
    n.connect(flt).connect(g).connect(out);
    n.start(t); n.stop(t + 0.2);

    const o = ac.createOscillator(), og = ac.createGain();
    o.frequency.setValueAtTime(190, t);
    envelope(og, t, 0.002, vol * 0.6, 0.08);
    o.connect(og).connect(out);
    o.start(t); o.stop(t + 0.1);
  }

  // Хай-хэт: высокочастотный шум
  function hat(ac, out, t, vol) {
    const n = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf(ac);
    flt.type = 'highpass';
    flt.frequency.value = 7000;
    envelope(g, t, 0.001, vol, 0.04);
    n.connect(flt).connect(g).connect(out);
    n.start(t); n.stop(t + 0.06);
  }

  // ── Сборка цикла ─────────────────────────────────────

  function scheduleStep(ac, out, spec, i, t) {
    const stepDur = 60 / spec.bpm / 2;
    const bar = Math.floor(i / STEPS_PER_BAR);
    const pos = i % STEPS_PER_BAR;
    const chord = spec.chords[Math.floor(bar / CHORD_BARS) % spec.chords.length];
    const pattern = spec.melody[Math.floor(bar / CHORD_BARS) % spec.melody.length];

    if (spec.bass.includes(pos)) pluck(ac, out, t, chord.root / 2, stepDur * 1.6, 0.35);
    if (pos === 0 && spec.pad) pad(ac, out, t, chord.tones, stepDur * 7.5, 0.06);
    const m = pattern[pos];
    if (m > 0) lead(ac, out, t, m, stepDur * 1.6, 0.06, spec.lead);
    if (spec.arp.includes(pos)) {
      const f = chord.tones[pos % chord.tones.length] * 2;
      if (spec.bell) bell(ac, out, t, f, stepDur * 1.5, 0.05);
      else pluck(ac, out, t, f, stepDur * 1.2, 0.05, 'sine');
    }
    if (spec.kick.includes(pos)) kick(ac, out, t, 0.5);
    if (spec.snare.includes(pos)) snare(ac, out, t, spec.softSnare ? 0.12 : 0.22);
    if (spec.hats.includes(pos)) hat(ac, out, t, spec.hat);
  }

  // Отрисовка одного цикла с перенесением хвостов в начало: шва не будет
  function renderLoop(name) {
    const spec = TRACKS[name];
    const sr = 44100;
    const stepDur = 60 / spec.bpm / 2;
    const steps = BARS * STEPS_PER_BAR;
    const L = Math.round(steps * stepDur * sr);
    const T = Math.round(TAIL * sr);
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const ac = new OAC(2, L + T, sr);
    const out = ac.createGain();
    out.connect(ac.destination);
    for (let i = 0; i < steps; i++) scheduleStep(ac, out, spec, i, i * stepDur);

    return ac.startRendering().then(function (full) {
      const buf = getCtx().createBuffer(2, L, sr);
      for (let c = 0; c < 2; c++) {
        const src = full.getChannelData(c);
        const dst = buf.getChannelData(c);
        for (let k = 0; k < L; k++) dst[k] = src[k];
        // хвост, вышедший за конец цикла, добавляем в начало
        for (let k = 0; k < T; k++) dst[k] += src[L + k];
      }
      return buf;
    });
  }

  function getBuffer(name) {
    if (!cache[name]) cache[name] = renderLoop(name);
    return cache[name];
  }

  // ── Воспроизведение ──────────────────────────────────

  function startBuffer(name, buf, offset) {
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.4);
    out.connect(master);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.loopStart = 0;
    src.loopEnd = buf.duration;
    src.connect(out);
    const at = ctx.currentTime + 0.02;
    src.start(at, offset || 0);
    cur = { name: name, src: src, out: out, buf: buf, startAt: at - (offset || 0) };
  }

  function stopCurrent() {
    if (!cur) return;
    const t = ctx.currentTime, c = cur;
    cur = null;
    c.out.gain.cancelScheduledValues(t);
    c.out.gain.setValueAtTime(c.out.gain.value, t);
    c.out.gain.linearRampToValueAtTime(0, t + 0.3);
    setTimeout(function () { c.src.stop(); c.out.disconnect(); }, 350);
  }

  // Запускает трек; если браузер ещё не разрешил звук — дождётся первого касания
  function play(name) {
    wanted = name;
    const s = window.FTSettings ? FTSettings.load() : { music: true };
    if (!s.music || !TRACKS[name] || !getCtx()) return;
    if (cur && cur.name === name) return;
    stopCurrent();

    getBuffer(name).then(function (buf) {
      if (wanted !== name || cur) return;
      const offset = resumeOffset(name, buf.duration);
      if (ctx.state === 'running') startBuffer(name, buf, offset);
      else waitForGesture(name, buf, offset);
    });
  }

  // Текущая позиция внутри цикла, сек
  function position() {
    const d = cur.buf.duration;
    return (((ctx.currentTime - cur.startAt) % d) + d) % d;
  }

  // Запоминаем позицию, чтобы следующая страница продолжила трек
  function savePosition() {
    if (!cur) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({
        name: cur.name, pos: position(), dur: cur.buf.duration, wall: Date.now()
      }));
    } catch (e) {}
  }

  // Сдвиг в цикле с учётом времени, прошедшего между страницами
  function resumeOffset(name, dur) {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(POS_KEY)); } catch (e) {}
    try { localStorage.removeItem(POS_KEY); } catch (e) {}
    if (!saved || saved.name !== name || saved.dur !== dur) return 0;
    const elapsed = (Date.now() - saved.wall) / 1000;
    return (saved.pos + elapsed) % dur;
  }

  // Браузер не даёт звук без жеста: ждём касание и запускаем
  function waitForGesture(name, buf, offset) {
    const unlock = function () {
      ctx.resume().then(function () {
        if (wanted === name && !cur) startBuffer(name, buf, offset);
      });
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, unlock, { once: true });
    });
  }

  function stop() {
    wanted = null;
    try { localStorage.removeItem(POS_KEY); } catch (e) {}
    stopCurrent();
  }

  // Включение/выключение музыки в настройках
  document.addEventListener('ft-settings-applied', function (e) {
    if (e.detail && e.detail.music && wanted) play(wanted);
    else stopCurrent();
  });

  window.addEventListener('pagehide', function () { savePosition(); stopCurrent(); });

  return { play, stop };
})();
