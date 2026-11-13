/* The shop's shared state: content (site.json, works.json), language, and the
   small helpers every component needs to turn content into text. */
import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {STRINGS} from './strings';
import {applyTheme} from './theme';
import type {Bi, Lang, SectionKey, Site, Work} from './types';

export interface ShopData {
  site: Site;
  works: Work[];
}

export interface Shop extends ShopData {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** interface string, with {name} placeholders filled from vars */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** bilingual content field in the current language */
  L: (value?: Bi | null) => string;
  /** price in the shop currency */
  fmt: (amount: number) => string;
  hidden: (section: SectionKey) => boolean;
  /** theme.layout.comingSoon: nothing is for sale yet */
  soon: boolean;
  /** the order form can be used (a payment link is configured) */
  orderable: boolean;
  withdrawalDays: number;
  email: string;
}

const Ctx = createContext<Shop | null>(null);

export function useShop(): Shop {
  const shop = useContext(Ctx);
  if (!shop) throw new Error('useShop outside ShopProvider');
  return shop;
}

export async function loadShop(): Promise<ShopData> {
  const bust = '?v=' + Date.now();
  const get = async (file: string) => {
    const r = await fetch(file + bust);
    if (!r.ok) throw new Error(`${file}: HTTP ${r.status}`);
    return r.json();
  };
  const [site, works] = await Promise.all([get('site.json'), get('works.json')]);
  return {site: site as Site, works: ((works as {works?: Work[]}).works || []) as Work[]};
}

export function initialLang(site: Site): Lang {
  const pick = (v: string | null | undefined): Lang | null => (v === 'de' || v === 'en' ? v : null);
  const fromUrl = pick(new URLSearchParams(location.search).get('lang'));
  let stored: Lang | null = null;
  try {
    stored = pick(localStorage.getItem('sa-lang'));
  } catch {
    /* private mode: the choice simply does not persist */
  }
  const fromBrowser = (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : null;
  return fromUrl || stored || fromBrowser || pick(site.brand?.defaultLang) || 'en';
}

export function ShopProvider({initial, children}: {initial: ShopData; children: ReactNode}) {
  const [data, setData] = useState<ShopData>(initial);
  const [lang, setLangState] = useState<Lang>(() => initialLang(initial.site));

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem('sa-lang', next);
    } catch {
      /* see initialLang */
    }
  }, []);

  /* Live preview from the studio desk. Only from the same address: this message
     swaps content, payment link and look of the page; without the origin check
     any page that framed the shop could hand a buyer its own payment link.
     Two files side by side on disk (file://) have no address at all. */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (location.protocol !== 'file:' && e.origin !== window.location.origin) return;
      const d = e.data as {type?: string; site?: Site; works?: Work[]; lang?: Lang} | null;
      if (!d || d.type !== 'sa-preview' || !d.site) return;
      setData({site: d.site, works: d.works || []});
      if (d.lang === 'de' || d.lang === 'en') setLangState(d.lang);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    applyTheme(data.site);
  }, [data.site]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = data.site.brand?.name || 'seelischabstrakt';
  }, [lang, data.site]);

  const shop = useMemo<Shop>(() => {
    const {site, works} = data;
    const overrides = site.texts?.ui || {};
    const table: Record<string, string> = {...STRINGS.en, ...STRINGS[lang], ...(overrides[lang] || {})};
    const t: Shop['t'] = (key, vars) => {
      let s = table[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
      return s;
    };
    const L: Shop['L'] = (value) => (value && (value[lang] || value.en || value.de)) || '';
    const currency = site.commerce?.currency || 'EUR';
    const number = new Intl.NumberFormat(lang === 'de' ? 'de-AT' : 'en-IE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
    const hide = new Set(site.theme?.layout?.hideSections || []);
    return {
      site,
      works,
      lang,
      setLang,
      t,
      L,
      fmt: (n) => number.format(n),
      hidden: (section) => hide.has(section),
      soon: site.theme?.layout?.comingSoon === true,
      orderable: site.commerce?.payment?.method === 'revolut' && !!site.commerce.payment.revolutLink,
      withdrawalDays: Number(site.legal?.returnsDaysPrints) || 14,
      email: site.legal?.email || site.brand?.email || '',
    };
  }, [data, lang, setLang]);

  return <Ctx.Provider value={shop}>{children}</Ctx.Provider>;
}

/** A link written into site.json or works.json may only be http, https, mailto
    or a path inside this site. Anything else becomes no link at all. */
export function safeUrl(u: unknown): string {
  const v = String(u == null ? '' : u).trim();
  if (!v) return '';
  if (/^(https?:|mailto:)/i.test(v)) return v;
  if (/^[./#?]/.test(v) || /^[\w.-]+[/?#]/.test(v) || /^[\w./-]+\.(jpe?g|png|webp|svg|gif|pdf)$/i.test(v)) return v;
  if (/^(data:image\/|blob:)/i.test(v)) return v;
  return '';
}

/** aboutLead is the one content field where simple formatting is allowed on
    purpose: <b>, <strong>, <i>, <em> and <br>. Everything else stays text. */
export function richText(html: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /<(\/?)(b|strong|i|em|br)\s*\/?>/gi;
  const stack: {tag: string; children: ReactNode[]}[] = [{tag: '', children: out}];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  const push = (node: ReactNode) => stack[stack.length - 1].children.push(node);
  while ((m = re.exec(html))) {
    if (m.index > last) push(html.slice(last, m.index));
    last = re.lastIndex;
    const tag = m[2].toLowerCase();
    if (tag === 'br') push(<br key={key++} />);
    else if (!m[1]) stack.push({tag, children: []});
    else if (stack.length > 1 && stack[stack.length - 1].tag === tag) {
      const done = stack.pop()!;
      const strong = tag === 'b' || tag === 'strong';
      push(strong ? <b key={key++}>{done.children}</b> : <i key={key++}>{done.children}</i>);
    }
  }
  if (last < html.length) push(html.slice(last));
  while (stack.length > 1) {
    const open = stack.pop()!;
    stack[stack.length - 1].children.push(...open.children);
  }
  return out;
}
