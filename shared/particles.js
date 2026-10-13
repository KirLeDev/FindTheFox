/* FindTheFox — переиспользуемые частицы на canvas */

window.FTParticles = (function () {
  'use strict';

  function attach(canvas, opts) {
    const o = Object.assign({
      count:      25,
      color:      [255, 217, 102],  // rgb
      maxAlpha:   0.6,
      riseMin:    10,
      riseMax:    30,
      ttlMin:     6,
      ttlMax:     8,
      radiusMin:  1,
      radiusMax:  3,
      areaW:      720,
      areaH:      1280,
      spawnBottom: 640,             // от какого Y начинается спавн
      fadeIn:     1.5,
      fadeOut:    1.5
    }, opts || {});

    const ctx = canvas.getContext('2d');
    const particles = [];
    let raf = 0;
    let running = false;
    let last = 0;

    function resetCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = o.areaW * dpr;
      canvas.height = o.areaH * dpr;
      canvas.style.width  = o.areaW + 'px';
      canvas.style.height = o.areaH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(p) {
      p.x    = Math.random() * o.areaW;
      p.y    = o.spawnBottom + Math.random() * (o.areaH - o.spawnBottom);
      p.r    = o.radiusMin + Math.random() * (o.radiusMax - o.radiusMin);
      p.vy   = -(o.riseMin + Math.random() * (o.riseMax - o.riseMin));
      p.vx   = (Math.random() - 0.5) * 12;
      p.ttl  = o.ttlMin + Math.random() * (o.ttlMax - o.ttlMin);
      p.life = 0;
      return p;
    }

    function init() {
      particles.length = 0;
      for (let i = 0; i < o.count; i++) {
        const p = spawn({});
        p.life = Math.random() * p.ttl;
        particles.push(p);
      }
    }

    function tick(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, o.areaW, o.areaH);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt;

        if (p.life > p.ttl || p.y < -20) { spawn(p); continue; }

        let a = 1;
        if (p.life < o.fadeIn) a = p.life / o.fadeIn;
        else if (p.life > p.ttl - o.fadeOut)
          a = (p.ttl - p.life) / o.fadeOut;
        a = Math.max(0, Math.min(1, a)) * o.maxAlpha;

        ctx.fillStyle = 'rgba(' + o.color[0] + ',' + o.color[1] + ',' +
                        o.color[2] + ',' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resetCanvas();
    init();
    window.addEventListener('resize', resetCanvas);

    return {
      start: function () {
        if (running) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      },
      stop: function () {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      },
      reset: init
    };
  }

  return { attach };
})();