/* The EU's harmonised notice on the legal guarantee of conformity
   (Implementing Regulation (EU) 2025/1960, Annex I). The files in legal/ are
   the Commission's own, in colour as it requires for online shops, and are
   shown as they are: the notice may not be altered. A shop has to show it in
   each language it is offered in, so there is a German and an English one. */
import type {Lang} from './types';

export interface NoticeFiles {
  /** small preview for the page */
  preview: string;
  /** the Commission's vector file, for the full view */
  full: string;
  /** a PNG to download or to attach to the order confirmation */
  file: string;
}

export function noticeFiles(lang: Lang): NoticeFiles {
  const stem = lang === 'de' ? 'legal/eu-gewaehrleistung-mitteilung-de' : 'legal/eu-legal-guarantee-notice-en';
  return {preview: `${stem}-560.webp`, full: `${stem}.svg`, file: `${stem}.png`};
}
