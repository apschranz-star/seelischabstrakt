/* Work photos. tools/bilder.py writes WebP copies 600, 1000 and 1600 pixels
   wide next to each JPEG and marks the work (webp, webpImages). A photo
   without copies, such as one just added through the studio desk, is served
   as the JPEG it is. */
import type {Work} from './types';

const stem = (src: string) => src.replace(/\.(jpe?g|png)$/i, '');
const hasCopies = (w: Work, src: string) =>
  /\.(jpe?g|png)$/i.test(src) && (src === w.img ? w.webp === true : w.webpImages === true);

export function photos(w: Work): string[] {
  return [w._preview || w.img, ...(w.images || [])].filter((s): s is string => !!s);
}

export function srcSet(w: Work, src: string): string | undefined {
  if (!hasCopies(w, src)) return undefined;
  const s = stem(src);
  return `${s}-600.webp 600w, ${s}-1000.webp 1000w, ${s}-1600.webp 1600w`;
}

export function small(w: Work, src: string): string {
  return hasCopies(w, src) ? `${stem(src)}-600.webp` : src;
}

export function large(w: Work, src: string): string {
  return hasCopies(w, src) ? `${stem(src)}-1600.webp` : src;
}
