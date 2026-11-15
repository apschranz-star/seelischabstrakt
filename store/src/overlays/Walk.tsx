/* Rundgang: the works one at a time, large, on the carpet, the way one walks
   through a studio and stops in front of each picture.

   A swipe, the arrow keys or the two buttons move on; nothing advances by
   itself. Each stop shows the work in the window light with its label, and
   the way to look closer or to buy. The last stop says goodbye and leaves the
   way to write. Address: #rundgang (also #walk). */
import {useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type SVGProps} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Dialog} from '@astryxdesign/core/Dialog';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Text} from '@astryxdesign/core/Text';
import {Light} from '../components/Atmosphere';
import {BuyControls, Placeholder} from '../components/Works';
import {large, srcSet} from '../lib/images';
import {useMotion} from '../lib/motion';
import {safeUrl, useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import type {Work} from '../lib/types';

function Prev(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" {...props}>
      <path d="M15 4 L7 12 L15 20" strokeLinecap="square" />
    </svg>
  );
}
function Next(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" {...props}>
      <path d="M9 4 L17 12 L9 20" strokeLinecap="square" />
    </svg>
  );
}

/** The carpet as the page shows it, read from the page itself, so a carpet
    set in the studio desk is the one the walk takes place on. */
function useCarpet(): CSSProperties {
  return useMemo(() => {
    const cs = getComputedStyle(document.body);
    return {
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      backgroundSize: cs.backgroundSize,
      backgroundRepeat: cs.backgroundRepeat,
    };
  }, []);
}

export function Walk({index: start = 0}: {index?: number}) {
  const {works, t, soon} = useShop();
  const {close} = useUi();
  const {on: moving} = useMotion();
  const carpet = useCarpet();
  const list = useMemo(() => (soon ? [] : works), [soon, works]);
  const stops = list.length + 1;
  const [i, setI] = useState(() => Math.min(Math.max(0, start), stops - 1));
  const [dir, setDir] = useState<1 | -1>(1);

  const go = useCallback(
    (to: number) => {
      const next = (to + stops) % stops;
      setDir(to > i ? 1 : -1);
      setI(next);
    },
    [i, stops],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(i + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(i - 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(stops - 1);
      else return;
      e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, i, stops]);

  /* swipe: a clear sideways move of the finger, not a scroll */
  const from = useRef<{x: number; y: number} | null>(null);
  const down = (e: RPointerEvent) => {
    if (e.pointerType !== 'mouse') from.current = {x: e.clientX, y: e.clientY};
  };
  const up = (e: RPointerEvent) => {
    const f = from.current;
    from.current = null;
    if (!f) return;
    const dx = e.clientX - f.x;
    const dy = e.clientY - f.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? i + 1 : i - 1);
  };

  const w = list[i];
  const label = w ? t('walk.at', {n: i + 1, total: list.length, title: w.title}) : t('walk.end');

  return (
    <Dialog isOpen onOpenChange={(open) => !open && close()} variant="fullscreen" padding={0} aria-label={t('walk.title')}>
      <div className="walk" style={carpet}>
        <div className="walk-air" aria-hidden="true">
          <Light still={!moving} />
          <div className="vignette" />
        </div>
        <div className="walk-top">
          <Text as="p" className="walk-count">
            <span aria-hidden="true">
              {w ? String(i + 1).padStart(2, '0') : '—'} / {String(list.length).padStart(2, '0')}
            </span>
            <span className="sr" aria-live="polite">
              {label}
            </span>
          </Text>
          <Text as="p" className="walk-name">
            {t('walk.title')}
          </Text>
          <IconButton label={t('close')} icon={<Icon icon="close" />} variant="ghost" onClick={close} />
        </div>

        <div className="walk-stage" key={i} data-dir={dir} onPointerDown={down} onPointerUp={up} onPointerCancel={() => (from.current = null)}>
          {w ? <Stop work={w} /> : <Outro />}
        </div>

        <div className="walk-nav">
          <IconButton label={t('walk.prev')} icon={<Icon icon={Prev} />} variant="secondary" onClick={() => go(i - 1)} />
          <div className="walk-line" role="presentation">
            {Array.from({length: stops}, (_, k) => (
              <span key={k} className={k === i ? 'on' : k < i ? 'past' : ''} />
            ))}
          </div>
          <IconButton label={t('walk.next')} icon={<Icon icon={Next} />} variant="secondary" onClick={() => go(i + 1)} />
        </div>
        <Text as="p" className="walk-hint">
          {t('walk.hint')}
        </Text>
      </div>
    </Dialog>
  );
}

function Stop({work: w}: {work: Work}) {
  const {t, L, fmt} = useShop();
  const {open} = useUi();
  const src = w._preview || w.img;
  const available = !!w.original?.available;
  const price = available
    ? fmt(w.original!.price)
    : w.prints?.length
      ? `${t('lbl.from')} ${fmt(Math.min(...w.prints.map((p) => p.price)))}`
      : t('lbl.sold');
  const spec = [w.year, L(w.medium), `${w.w} × ${w.h} cm`].filter(Boolean).join(' · ');
  const caption = L(w.caption);
  return (
    <>
      <figure className="walk-art" style={{'--ar': `${w.w}/${w.h}`} as CSSProperties}>
        <span className="walk-lay">
          {src ? (
            <img
              src={safeUrl(w._preview ? src : large(w, src))}
              srcSet={w._preview ? undefined : srcSet(w, src)}
              sizes="(min-width: 1100px) 58vw, 92vw"
              alt={L(w.alt) || w.title}
              decoding="async"
            />
          ) : (
            <Placeholder work={w} label={`${w.title}, ${t('lbl.placeholder')}`} />
          )}
        </span>
      </figure>
      <div className="walk-text">
        <Heading level={2} className="walk-title">
          {w.title}
        </Heading>
        <Text as="p" className="walk-spec">
          {spec}
          <span className="walk-price">{price}</span>
        </Text>
        {caption && (
          <Text as="p" className="walk-cap">
            {caption}
          </Text>
        )}
        <div className="walk-actions">
          <BuyControls work={w} />
          <Button label={t('lbl.details')} variant="secondary" onClick={() => open({type: 'work', id: w.id})} />
        </div>
      </div>
    </>
  );
}

function Outro() {
  const {site, t} = useShop();
  const {open, close} = useUi();
  return (
    <div className="walk-outro">
      <Text as="p" className="walk-outro-mark" aria-hidden="true">
        {site.brand.wordmarkTop}
        <b>{site.brand.wordmarkBottom}</b>
      </Text>
      <Heading level={2} className="walk-title">
        {t('walk.end')}
      </Heading>
      <Text as="p" className="walk-cap">
        {t('walk.endText')}
      </Text>
      <div className="walk-actions">
        <Button label={t('contact.form')} variant="primary" onClick={() => open({type: 'contact'})} />
        <Button label={t('walk.back')} variant="secondary" onClick={close} />
      </div>
    </div>
  );
}
