/* One work, seen properly: all its photos, what it is, how large it hangs,
   what comes with it, and the way to buy it. */
import {useEffect, useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {Placeholder, BuyControls} from '../components/Works';
import {photos, small, srcSet} from '../lib/images';
import {safeUrl, useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import type {Work} from '../lib/types';
import {Sheet} from './Sheet';

export function WorkSheet({id, index: startIndex = 0}: {id: string; index?: number}) {
  const {site, works, t, L, fmt, withdrawalDays} = useShop();
  const {open, close} = useUi();
  const toast = useToast();
  const w = works.find((x) => x.id === id);
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (!w) close();
  }, [w, close]);
  if (!w) return null;

  const pics = photos(w);
  const current = pics[Math.min(index, pics.length - 1)];
  const available = !!w.original?.available;
  const price = available
    ? fmt(w.original!.price)
    : w.prints?.length
      ? `${t('lbl.from')} ${fmt(Math.min(...w.prints.map((p) => p.price)))}`
      : t('lbl.sold');
  const medium = L(w.medium);
  const size = `${w.w} × ${w.h} cm`;
  const caption = L(w.caption);
  const days = site.commerce?.deliveryDays?.original ?? 10;
  const c = site.commerce || {};
  const vat =
    c.kleinunternehmer || site.legal?.kleinunternehmerNote
      ? t('price.klein')
      : t('price.incl', {vo: c.vatOriginals ?? '', vp: c.vatPrints ?? ''});

  async function share() {
    const url = `${location.origin}${location.pathname}#work/${encodeURIComponent(w!.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({body: t('work.shared'), uniqueID: 'share'});
    } catch {
      window.prompt(t('work.share'), url);
    }
  }

  return (
    <Sheet title={w.title} subtitle={[w.year, medium, size].filter(Boolean).join(' · ')} width={1080} onClose={close}>
      <div className="ws">
        <div className="ws-media">
          {current ? (
            <button
              type="button"
              className="ws-main"
              aria-label={t('work.zoom', {title: w.title})}
              onClick={() => open({type: 'photo', id: w.id, index})}>
              <img
                key={current}
                src={safeUrl(current)}
                srcSet={w._preview ? undefined : srcSet(w, current)}
                sizes="(min-width: 900px) 560px, 92vw"
                alt={index === 0 ? L(w.alt) || w.title : `${w.title}. ${t('work.photo', {n: index + 1, total: pics.length})}`}
                decoding="async"
              />
            </button>
          ) : (
            <div className="ws-main">
              <Placeholder work={w} label={`${w.title}, ${t('lbl.placeholder')}`} />
            </div>
          )}
          {pics.length > 1 && (
            <div className="ws-thumbs" role="group" aria-label={t('work.photos')}>
              {pics.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-pressed={i === index}
                  aria-label={t('work.photo', {n: i + 1, total: pics.length})}
                  onClick={() => setIndex(i)}>
                  <img src={safeUrl(small(w, src))} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ws-info">
          <div className="ws-price">
            <Text as="div" className="ws-amount" hasTabularNumbers>
              {price}
            </Text>
            <Badge variant={available ? 'neutral' : 'gray'} label={available ? t('lbl.available') : t('lbl.sold')} />
          </div>
          {caption && (
            <Text as="p" className="ws-cap">
              {caption}
            </Text>
          )}
          <MetadataList label={{position: 'start', width: 96}}>
            {w.year && <MetadataListItem label={t('work.year')}>{w.year}</MetadataListItem>}
            {medium && <MetadataListItem label={t('work.medium')}>{medium}</MetadataListItem>}
            <MetadataListItem label={t('work.size')}>{size}</MetadataListItem>
            <MetadataListItem label={t('work.status')}>
              {w.original ? t('work.unique') : t('lbl.print')}
            </MetadataListItem>
          </MetadataList>

          <figure className="ws-scale">
            <WallScale work={w} label={t('work.scaleAlt', {title: w.title, w: w.w, h: w.h})} />
            <figcaption>
              <b>{t('work.scale')}.</b> {t('work.scaleNote')}
            </figcaption>
          </figure>

          <div>
            <Heading level={3} className="ws-h">
              {t('work.included')}
            </Heading>
            <ul className="ws-inc">
              <li>{t('work.inc.certificate')}</li>
              <li>{t('work.inc.shipping')}</li>
              <li>{t('work.inc.withdrawal', {d: withdrawalDays})}</li>
            </ul>
          </div>

          <div className="ws-actions">
            <BuyControls work={w} />
            <Button
              label={t('work.ask')}
              variant="secondary"
              onClick={() => open({type: 'contact', subject: t('cform.subject.work', {title: w.title})})}
            />
            <Button label={t('work.share')} variant="ghost" onClick={share} />
          </div>
          <Text as="p" type="supporting" className="ws-terms">
            {available ? `${t('work.delivery', {d: days})} ` : ''}
            {vat}
          </Text>
        </div>
      </div>
    </Sheet>
  );
}

/** The work drawn to scale on a wall, beside a person 175 cm tall. Its centre
    hangs at 150 cm, roughly eye level. A drawing, not a photograph: only the
    proportions are meant. */
function WallScale({work: w, label}: {work: Work; label: string}) {
  const floor = 215;
  const wallW = Math.max(300, w.w + 190);
  const cx = 150 + Math.max(0, w.w - 110) / 2 + 55;
  const cy = floor - 150;
  const top = floor - 175;
  return (
    <svg viewBox={`0 0 ${wallW} 230`} role="img" aria-label={label} className="ws-wall">
      <line x1="0" y1={floor} x2={wallW} y2={floor} className="ws-floor" />
      {/* the person: head, shoulders, body */}
      <g className="ws-person">
        <circle cx="52" cy={top + 11} r="11" />
        <path d={`M30 ${floor} L30 ${top + 58} Q30 ${top + 27} 52 ${top + 27} Q74 ${top + 27} 74 ${top + 58} L74 ${floor} Z`} />
      </g>
      <rect x={cx - w.w / 2} y={cy - w.h / 2} width={w.w} height={w.h} className="ws-piece" />
      <text x={cx} y={cy + w.h / 2 + 14} textAnchor="middle" className="ws-dim">
        {w.w} × {w.h} cm
      </text>
      <text x="52" y={floor + 12} textAnchor="middle" className="ws-dim">
        175 cm
      </text>
    </svg>
  );
}
