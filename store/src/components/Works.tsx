/* The works: each one framed on the carpet with its paper label, like the
   card beside a picture in a show. */
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {Text} from '@astryxdesign/core/Text';
import {mailto} from '../lib/forms';
import {srcSet} from '../lib/images';
import {paintPlaceholder} from '../lib/placeholder';
import {safeUrl, useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import type {Work} from '../lib/types';
import {NativeSelect} from './NativeSelect';
import {Paper} from './Paper';

type Filter = 'all' | 'original' | 'print' | 'available';

export function Works() {
  const {site, works, t, L, hidden, soon} = useShop();
  const [filter, setFilter] = useState<Filter>('all');
  const emptyText = (key: 'works' | 'filter') =>
    L(site.texts?.empty?.[key]) || t(key === 'filter' ? 'filter.empty' : 'works.empty');

  const shown = soon
    ? []
    : works.filter((w) =>
        filter === 'print'
          ? (w.prints?.length || 0) > 0
          : filter === 'original'
            ? !!w.original
            : filter === 'available'
              ? !!w.original?.available || (w.prints?.length || 0) > 0
              : true,
      );
  const note = t('works.note');
  const single = site.theme?.layout?.worksLayout === 'single';

  return (
    <section className="sec" id="works" tabIndex={-1}>
      <div className="sec-head reveal">
        <div>
          <p className="kicker">{L(site.texts?.worksKicker)}</p>
          <Heading level={2} className="sec-title">
            {t('works.title')}
          </Heading>
        </div>
        {!hidden('filters') && !soon && (
          <SegmentedControl label={t('filter.label')} value={filter} onChange={(v) => setFilter(v as Filter)} size="sm">
            <SegmentedControlItem value="all" label={t('filter.all')} />
            <SegmentedControlItem value="original" label={t('filter.original')} />
            <SegmentedControlItem value="print" label={t('filter.print')} />
            <SegmentedControlItem value="available" label={t('filter.available')} />
          </SegmentedControl>
        )}
      </div>
      {shown.length ? (
        <div className="works" aria-live="polite">
          {shown.map((w, i) => (
            <WorkCard key={w.id} work={w} delay={single ? 0 : (i % 3) * 120} />
          ))}
        </div>
      ) : (
        <p className="empty reveal" aria-live="polite">
          {emptyText(soon || !works.length ? 'works' : 'filter')}
        </p>
      )}
      {note && <p className="note reveal">{note}</p>}
    </section>
  );
}

function WorkCard({work: w, delay}: {work: Work; delay: number}) {
  const {site, t, L, fmt} = useShop();
  const {open} = useUi();
  const layout = site.theme?.layout || {};
  const nomat = w.nomat === true || (w.nomat !== false && layout.framesByDefault === false);
  const tilt = layout.showTilt === false ? 0 : w.tilt || 0;
  const available = !!w.original?.available;
  const src = w._preview || w.img;
  const price = available
    ? fmt(w.original!.price)
    : w.prints?.length
      ? `${t('lbl.from')} ${fmt(Math.min(...w.prints.map((p) => p.price)))}`
      : t('lbl.sold');
  const spec =
    [w.year, L(w.medium), `${w.w} × ${w.h} cm`].filter(Boolean).join(' · ') +
    (w.prints?.length ? ` · ${t('lbl.print')}: ${w.prints.map((p) => p.size).join(', ')}` : '');
  const caption = L(w.caption);

  return (
    <article className={`work ${w.size || ''} reveal`} style={{'--d': `${delay}ms`} as CSSProperties}>
      <div className={`framed${nomat ? ' nomat' : ''}`} style={{'--tilt': `${tilt}deg`} as CSSProperties}>
        <button
          type="button"
          className="mat"
          aria-label={t('work.open', {title: w.title})}
          onClick={() => open({type: 'work', id: w.id})}>
          {src ? (
            <img
              src={safeUrl(src)}
              srcSet={w._preview ? undefined : srcSet(w, src)}
              sizes="(min-width: 980px) 900px, 94vw"
              alt={L(w.alt) || w.title}
              loading="lazy"
              decoding="async"
              width={w.w * 10}
              height={w.h * 10}
              style={{'--ar': `${w.w}/${w.h}`} as CSSProperties}
            />
          ) : (
            <Placeholder work={w} label={`${w.title}, ${t('lbl.placeholder')}`} />
          )}
        </button>
        <span className="tag">
          <Badge variant={available ? 'neutral' : 'gray'} label={available ? t('lbl.original') : t('lbl.sold')} />
        </span>
      </div>
      <Paper>
        <div className="label">
          <Heading level={3} className="label-title">
            {w.title}
          </Heading>
          <Text as="div" className="price" hasTabularNumbers>
            {price}
          </Text>
          <Text as="p" type="supporting" className="spec">
            {spec}
          </Text>
          {caption && (
            <Text as="p" className="cap">
              {caption}
            </Text>
          )}
          <div className="buy">
            <BuyControls work={w} size="sm" />
            <Button label={t('lbl.details')} variant="secondary" size="sm" onClick={() => open({type: 'work', id: w.id})} />
          </div>
        </div>
      </Paper>
    </article>
  );
}

export function Placeholder({work: w, label}: {work: Work; label: string}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) paintPlaceholder(ref.current, w.w, w.h, w.seed, w.style);
  }, [w.w, w.h, w.seed, w.style]);
  return <canvas ref={ref} role="img" aria-label={label} />;
}

/** What can be done with a work: buy the original, buy an edition, or ask. */
export function BuyControls({work: w, size = 'md'}: {work: Work; size?: 'sm' | 'md'}) {
  const {site, t, fmt, orderable, email} = useShop();
  const {open} = useUi();
  const [pick, setPick] = useState(0);
  const prints = w.prints || [];
  const print = prints[Math.min(pick, prints.length - 1)];
  const ask = (what: string) => mailto(email || site.brand.email || '', `${w.title} (${what})`, '');

  return (
    <>
      {w.original?.available &&
        (w.original.link ? (
          <Button label={t('lbl.buyOriginal')} variant="primary" size={size} href={safeUrl(w.original.link)} target="_blank" rel="noopener" />
        ) : orderable ? (
          <Button
            label={t('lbl.buyOriginal')}
            variant="primary"
            size={size}
            onClick={() => open({type: 'order', id: w.id, variant: {kind: 'original', label: t('lbl.original'), price: w.original!.price}})}
          />
        ) : (
          <Button label={`${t('lbl.enquire')} · ${t('lbl.original')}`} variant="primary" size={size} href={ask(t('lbl.original'))} />
        ))}
      {print && (
        <>
          <div className="size-pick">
            <NativeSelect
              label={t('lbl.chooseSize')}
              isLabelHidden
              size={size}
              value={String(pick)}
              onChange={(v) => setPick(Number(v))}
              options={prints.map((p, i) => ({value: String(i), label: `${p.size} cm · ${fmt(p.price)}`}))}
            />
          </div>
          {print.link ? (
            <Button label={t('lbl.buyPrint')} variant="secondary" size={size} href={safeUrl(print.link)} target="_blank" rel="noopener" />
          ) : orderable ? (
            <Button
              label={t('lbl.buyPrint')}
              variant="secondary"
              size={size}
              onClick={() =>
                open({type: 'order', id: w.id, variant: {kind: 'print', label: `${t('lbl.print')} ${print.size} cm`, price: print.price}})
              }
            />
          ) : (
            <Button label={t('lbl.buyPrint')} variant="secondary" size={size} href={ask(`${t('lbl.print')} ${print.size} cm`)} />
          )}
        </>
      )}
    </>
  );
}
