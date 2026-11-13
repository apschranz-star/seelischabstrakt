/* Shapes of site.json and works.json. Both files are edited by the studio desk
   (admin.html) and read by the shop at runtime, so every field is optional in
   practice: the shop has to keep rendering when one is missing. */

export type Lang = 'en' | 'de';
export type Bi = Partial<Record<Lang, string>>;

export interface PrintOffer {
  size: string;
  price: number;
  link?: string;
}

export interface Work {
  id: string;
  title: string;
  year?: number;
  medium?: Bi;
  w: number;
  h: number;
  seed?: number;
  style?: string;
  size?: '' | 'wide' | 'small';
  tilt?: number;
  nomat?: boolean;
  img?: string;
  images?: string[];
  webp?: boolean;
  webpImages?: boolean;
  alt?: Bi;
  caption?: Bi;
  original?: {price: number; available: boolean; link?: string};
  prints?: PrintOffer[];
  /** set by the studio desk for a photo that is not uploaded yet */
  _preview?: string;
}

export interface ThemeColors {
  ground?: string;
  groundLine?: string;
  groundDot?: string;
  section2?: string;
  section2Line?: string;
  frame?: string;
  mat?: string;
  ink?: string;
  ink2?: string;
  mute?: string;
  paper?: string;
  paperInk?: string;
  accent?: string;
}

export type SectionKey = 'prints' | 'about' | 'commission' | 'contact' | 'trust' | 'facts' | 'filters' | 'lang';

export interface Layout {
  framesByDefault?: boolean;
  showTilt?: boolean;
  gridDensity?: 'airy' | 'normal' | 'dense';
  heroStyle?: 'split' | 'stacked' | 'minimal';
  comingSoon?: boolean;
  reveal?: boolean;
  worksLayout?: 'grid' | 'single';
  drops?: boolean;
  liveColour?: boolean;
  hideSections?: SectionKey[];
}

export interface SiteTheme {
  preset?: 'carpet' | 'shawl' | 'paper' | 'gallery' | 'custom';
  colors?: ThemeColors;
  pattern?: 'gul' | 'paisley' | 'none';
  patternSvg?: string;
  patternSize?: string;
  customCss?: string;
  fonts?: {display?: string; body?: string; mono?: string};
  layout?: Layout;
}

export interface Shipping {
  rates?: Record<string, {print: number; original: number}>;
  pickupCity?: string;
  countries?: Record<string, string[]>;
}

export interface Commerce {
  currency?: string;
  pricesIncludeVat?: boolean;
  vatOriginals?: number;
  vatPrints?: number;
  kleinunternehmer?: boolean;
  shipRegions?: string[];
  shippingNote?: Bi;
  usNote?: Bi;
  commissionLink?: string;
  analytics?: {enabled?: boolean; provider?: string};
  payment?: {
    method?: 'revolut' | 'stripe';
    revolutLink?: string;
    revolutName?: string;
    bankTransferNote?: Bi;
    confirmationHours?: number;
  };
  orders?: {provider?: 'netlify' | 'formspree' | 'mailto'; endpoint?: string; notifyEmail?: string};
  shipping?: Shipping;
  notify?: {enabled?: boolean};
  /** working days until an original or an edition leaves the studio */
  deliveryDays?: {original?: number; print?: number};
}

export interface Legal {
  legalName?: string;
  tradeName?: string;
  street?: string;
  zipCity?: string;
  country?: string;
  email?: string;
  phone?: string;
  uid?: string;
  kleinunternehmerNote?: boolean;
  regulator?: string;
  chamber?: string;
  hosting?: string;
  payment?: string;
  returnsDaysPrints?: number;
  lastUpdated?: string;
  /** true: the seller takes part in consumer arbitration; false: says so and names the body */
  adrParticipates?: boolean;
}

export interface Fact {
  label: Bi;
  value: Bi;
}

export interface Texts {
  heroLead?: Bi;
  heroMeta?: Bi;
  worksKicker?: Bi;
  printsLead?: Bi;
  aboutLead?: Bi;
  aboutParagraphs?: Partial<Record<Lang, string[]>>;
  facts?: Fact[];
  commission?: {intro?: Bi; steps?: Partial<Record<Lang, string[]>>};
  contactIntro?: Bi;
  empty?: {works?: Bi; filter?: Bi; prints?: Bi};
  aboutImage?: {src?: string; alt?: Bi; caption?: Bi};
  copyright?: Bi;
  ui?: Partial<Record<Lang, Record<string, string>>>;
}

export interface Brand {
  name: string;
  wordmarkTop?: string;
  wordmarkBottom?: string;
  motto?: string;
  artist?: string;
  city?: string;
  instagram?: string;
  email?: string;
  personSite?: string;
  defaultLang?: Lang;
  logo?: string;
  logoWidth?: number;
}

export interface PrintTier {
  size: string;
  price: number;
  edition: number | string;
  paper?: string;
}

export interface Site {
  brand: Brand;
  theme?: SiteTheme;
  commerce?: Commerce;
  texts?: Texts;
  printTiers?: PrintTier[];
  legal?: Legal;
}

export type LegalKind = 'imprint' | 'privacy' | 'terms' | 'withdrawal' | 'shipping' | 'guarantee' | 'us' | 'access';

export interface OrderVariant {
  kind: 'original' | 'print';
  label: string;
  price: number;
}
