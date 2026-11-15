/* One switch for everything on the page that moves by itself: the ticker, the
   light on the carpet, the dust in it, the floating works, the marker lines.

   WCAG 2.2.2 asks that anything moving for longer than five seconds beside
   other content can be paused. The switch sits in the yellow band at the top
   and in the footer. Without a choice of the visitor's own, the system
   setting decides (prefers-reduced-motion). A choice the visitor makes is kept
   in the browser under the key "sa-motion" and nowhere else; the privacy
   text names it.

   The switch reaches the styles as html[data-motion="on" | "off"]. It stops
   the shop's own decoration only. Astryx components keep their short,
   functional transitions and follow the system setting themselves. */
import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';

interface Motion {
  /** decorative motion runs */
  on: boolean;
  set: (on: boolean) => void;
}

const Ctx = createContext<Motion>({on: false, set: () => {}});

export const useMotion = (): Motion => useContext(Ctx);

const KEY = 'sa-motion';
const QUERY = '(prefers-reduced-motion: reduce)';

function stored(): boolean | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' ? true : v === 'off' ? false : null;
  } catch {
    return null;
  }
}

const systemReduced = () => typeof matchMedia === 'function' && matchMedia(QUERY).matches;

export function MotionProvider({children}: {children: ReactNode}) {
  const [choice, setChoice] = useState<boolean | null>(stored);
  const [reduced, setReduced] = useState(systemReduced);

  useEffect(() => {
    const mq = matchMedia(QUERY);
    const sync = () => setReduced(mq.matches);
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  const on = choice ?? !reduced;

  useEffect(() => {
    document.documentElement.dataset.motion = on ? 'on' : 'off';
  }, [on]);

  const set = useCallback((next: boolean) => {
    setChoice(next);
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {
      /* private mode: the choice holds for this visit only */
    }
  }, []);

  const value = useMemo(() => ({on, set}), [on, set]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
