/* On a computer a picture leans a little toward the mouse, and a soft glare
   follows the mouse over its surface, as light does on varnish.

   Only with a fine pointer that can hover; on a touch screen motion.css tilts
   the pictures with the scroll instead. One listener for the whole page; the
   values reach the styles as custom properties on the picture under the
   mouse (--rx, --ry, --mx, --my). Returns the function that removes it. */
export function mountTilt(root: HTMLElement): () => void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  let el: HTMLElement | null = null;
  let raf = 0;
  let px = 0;
  let py = 0;

  const reset = (x: HTMLElement) => {
    x.style.removeProperty('--rx');
    x.style.removeProperty('--ry');
    x.style.removeProperty('--mx');
    x.style.removeProperty('--my');
  };

  const update = () => {
    raf = 0;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = Math.min(1, Math.max(0, (px - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (py - r.top) / r.height));
    el.style.setProperty('--rx', `${((x - 0.5) * 5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((0.5 - y) * 4).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const hit = (e.target as Element | null)?.closest?.('.framed .mat') as HTMLElement | null;
    if (hit !== el) {
      if (el) reset(el);
      el = hit;
    }
    if (!el) return;
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };

  const onLeave = () => {
    if (el) reset(el);
    el = null;
  };

  root.addEventListener('pointermove', onMove, {passive: true});
  root.addEventListener('pointerleave', onLeave, {passive: true});
  return () => {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerleave', onLeave);
    if (el) reset(el);
  };
}
