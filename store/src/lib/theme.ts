/* Look of the page from site.json: colours, ground pattern, fonts and the
   layout switches. The studio desk (admin.html) holds the same presets; the
   two lists have to stay equal.

   Everything lands in custom properties on <html>. The shop's own styles and
   the Astryx theme (src/theme/seelischTheme.ts) both read from there, so a
   colour changed in the desk reaches every component. */
import type {Site, ThemeColors} from './types';

export const PRESETS: Record<string, {colors: Required<ThemeColors>; pattern: 'gul' | 'paisley' | 'none'}> = {
  carpet: {
    colors: {
      ground: '#8C1D1D', groundLine: '#3A0708', groundDot: '#5C0F10', section2: '#1A1210', section2Line: '#3B2118',
      frame: '#0D0A0A', mat: '#EFE7D8', ink: '#F3EBDE', ink2: '#E2CDBF', mute: '#E3C2B8', paper: '#F1EBE0',
      paperInk: '#171212', accent: '#F2B429',
    },
    pattern: 'gul',
  },
  shawl: {
    colors: {
      ground: '#1A1210', groundLine: '#3B2118', groundDot: '#7A1B1B', section2: '#8C1D1D', section2Line: '#3A0708',
      frame: '#0D0A0A', mat: '#EFE7D8', ink: '#F3EBDE', ink2: '#D9C9B8', mute: '#9E8578', paper: '#F1EBE0',
      paperInk: '#171212', accent: '#F2B429',
    },
    pattern: 'paisley',
  },
  paper: {
    colors: {
      ground: '#EFE9DD', groundLine: '#D9D0C0', groundDot: '#C9BFAE', section2: '#1A1210', section2Line: '#3B2118',
      frame: '#151010', mat: '#FBF8F2', ink: '#1B1614', ink2: '#3F3530', mute: '#7A6C63', paper: '#FFFFFF',
      paperInk: '#171212', accent: '#8C1D1D',
    },
    pattern: 'none',
  },
  gallery: {
    colors: {
      ground: '#141416', groundLine: '#222226', groundDot: '#2B2B30', section2: '#0D0D0F', section2Line: '#26262B',
      frame: '#050505', mat: '#F2F0EB', ink: '#F2F0EB', ink2: '#C9C6BF', mute: '#8A877F', paper: '#F5F3EE',
      paperInk: '#131315', accent: '#F2B429',
    },
    pattern: 'none',
  },
};

const VARS: Record<keyof ThemeColors, string> = {
  ground: '--ground', groundLine: '--ground-line', groundDot: '--ground-dot', section2: '--section2',
  section2Line: '--section2-line', frame: '--frame', mat: '--mat', ink: '--ink', ink2: '--ink-2', mute: '--mute',
  paper: '--paper', paperInk: '--paper-ink', accent: '--accent',
};

const enc = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

function patternSvg(kind: string | undefined, c: ThemeColors): [string, string] {
  if (kind === 'gul')
    return [
      enc(
        `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='200' viewBox='0 0 160 200'><rect width='160' height='200' fill='${c.ground}'/><g fill='none' stroke='${c.groundLine}' stroke-width='2.2' opacity='.55'><path d='M80 18 L128 60 L128 140 L80 182 L32 140 L32 60 Z'/><path d='M80 44 L108 68 L108 132 L80 156 L52 132 L52 68 Z'/><path d='M80 70 L92 82 L92 118 L80 130 L68 118 L68 82 Z'/><path d='M0 100 H32 M128 100 H160 M80 0 V18 M80 182 V200'/><path d='M0 0 L16 16 M160 0 L144 16 M0 200 L16 184 M160 200 L144 184'/></g><g fill='${c.groundDot}' opacity='.55'><circle cx='80' cy='100' r='5'/><circle cx='16' cy='100' r='3'/><circle cx='144' cy='100' r='3'/><rect x='72' y='0' width='16' height='6'/><rect x='72' y='194' width='16' height='6'/></g></svg>`,
      ),
      '160px 200px',
    ];
  if (kind === 'paisley')
    return [
      enc(
        `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><rect width='140' height='140' fill='${c.ground}'/><g fill='none' stroke='${c.groundLine}' stroke-width='1.6' opacity='.9'><path d='M70 14c26 0 40 20 40 42 0 30-30 40-30 62 0-22-30-32-30-62 0-22 14-42 20-42z'/><path d='M70 28c16 0 26 14 26 30 0 22-20 28-20 44 0-16-20-22-20-44 0-16 8-30 14-30z'/><path d='M0 70c20-10 30-30 30-50M140 70c-20-10-30-30-30-50M0 70c20 10 30 30 30 50M140 70c-20 10-30 30-30 50'/></g><g fill='${c.groundDot}' opacity='.5'><circle cx='70' cy='60' r='4'/><circle cx='8' cy='8' r='2.5'/><circle cx='132' cy='8' r='2.5'/><circle cx='8' cy='132' r='2.5'/><circle cx='132' cy='132' r='2.5'/></g></svg>`,
      ),
      '140px 140px',
    ];
  return ['none', 'auto'];
}

/** Relative luminance of a hex colour, 0 (black) to 1 (white). */
export function luminance(hex: string | undefined): number {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return 0;
  const h = m[1].length === 3 ? m[1].replace(/./g, (x) => x + x) : m[1];
  const lin = (i: number) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(0) + 0.7152 * lin(2) + 0.0722 * lin(4);
}

export function resolveColors(site: Site): Required<ThemeColors> {
  const th = site.theme || {};
  const preset = PRESETS[th.preset || ''];
  return {...PRESETS.carpet.colors, ...(preset ? preset.colors : {}), ...(th.preset === 'custom' ? th.colors : {})};
}

export function applyTheme(site: Site): void {
  const th = site.theme || {};
  const preset = PRESETS[th.preset || ''];
  const c = resolveColors(site);
  const pattern = th.preset === 'custom' ? th.pattern : preset ? preset.pattern : 'none';
  const r = document.documentElement.style;

  (Object.keys(VARS) as (keyof ThemeColors)[]).forEach((k) => {
    if (c[k]) r.setProperty(VARS[k], c[k]);
  });

  const [p1, s1] = patternSvg(pattern, c);
  r.setProperty('--pattern', p1);
  r.setProperty('--pattern-size', s1);
  if (th.preset === 'custom' && th.patternSvg) {
    const src = th.patternSvg.trim();
    r.setProperty('--pattern', src.startsWith('<') ? enc(src) : `url("${src}")`);
    r.setProperty('--pattern-size', th.patternSize || 'auto');
  }

  let cs = document.getElementById('custom-css');
  if (!cs) {
    cs = document.createElement('style');
    cs.id = 'custom-css';
    document.head.appendChild(cs);
  }
  cs.textContent = th.customCss || '';

  const second = pattern === 'gul' ? 'paisley' : pattern === 'paisley' ? 'gul' : 'none';
  const [p2, s2] = patternSvg(second, {ground: c.section2, groundLine: c.section2Line, groundDot: c.groundDot});
  r.setProperty('--pattern2', p2);
  r.setProperty('--pattern2-size', s2);

  /* The fonts are self-hosted in fonts/. A theme that names another family gets
     the system fallback; nothing is fetched from elsewhere. */
  const f = th.fonts || {};
  if (f.display) r.setProperty('--f-display', `"${f.display}","Arial Narrow",Impact,sans-serif`);
  if (f.body) r.setProperty('--f-body', `"${f.body}",Georgia,serif`);
  if (f.mono) r.setProperty('--f-mono', `"${f.mono}","Courier New",monospace`);

  const lay = th.layout || {};
  const b = document.body.dataset;
  b.hero = lay.heroStyle || 'split';
  b.density = lay.gridDensity || 'normal';
  b.works = lay.worksLayout || 'grid';
  b.reveal = lay.reveal === false ? 'off' : 'on';
  /* For styles that have to know whether the ground itself is light or dark. */
  b.ground = luminance(c.ground) > 0.4 ? 'light' : 'dark';

  /* The browser chrome takes the colour of the topmost band of the page: the
     yellow ticker, or the black header when the ticker is switched off. */
  const meta = document.querySelector('meta[name="theme-color"]');
  const ticker = !(lay.hideSections || []).includes('trust');
  if (meta) meta.setAttribute('content', ticker ? c.accent : c.frame);
}
