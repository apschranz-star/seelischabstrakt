/* Living colour in the word "abstrakt".

   The colours of the paintings drift inside the letters; a swipe or the mouse
   drags them along and leaves a smear that slowly closes again. Purely for the
   look. The real text stays in the page (transparent) for screen readers,
   search and selection. theme.layout.liveColour:false turns it off; with
   reduced motion the word gets one still frame of colour.

   Plain canvas code on purpose, outside React: it runs every frame and must
   never cause a render. mountLiveColour returns the function that removes it. */

const PAL = ['#D7262B', '#2F5C9A', '#7B3FA6', '#F2B429', '#EFE7D8', '#120D0D', '#E8879B', '#4F8C86'];

interface Blob {
  c: string; hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; ph: number; sp: number;
}

export function mountLiveColour(host: HTMLElement, span: HTMLElement): () => void {
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d');
  if (!ctx) return () => {};
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  cv.className = 'wm-live';
  cv.setAttribute('aria-hidden', 'true');
  const low = document.createElement('canvas');
  const lc = low.getContext('2d')!;
  const paint = document.createElement('canvas');
  const pc = paint.getContext('2d')!;
  const mask = document.createElement('canvas');
  const blobs: Blob[] = PAL.concat(PAL, PAL).map((c, i) => ({
    c, hx: (i * 0.137 + 0.03) % 1, hy: (i * 0.61) % 1, x: 0, y: 0, vx: 0, vy: 0,
    r: 0.32 + ((i * 7) % 5) * 0.09, ph: i * 1.7, sp: 0.14 + ((i * 3) % 5) * 0.04,
  }));
  const ptr = {x: -1e4, y: -1e4, px: null as number | null, py: 0, vx: 0, vy: 0, on: 0, gx: null as number | null, gy: 0};
  let grain: CanvasPattern | null = null;
  let W = 0, H = 0, dpr = 1, raf = 0, vis = true, live = false, born = 0, ci = 0, dist = 0, gone = false;
  const t0 = performance.now();

  host.appendChild(cv);

  function measure() {
    if (gone) return;
    const tn = span.firstChild;
    if (!tn || tn.nodeType !== 3 || !(tn as Text).length) return setLive(false);
    const text = tn as Text;
    const cs = getComputedStyle(span);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const fs = parseFloat(cs.fontSize);
    ctx!.font = font;
    const asc = ctx!.measureText(text.data).fontBoundingBoxAscent;
    if (!asc) return setLive(false);
    const hr = host.getBoundingClientRect();
    const range = document.createRange();
    const glyphs: {ch: string; x: number; y: number}[] = [];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < text.length; i++) {
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      const b = range.getBoundingClientRect();
      glyphs.push({ch: text.data[i], x: b.left - hr.left, y: b.top - hr.top});
      x0 = Math.min(x0, b.left); x1 = Math.max(x1, b.right); y0 = Math.min(y0, b.top); y1 = Math.max(y1, b.bottom);
    }
    const pad = Math.round(fs * 0.08);
    x0 = x0 - hr.left - pad;
    y0 = y0 - hr.top - pad;
    W = Math.ceil(x1 - hr.left + pad - x0);
    H = Math.ceil(y1 - hr.top + pad - y0);
    if (W < 4 || H < 4) return setLive(false);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    cv.style.transform = `translate(${x0}px,${y0}px)`;
    low.width = Math.max(8, Math.ceil(W / 5));
    low.height = Math.max(4, Math.ceil(H / 5));
    paint.width = Math.max(8, Math.ceil(W / 2));
    paint.height = Math.max(4, Math.ceil(H / 2));
    if (!grain) {
      const n = document.createElement('canvas');
      n.width = n.height = 96;
      const nc = n.getContext('2d')!;
      const id = nc.createImageData(96, 96);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
        id.data[i + 3] = 255;
      }
      nc.putImageData(id, 0, 0);
      grain = ctx!.createPattern(n, 'repeat');
    }
    /* One mask with all letters, taken from where the page really put them. */
    mask.width = cv.width;
    mask.height = cv.height;
    const mc = mask.getContext('2d')!;
    mc.setTransform(dpr, 0, 0, dpr, 0, 0);
    mc.font = font;
    mc.textBaseline = 'alphabetic';
    mc.fillStyle = '#000';
    glyphs.forEach((g) => mc.fillText(g.ch, g.x - x0, g.y - y0 + asc));
    setLive(true);
    if (!born) born = performance.now();
    frame(performance.now());
    loop();
  }

  function setLive(on: boolean) {
    live = on;
    host.classList.toggle('live', on);
  }

  function stroke(ax: number, ay: number, bx: number, by: number, d: number) {
    dist += d;
    if (dist > H * 1.4) {
      dist = 0;
      ci = (ci + 1) % PAL.length;
    }
    const k = paint.width / W;
    const w = Math.max(4, H * k * (0.26 + Math.min(0.22, d / 110)));
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const nx = -(by - ay) / len, ny = (bx - ax) / len;
    pc.globalCompositeOperation = 'source-over';
    pc.lineCap = 'round';
    pc.strokeStyle = PAL[ci];
    pc.lineWidth = w;
    pc.beginPath(); pc.moveTo(ax * k, ay * k); pc.lineTo(bx * k, by * k); pc.stroke();
    /* bristles: thin lines of the neighbouring colours inside the stroke */
    for (let j = 0; j < 4; j++) {
      const o = (j / 3 - 0.5) * w * 0.8;
      pc.strokeStyle = PAL[(ci + 1 + j) % PAL.length];
      pc.globalAlpha = 0.55;
      pc.lineWidth = Math.max(1, w * 0.09);
      pc.beginPath(); pc.moveTo(ax * k + nx * o, ay * k + ny * o); pc.lineTo(bx * k + nx * o, by * k + ny * o); pc.stroke();
    }
    pc.globalAlpha = 1;
  }

  function hit(cx: number, cy: number) {
    if (!live) return;
    const b = cv.getBoundingClientRect();
    const x = cx - b.left, y = cy - b.top;
    const m = Math.max(24, H * 0.25);
    if (x < -m || y < -m || x > b.width + m || y > b.height + m) {
      ptr.px = null;
      return;
    }
    if (ptr.px !== null) {
      const dx = x - ptr.px, dy = y - ptr.py;
      ptr.vx = ptr.vx * 0.5 + dx * 0.5;
      ptr.vy = ptr.vy * 0.5 + dy * 0.5;
      stroke(ptr.px, ptr.py, x, y, Math.hypot(dx, dy));
    }
    ptr.x = x; ptr.y = y; ptr.px = x; ptr.py = y; ptr.on = 1;
    if (still) frame(performance.now());
  }

  function frame(t: number) {
    if (!live) return;
    const s = (t - t0) / 1000, lw = low.width, lh = low.height;
    /* a ghost brush sweeps through the word once after load, to show it is alive */
    const g = (t - born) / 1800;
    if (!still && g > 0 && g < 1) {
      const gx = W * (-0.05 + g * 1.1), gy = H * (0.5 + 0.28 * Math.sin(g * Math.PI * 3));
      if (ptr.gx !== null) stroke(ptr.gx, ptr.gy, gx, gy, Math.hypot(gx - ptr.gx, gy - ptr.gy));
      ptr.gx = gx; ptr.gy = gy; ptr.x = gx; ptr.y = gy; ptr.vx = W * 0.02; ptr.vy = 0; ptr.on = 1;
    }
    lc.globalCompositeOperation = 'source-over';
    lc.fillStyle = PAL[4];
    lc.fillRect(0, 0, lw, lh);
    for (const b of blobs) {
      const hx = b.hx + Math.sin(s * b.sp + b.ph) * 0.18, hy = b.hy + Math.cos(s * b.sp * 1.3 + b.ph) * 0.35;
      const px = (b.hx + b.x) * W, py = (b.hy + b.y) * H;
      const d = Math.hypot(px - ptr.x, py - ptr.y), R = H * 1.1;
      if (ptr.on > 0.01 && d < R) {
        const f = (1 - d / R) * ptr.on * 0.0009;
        b.vx += ptr.vx * f;
        b.vy += ptr.vy * f * (W / H);
      }
      b.vx += (hx - b.hx - b.x) * 0.002; b.vy += (hy - b.hy - b.y) * 0.002;
      b.vx *= 0.94; b.vy *= 0.94; b.x += b.vx; b.y += b.vy;
      const cx = (b.hx + b.x) * lw, cy = (b.hy + b.y) * lh, rr = b.r * lh * 1.3;
      const gr = lc.createRadialGradient(cx, cy, 0, cx, cy, rr);
      gr.addColorStop(0, b.c); gr.addColorStop(0.62, b.c); gr.addColorStop(1, b.c + '00');
      lc.fillStyle = gr;
      lc.beginPath(); lc.arc(cx, cy, rr, 0, 7); lc.fill();
    }
    ptr.on *= 0.94; ptr.vx *= 0.9; ptr.vy *= 0.9;
    /* the smear drifts with the last movement and slowly closes */
    if (!still) {
      pc.globalCompositeOperation = 'copy';
      pc.globalAlpha = 0.985;
      pc.drawImage(paint, ptr.vx * 0.08, ptr.vy * 0.08 + 0.06);
      pc.globalAlpha = 1;
    }
    const c = ctx!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, W, H);
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = 'high';
    c.drawImage(low, 0, 0, W, H);
    c.drawImage(paint, 0, 0, W, H);
    if (ptr.on > 0.02) {
      c.globalCompositeOperation = 'soft-light';
      const sh = c.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, H * 0.9);
      sh.addColorStop(0, `rgba(255,255,255,${0.55 * ptr.on})`);
      sh.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = sh;
      c.fillRect(0, 0, W, H);
    }
    if (grain) {
      c.globalCompositeOperation = 'overlay';
      c.globalAlpha = 0.16;
      c.fillStyle = grain;
      c.fillRect(0, 0, W, H);
      c.globalAlpha = 1;
    }
    c.globalCompositeOperation = 'destination-in';
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(mask, 0, 0);
    c.globalCompositeOperation = 'source-over';
  }

  function loop() {
    if (raf || still || !vis || document.hidden || !live || gone) return;
    raf = requestAnimationFrame(function tick(t) {
      frame(t);
      raf = vis && !document.hidden && live && !gone ? requestAnimationFrame(tick) : 0;
    });
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') hit(e.clientX, e.clientY);
  };
  const onTouch = (e: TouchEvent) => {
    const t = e.touches && e.touches[0];
    if (t) hit(t.clientX, t.clientY);
  };
  const onTouchStart = (e: TouchEvent) => {
    ptr.px = null;
    onTouch(e);
  };
  const onTouchEnd = () => {
    ptr.px = null;
  };
  let rt = 0;
  const onResize = () => {
    clearTimeout(rt);
    rt = window.setTimeout(measure, 120);
  };
  const passive = {passive: true} as const;
  addEventListener('pointermove', onMove, passive);
  addEventListener('touchstart', onTouchStart, passive);
  addEventListener('touchmove', onTouch, passive);
  addEventListener('touchend', onTouchEnd, passive);
  addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', loop);
  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      loop();
    });
    io.observe(host);
  }
  /* The word is laid out with the web font; measuring before it arrives would
     put the colour where the fallback font had its letters. */
  document.fonts?.ready?.then(measure);
  measure();

  return () => {
    gone = true;
    cancelAnimationFrame(raf);
    clearTimeout(rt);
    removeEventListener('pointermove', onMove);
    removeEventListener('touchstart', onTouchStart);
    removeEventListener('touchmove', onTouch);
    removeEventListener('touchend', onTouchEnd);
    removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', loop);
    io?.disconnect();
    cv.remove();
    host.classList.remove('live');
  };
}
