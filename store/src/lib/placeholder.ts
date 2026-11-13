/* Placeholder paintings for works that have no photo yet. Drawn from the
   work's seed, so the same work always gets the same picture. */

type RGB = [number, number, number];
const PAL: Record<string, RGB> = {
  cobalt: [47, 85, 208], ultramarine: [28, 44, 140], cadmium: [242, 180, 41], vermilion: [196, 44, 36],
  crimson: [140, 29, 29], black: [18, 14, 14], white: [240, 232, 220], viridian: [36, 120, 90],
  magenta: [200, 60, 140], ochre: [190, 140, 70], violet: [100, 60, 150],
};

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function knife(c: CanvasRenderingContext2D, r: () => number, W: number, H: number, col: RGB, a: number, len: number, wid: number) {
  c.save();
  c.translate(r() * W, r() * H);
  c.rotate(r() * Math.PI);
  c.fillStyle = `rgba(${col.join(',')},${a})`;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(len, (r() - 0.5) * wid * 0.4);
  c.lineTo(len * 0.9, wid);
  c.lineTo(-len * 0.1, wid * 0.8);
  c.closePath();
  c.fill();
  c.restore();
}

export function paintPlaceholder(cv: HTMLCanvasElement, w: number, h: number, seed = 1, style = ''): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = 560, H = Math.round((560 * h) / w);
  cv.width = W * dpr;
  cv.height = H * dpr;
  cv.style.aspectRatio = `${w} / ${h}`;
  const c = cv.getContext('2d');
  if (!c) return;
  c.scale(dpr, dpr);
  const r = rng(seed || 1);
  const P = Object.values(PAL);
  const pick = () => P[Math.floor(r() * P.length)];
  const rgb = (col: RGB) => `rgb(${col.join(',')})`;
  if (style === 'ink') {
    c.fillStyle = '#f5f1ea';
    c.fillRect(0, 0, W, H);
    c.strokeStyle = '#1a1616';
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(W * 0.35, H * 0.15);
    for (let i = 0; i < 9; i++) c.quadraticCurveTo(W * (0.2 + r() * 0.6), H * (0.1 + r() * 0.8), W * (0.25 + r() * 0.5), H * (0.15 + r() * 0.75));
    c.stroke();
    c.beginPath();
    c.arc(W * 0.45, H * 0.42, W * 0.05, 0, Math.PI * 2);
    c.stroke();
    return;
  }
  const ground: RGB =
    style === 'eye' || style === 'gesture' ? PAL.crimson
    : style === 'grid' ? PAL.cobalt
    : style === 'splatter' ? [70, 62, 60]
    : style === 'face' ? PAL.white
    : PAL.black;
  c.fillStyle = rgb(ground);
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < (style === 'splatter' ? 0 : 90); i++) knife(c, r, W, H, pick(), 0.55 + r() * 0.45, 40 + r() * W * 0.5, 10 + r() * 48);
  if (style === 'grid')
    for (let i = 0; i < 14; i++) {
      c.fillStyle = `rgba(${(r() > 0.5 ? PAL.white : PAL.cadmium).join(',')},${0.6 + r() * 0.4})`;
      const v = r() > 0.5;
      c.fillRect(v ? r() * W : 0, v ? 0 : r() * H, v ? 8 + r() * 22 : W, v ? H : 8 + r() * 22);
    }
  if (style === 'eye') {
    c.fillStyle = `rgba(${PAL.white.join(',')},.92)`;
    c.beginPath(); c.ellipse(W * 0.5, H * 0.5, W * 0.22, H * 0.28, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = rgb(PAL.black);
    c.lineWidth = 14;
    c.beginPath(); c.ellipse(W * 0.5, H * 0.5, W * 0.3, H * 0.4, 0, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 6;
    c.beginPath(); c.arc(W * 0.5, H * 0.5, W * 0.07, 0, Math.PI * 2); c.stroke();
  }
  if (style === 'face') {
    c.strokeStyle = rgb(PAL.cobalt);
    c.lineWidth = 7;
    c.lineCap = 'round';
    c.beginPath(); c.moveTo(W * 0.3, H * 0.32); c.quadraticCurveTo(W * 0.4, H * 0.28, W * 0.46, H * 0.33); c.stroke();
    c.beginPath(); c.moveTo(W * 0.55, H * 0.33); c.quadraticCurveTo(W * 0.62, H * 0.28, W * 0.72, H * 0.32); c.stroke();
    c.beginPath(); c.moveTo(W * 0.5, H * 0.4); c.lineTo(W * 0.46, H * 0.6); c.lineTo(W * 0.54, H * 0.6); c.stroke();
    c.strokeStyle = rgb(PAL.magenta);
    c.beginPath(); c.moveTo(W * 0.4, H * 0.75); c.quadraticCurveTo(W * 0.5, H * 0.82, W * 0.62, H * 0.75); c.stroke();
  }
  if (style === 'swirl')
    for (let i = 0; i < 200; i++) {
      const a = i * 0.35, rad = i * 1.1;
      c.fillStyle = `rgba(${pick().join(',')},.9)`;
      c.beginPath(); c.arc(W / 2 + Math.cos(a) * rad, H / 2 + Math.sin(a) * rad, 6 + r() * 14, 0, Math.PI * 2); c.fill();
    }
  if (style === 'splatter') {
    for (let i = 0; i < 900; i++) {
      c.fillStyle = `rgba(${PAL.white.join(',')},${0.5 + r() * 0.5})`;
      c.beginPath();
      c.arc(W * (0.2 + r() * 0.6) + (r() - 0.5) * W * 0.5, H * (0.3 + r() * 0.4) + (r() - 0.5) * H * 0.5, r() * r() * 9, 0, Math.PI * 2);
      c.fill();
    }
    for (let i = 0; i < 8; i++) knife(c, r, W, H, PAL.white, 0.9, 60 + r() * 160, 8 + r() * 14);
  }
  const img = c.getImageData(0, 0, W * dpr, H * dpr);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (r() - 0.5) * 18;
    d[i] += v; d[i + 1] += v; d[i + 2] += v;
  }
  c.putImageData(img, 0, 0);
}
