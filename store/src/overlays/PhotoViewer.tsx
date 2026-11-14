/* A photo of a work at full size, with zoom. Closing it leads back to the work. */
import {Lightbox} from '@astryxdesign/core/Lightbox';
import {large, photos} from '../lib/images';
import {safeUrl, useShop} from '../lib/shop';
import {useUi} from '../lib/ui';

export function PhotoViewer({id, index}: {id: string; index: number}) {
  const {works, t, L} = useShop();
  const {open, close} = useUi();
  const w = works.find((x) => x.id === id);
  if (!w) return null;
  const pics = photos(w);
  const media = pics.map((src, i) => ({
    src: safeUrl(w._preview && i === 0 ? src : large(w, src)),
    alt: i === 0 ? L(w.alt) || w.title : `${w.title}. ${t('work.photo', {n: i + 1, total: pics.length})}`,
    caption: `${w.title} · ${[w.year, L(w.medium), `${w.w} × ${w.h} cm`].filter(Boolean).join(' · ')}`,
  }));
  return (
    <Lightbox
      isOpen
      media={media}
      index={Math.min(index, media.length - 1)}
      onIndexChange={(i) => open({type: 'photo', id, index: i})}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (w) open({type: 'work', id, index});
          else close();
        }
      }}
      hasZoom
    />
  );
}
