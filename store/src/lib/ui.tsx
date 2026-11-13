/* Which sheet is open. One at a time: a work, an order, a legal text, the
   withdrawal form, the contact form or an enlarged photo. The address bar
   follows, so every sheet has a link that can be sent and opened again
   (#work/w11, #imprint, #widerruf ...). */
import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import type {LegalKind, OrderVariant} from './types';

export type Overlay =
  | {type: 'work'; id: string}
  | {type: 'order'; id: string; variant: OrderVariant}
  | {type: 'legal'; kind: LegalKind}
  | {type: 'withdraw'}
  | {type: 'contact'; subject?: string}
  | {type: 'photo'; id: string; index: number}
  | {type: 'notice'}
  | {type: 'menu'}
  | null;

interface Ui {
  overlay: Overlay;
  open: (overlay: Exclude<Overlay, null>) => void;
  close: () => void;
}

const Ctx = createContext<Ui | null>(null);

export function useUi(): Ui {
  const ui = useContext(Ctx);
  if (!ui) throw new Error('useUi outside UiProvider');
  return ui;
}

export const LEGAL_KINDS: LegalKind[] = [
  'imprint', 'privacy', 'terms', 'withdrawal', 'shipping', 'guarantee', 'us', 'access',
];

function fromHash(hash: string): Overlay {
  const h = decodeURIComponent(hash.replace(/^#/, ''));
  if (!h) return null;
  if (h.startsWith('work/')) return {type: 'work', id: h.slice(5)};
  if (h === 'widerruf' || h === 'withdraw') return {type: 'withdraw'};
  if (h === 'message' || h === 'nachricht') return {type: 'contact'};
  if ((LEGAL_KINDS as string[]).includes(h)) return {type: 'legal', kind: h as LegalKind};
  return null;
}

function toHash(o: Overlay): string | null {
  if (!o) return '';
  if (o.type === 'work') return `#work/${encodeURIComponent(o.id)}`;
  if (o.type === 'legal') return `#${o.kind}`;
  if (o.type === 'withdraw') return '#widerruf';
  if (o.type === 'contact') return '#message';
  return null; // order, photo, menu: no address of their own
}

export function UiProvider({children}: {children: ReactNode}) {
  const [overlay, setOverlay] = useState<Overlay>(() => fromHash(location.hash));

  const open = useCallback((next: Exclude<Overlay, null>) => {
    setOverlay(next);
    const hash = toHash(next);
    if (hash !== null) history.replaceState(null, '', location.pathname + location.search + hash);
  }, []);

  const close = useCallback(() => {
    setOverlay(null);
    if (fromHash(location.hash)) history.replaceState(null, '', location.pathname + location.search);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const next = fromHash(location.hash);
      if (next) setOverlay(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const ui = useMemo<Ui>(() => ({overlay, open, close}), [overlay, open, close]);
  return <Ctx.Provider value={ui}>{children}</Ctx.Provider>;
}
