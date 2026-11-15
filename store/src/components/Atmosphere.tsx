/* Light on the carpet.

   Late light from a studio window falls across the rug in four panes and
   drifts slowly, the way afternoon sun moves over a floor. Dust turns in it.
   While the page scrolls the light crosses the room, so a walk down the page
   takes a little time; on a computer it also leans toward the mouse.

   It lies on the carpet and under everything else, so the works keep their
   true colours. Decoration only (aria-hidden). No blend modes: plain alpha is
   cheap to composite on a phone, and every moving part is a transform. With
   motion off the light holds still and the dust is gone.
   theme.layout.immersive:false removes the whole layer. */
import {useEffect, useRef, type CSSProperties} from 'react';
import {useMotion} from '../lib/motion';
import {useShop} from '../lib/shop';

/** Fixed positions for the dust (a seeded sequence), so every visit is alike
    and nothing reflows between renders. */
function motes(n: number): CSSProperties[] {
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from(
    {length: n},
    () =>
      ({
        '--x': `${(12 + r() * 76).toFixed(1)}%`,
        '--y': `${(22 + r() * 70).toFixed(1)}%`,
        '--s': `${(1.2 + r() * 1.8).toFixed(1)}px`,
        '--d': `${(16 + r() * 18).toFixed(1)}s`,
        '--dl': `${(-r() * 34).toFixed(1)}s`,
        '--sx': `${((r() - 0.5) * 80).toFixed(0)}px`,
        '--o': (0.25 + r() * 0.35).toFixed(2),
      }) as CSSProperties,
  );
}
const DUST = motes(24);

/** The light itself: window panes and dust. Also used by the walk-through. */
export function Light({still = false}: {still?: boolean}) {
  return (
    <div className="light" data-still={still ? '' : undefined}>
      <div className="glow" />
      <div className="window">
        <i />
        <i />
        <i />
        <i />
      </div>
      {!still && (
        <div className="motes">
          {DUST.map((style, i) => (
            <i key={i} style={style} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Atmosphere() {
  const {site} = useShop();
  const {on} = useMotion();
  const lean = useRef<HTMLDivElement>(null);
  const enabled = site.theme?.layout?.immersive !== false;

  useEffect(() => {
    const el = lean.current;
    if (!el || !enabled || !on) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let p = 0;
    const progress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      p = Math.min(1, Math.max(0, scrollY / max));
    };
    const step = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      /* over the length of the page the light moves from left to right and
         sinks a little: the afternoon goes by while one walks through */
      const sx = (p - 0.5) * innerWidth * 0.3;
      const sy = (p - 0.5) * innerHeight * 0.16;
      el.style.transform = `translate3d(${(x + sx).toFixed(1)}px, ${(y + sy).toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = (e.clientX / innerWidth - 0.5) * 90;
      ty = (e.clientY / innerHeight - 0.5) * 60;
      kick();
    };
    const onScroll = () => {
      progress();
      kick();
    };
    progress();
    kick();
    const passive = {passive: true} as const;
    addEventListener('pointermove', onMove, passive);
    addEventListener('scroll', onScroll, passive);
    addEventListener('resize', onScroll, passive);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [enabled, on]);

  if (!enabled) return null;
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos-lean" ref={lean}>
        <Light still={!on} />
      </div>
      <div className="vignette" />
    </div>
  );
}
