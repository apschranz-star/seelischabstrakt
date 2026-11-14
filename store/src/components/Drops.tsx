/* Storefront tiles under the wordmark: big pictures with floating type, built
   from works.json and the studio portrait. Nothing in them is typed in by
   hand: counts, the lowest price and the years come from the works. */
import type {CSSProperties} from 'react';
import {small, srcSet} from '../lib/images';
import {safeUrl, useShop} from '../lib/shop';
import type {Work} from '../lib/types';

interface Tile {
  href: string;
  title: string;
  sub?: string;
  img?: {src: string; srcSet?: string; p?: string};
  mosaic?: string[];
  half?: boolean;
  mono?: boolean;
}

export function Drops() {
  const {site, works, t, L, fmt, hidden, soon} = useShop();
  const layout = site.theme?.layout || {};
  if (layout.drops === false) return null;

  const live: Work[] = soon ? [] : works.filter((w) => w._preview || w.img);
  const avail = live.filter((w) => w.original?.available);
  const tiles: Tile[] = [];
  const pic = (w: Work) => w._preview || w.img!;

  const lead = avail[0] || live[0];
  if (lead) {
    const min = avail.length ? Math.min(...avail.map((w) => w.original!.price)) : 0;
    tiles.push({
      href: '#works',
      img: {src: pic(lead), srcSet: w_srcset(lead)},
      title: avail.length ? t('drop.originals') : t('works.title'),
      sub: !avail.length
        ? ''
        : avail.length === 1
          ? t('drop.one', {p: fmt(min)})
          : t('drop.count', {n: avail.length, p: fmt(min)}),
    });
  }

  const pics = live.flatMap((w) => [pic(w), ...(w.images || [])].map((src) => small(w, src)));
  if (pics.length >= 3) {
    const years = live.map((w) => w.year).filter((y): y is number => !!y);
    const y0 = Math.min(...years);
    const y1 = Math.max(...years);
    const motif = (L(site.texts?.aboutLead).match(/<b>(.*?)<\/b>/i) || [])[1];
    tiles.push({
      href: '#works',
      mosaic: pics,
      title: t('drop.new', {y: years.length ? (y0 === y1 ? y0 : `${y0}–${y1}`) : ''}),
      sub: motif ? motif.replace(/[.\s]+$/, '') : L(site.texts?.worksKicker),
    });
  }

  const halves: Tile[] = [];
  const portrait = safeUrl(site.texts?.aboutImage?.src);
  if (portrait && !hidden('about'))
    halves.push({
      href: '#about',
      img: {src: portrait, p: '50% 26%'},
      mono: true,
      title: t('drop.studio'),
      sub: [site.brand.artist, site.brand.city].filter(Boolean).join(' · '),
    });
  const last = live.length > 1 ? live[live.length - 1] : null;
  if (last && !hidden('commission')) {
    const src = (last.images || []).slice(-1)[0] || pic(last);
    halves.push({href: '#commission', img: {src: small(last, src)}, title: t('drop.comm'), sub: t('drop.commSub')});
  }
  halves.forEach((h) => {
    h.half = halves.length === 2;
    tiles.push(h);
  });

  if (!tiles.length) return null;
  return (
    <section className="drops" aria-label={t('drops.label')}>
      {tiles.map((d, i) => (
        <a
          key={i}
          className={`drop reveal${d.half ? ' half' : ''}${d.mono ? ' mono' : ''}`}
          href={d.href}
          style={{'--d': `${d.half && i % 2 === 0 ? 120 : 0}ms`} as CSSProperties}>
          {d.mosaic ? (
            <span className="mosaic" aria-hidden="true">
              {Array.from({length: 18}, (_, k) => (
                <i key={k}>
                  <img
                    src={safeUrl(d.mosaic![k % d.mosaic!.length])}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={
                      {
                        '--z': (1.25 + ((k * 7) % 5) * 0.3).toFixed(2),
                        '--p': `${(k * 37 + 15) % 100}% ${(k * 53 + 25) % 100}%`,
                      } as CSSProperties
                    }
                  />
                </i>
              ))}
            </span>
          ) : (
            d.img && (
              <img
                src={safeUrl(d.img.src)}
                srcSet={d.img.srcSet}
                sizes={d.img.srcSet ? '100vw' : undefined}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={d.img.p ? ({'--p': d.img.p} as CSSProperties) : undefined}
              />
            )
          )}
          <span className="cap">
            <b>
              {d.title.split('|').map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
            </b>
            {d.sub && <small>{d.sub}</small>}
          </span>
        </a>
      ))}
    </section>
  );
}

function w_srcset(w: Work): string | undefined {
  return w.img && !w._preview ? srcSet(w, w.img) : undefined;
}
