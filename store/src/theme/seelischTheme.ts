/**
 * The seelischabstrakt theme for Astryx.
 *
 * Two contexts, mapped onto Astryx's two colour modes:
 *   dark  = on the carpet (the page itself): cream type on the red ground
 *   light = on paper (labels, cards, dialogs, sheets): ink on cream paper
 *
 * Colours and fonts are not written here as values. They point at the shop's
 * own custom properties (--ground, --paper, --frame, --mat, --ink, --accent,
 * --f-display ...), which the page sets from site.json at runtime. That keeps
 * the presets and the colour fields of the studio desk working: change a
 * colour there and every Astryx component follows.
 *
 * After editing: npm run theme (writes seelisch.css, seelisch.js, .d.ts).
 */
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const mix = (a: string, pct: number, b = 'transparent') =>
  `color-mix(in srgb, ${a} ${pct}%, ${b})`;

const INK = 'var(--ink)';
const PAPER_INK = 'var(--paper-ink)';
const PAPER = 'var(--paper)';
const GROUND = 'var(--ground)';
const FRAME = 'var(--frame)';
const MAT = 'var(--mat)';
const ACCENT = 'var(--accent)';
const MONO = 'var(--font-family-code)';

export const seelischTheme = defineTheme({
  name: 'seelisch',
  extends: neutralTheme,

  typography: {
    scale: {base: 16, ratio: 1.2},
    body: {family: 'Source Serif 4', fallbacks: 'Georgia, "Times New Roman", serif'},
    heading: {
      family: 'Bricolage Grotesque',
      fallbacks: '"Arial Narrow", Impact, sans-serif',
      weight: 'bold',
    },
    code: {family: 'Courier Prime', fallbacks: '"Courier New", monospace'},
  },

  // Square corners everywhere: frames, labels and sheets are cut, not rounded.
  radius: {base: 4, multiplier: 0},

  motion: {tempo: 1, character: 'crisp'},

  tokens: {
    '--font-family-body': 'var(--f-body)',
    '--font-family-heading': 'var(--f-display)',
    '--font-family-code': 'var(--f-mono)',

    '--color-accent': FRAME,
    '--color-on-accent': MAT,
    '--color-accent-muted': [mix(PAPER_INK, 12), mix(INK, 18)],
    '--color-neutral': [mix(PAPER_INK, 9), mix(INK, 14)],

    '--color-background-body': [PAPER, GROUND],
    '--color-background-surface': [PAPER, 'var(--section2)'],
    '--color-background-card': [PAPER, 'var(--section2)'],
    '--color-background-popover': [PAPER, 'var(--section2)'],
    '--color-background-muted': [mix(PAPER_INK, 6), mix(FRAME, 38)],
    '--color-background-inverted': [FRAME, MAT],

    '--color-text-primary': [PAPER_INK, INK],
    '--color-text-secondary': [mix(PAPER_INK, 78, PAPER), 'var(--ink-2)'],
    '--color-text-disabled': [mix(PAPER_INK, 48, PAPER), mix(INK, 58, GROUND)],
    '--color-text-accent': [PAPER_INK, INK],
    '--color-on-dark': MAT,
    '--color-on-light': FRAME,

    '--color-icon-primary': [PAPER_INK, INK],
    '--color-icon-secondary': [mix(PAPER_INK, 78, PAPER), 'var(--ink-2)'],
    '--color-icon-disabled': [mix(PAPER_INK, 48, PAPER), mix(INK, 58, GROUND)],
    '--color-icon-accent': [PAPER_INK, ACCENT],

    '--color-border': [mix(PAPER_INK, 24), mix(INK, 30)],
    '--color-border-emphasized': [mix(PAPER_INK, 64, PAPER), mix(INK, 66, GROUND)],
    '--color-skeleton': [mix(PAPER_INK, 14), mix(INK, 18)],
    '--color-track': [mix(PAPER_INK, 22), mix(INK, 28)],

    '--color-overlay': 'rgba(10, 6, 6, 0.74)',
    '--color-overlay-hover': [mix(PAPER_INK, 7), mix(INK, 10)],
    '--color-overlay-pressed': [mix(PAPER_INK, 13), mix(INK, 17)],
    '--color-tint-hover': ['black', 'white'],
    '--color-shadow': 'rgba(0, 0, 0, 0.45)',

    // Status colours have to read on paper and on the red ground.
    '--color-error': ['#9C1418', '#F0D9CF'],
    '--color-on-error': ['#FFF6EE', '#3A0708'],
    '--color-error-muted': [mix('#9C1418', 12), mix('#0D0A0A', 55)],
    '--color-text-red': ['#8A1216', '#FFD9CF'],
    '--color-success': ['#1F5B2C', '#D6EBC8'],
    '--color-on-success': ['#F4FFEF', '#14301A'],
    '--color-success-muted': [mix('#1F5B2C', 12), mix('#0D0A0A', 55)],
    '--color-text-green': ['#1B4F27', '#DDF1CF'],
    '--color-warning': [ACCENT, ACCENT],
    '--color-on-warning': FRAME,
    '--color-warning-muted': [mix('#F2B429', 26), mix('#0D0A0A', 55)],
    '--color-text-yellow': ['#6B4A05', '#F7D27A'],
    '--color-info': [FRAME, MAT],
    '--color-on-info': [MAT, FRAME],
    '--color-info-muted': [mix(PAPER_INK, 8), mix('#0D0A0A', 55)],
    '--color-text-blue': [PAPER_INK, INK],

    /* Controls sized for a finger: the shop is mostly visited on a phone. */
    '--size-element-sm': '36px',
    '--size-element-md': '44px',
    '--size-element-lg': '52px',

    '--focus-outline-color': [PAPER_INK, ACCENT],
    '--focus-outline-width': '2px',
    '--focus-outline-offset': '3px',

    '--shadow-low': '0 1px 0 rgba(0, 0, 0, 0.3)',
    '--shadow-med': '0 2px 0 rgba(0, 0, 0, 0.35), 0 18px 34px -18px rgba(0, 0, 0, 0.7)',
    '--shadow-high': '0 2px 0 rgba(0, 0, 0, 0.35), 0 26px 50px -20px rgba(0, 0, 0, 0.75)',
  },

  components: {
    button: {
      base: {
        fontFamily: MONO,
        fontWeight: '700',
        letterSpacing: '0.03em',
      },
      'variant:secondary': {
        backgroundColor: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-emphasized)',
      },
      'size:sm': {fontSize: '12px'},
    },
    /* Filter and language switch: a row of cut labels. The chosen one is
       inverted, like the logo box in the header. */
    'segmented-control': {
      base: {
        backgroundColor: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-emphasized)',
      },
    },
    'segmented-control-item': {
      base: {
        fontFamily: MONO,
        fontWeight: '700',
        fontSize: '12px',
        letterSpacing: '0.06em',
      },
      selected: {
        backgroundColor: 'var(--color-background-inverted)',
        color: `light-dark(${MAT}, ${FRAME})`,
      },
    },
    /* The tag on a frame: ORIGINAL, SOLD. */
    badge: {
      base: {
        fontFamily: MONO,
        fontWeight: '700',
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderRadius: '0',
      },
      'variant:neutral': {backgroundColor: MAT, color: FRAME},
      'variant:gray': {backgroundColor: FRAME, color: MAT},
    },
    dialog: {
      base: {
        borderWidth: '8px',
        borderStyle: 'solid',
        borderColor: FRAME,
        boxShadow: 'var(--shadow-high)',
      },
    },
    drawer: {
      base: {
        backgroundColor: FRAME,
        color: MAT,
      },
    },
    'field-label': {
      base: {
        fontFamily: MONO,
        letterSpacing: '0.02em',
      },
    },
    'checkbox-label': {
      base: {
        fontFamily: 'var(--font-family-body)',
        letterSpacing: '0',
      },
    },
    'text-input': {
      base: {backgroundColor: 'light-dark(#ffffff, rgba(13, 10, 10, 0.35))'},
    },
    'text-area': {
      base: {backgroundColor: 'light-dark(#ffffff, rgba(13, 10, 10, 0.35))'},
    },
    toast: {
      base: {fontFamily: MONO},
    },
    link: {
      base: {textUnderlineOffset: '3px'},
    },
  },
});
