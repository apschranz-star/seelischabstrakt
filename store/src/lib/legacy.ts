/* For browsers that are too old for Astryx.
   The component styles need light-dark() and @scope: Safari 17.5, Chrome 123,
   Firefox 128. Below that the shop would show unstyled controls, which is
   worse than showing less. This page is plain DOM and plain CSS: the works
   with their prices, a way to ask for one by email, and the seller's details.
   It takes no orders; the visitor is told to update the browser or to write. */
import type {Bi, Site, Work} from './types';

export function supportsShop(): boolean {
  try {
    return CSS.supports('color', 'light-dark(red, blue)') && 'CSSScopeRule' in window;
  } catch {
    return false;
  }
}

export function renderLegacy(site: Site, works: Work[]): void {
  const de = (navigator.language || '').toLowerCase().startsWith('de');
  const L = (v?: Bi) => (v && (de ? v.de || v.en : v.en || v.de)) || '';
  const g = site.legal || {};
  const email = g.email || site.brand?.email || '';
  const name = g.legalName || site.brand?.artist || '';
  const eur = new Intl.NumberFormat(de ? 'de-AT' : 'en-GB', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0});

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = ''): HTMLElementTagNameMap[K] => {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  };
  const mail = (subject: string, label: string) => {
    const a = el('a', label);
    a.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    return a;
  };

  const page = el('main', '', 'legacy');
  page.id = 'top';
  page.append(el('h1', site.brand?.name || 'seelischabstrakt'));
  page.append(
    el(
      'p',
      de
        ? 'Dein Browser ist für diese Seite zu alt, deshalb gibt es hier nur die Liste der Werke. Mit einem aktuellen Browser (Safari 17.5, Chrome 123, Firefox 128 oder neuer) öffnet sich der volle Shop mit Bestellung. Bis dahin: Schreib mir eine E-Mail, ich antworte persönlich.'
        : 'Your browser is too old for this page, so only the list of works is shown here. In a current browser (Safari 17.5, Chrome 123, Firefox 128 or newer) the full shop opens, with ordering. Until then: write me an email and I answer in person.',
    ),
  );

  const list = el('ul', '', 'legacy-works');
  for (const w of works) {
    const li = el('li');
    const sold = w.original ? !w.original.available : false;
    const price = w.original && !sold ? eur.format(w.original.price) : de ? 'vergeben' : 'sold';
    li.append(el('strong', w.title), el('span', ` · ${[w.year, L(w.medium), `${w.w} × ${w.h} cm`].filter(Boolean).join(' · ')} · ${price} `));
    if (email && !sold) li.append(mail(de ? `Anfrage: ${w.title}` : `Enquiry: ${w.title}`, de ? 'Per E-Mail anfragen' : 'Ask by email'));
    list.append(li);
  }
  page.append(list);

  const foot = el('footer', '', 'legacy-foot');
  const lines = [
    de ? 'Medieninhaber und Verkäufer:' : 'Media owner and seller:',
    [[name, g.tradeName ? `(${g.tradeName})` : ''].filter(Boolean).join(' '), g.street, g.zipCity, de ? g.country : g.country === 'Österreich' ? 'Austria' : g.country].filter(Boolean).join(', '),
    g.phone ? (de ? 'Tel.: ' : 'Phone: ') + g.phone : '',
  ].filter(Boolean);
  foot.append(el('p', lines.join(' ')));
  if (email) {
    const p = el('p');
    p.append(de ? 'E-Mail: ' : 'Email: ', mail('', email));
    foot.append(p);
  }
  foot.append(
    el(
      'p',
      de
        ? 'Allgemeine Geschäftsbedingungen, Widerrufsbelehrung und Datenschutzerklärung stehen im vollen Shop und werden mit jeder Bestätigung per E-Mail mitgeschickt.'
        : 'Terms of sale, the withdrawal notice and the privacy policy are in the full shop and are sent with every confirmation by email.',
    ),
  );
  page.append(foot);
  document.getElementById('root')?.replaceChildren(page);
}
