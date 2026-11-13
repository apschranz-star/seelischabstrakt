/* The frame around the page: ticker, header, footer and the round mark. */
import {useEffect, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Link} from '@astryxdesign/core/Link';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {useShop} from '../lib/shop';
import {LEGAL_KINDS, useUi} from '../lib/ui';
import type {Lang, SectionKey} from '../lib/types';

export interface NavItem {
  href: string;
  key: string;
  section?: SectionKey;
}

export const NAV: NavItem[] = [
  {href: '#works', key: 'nav.works'},
  {href: '#prints', key: 'nav.prints', section: 'prints'},
  {href: '#about', key: 'nav.about', section: 'about'},
  {href: '#buying', key: 'nav.buying'},
  {href: '#commission', key: 'nav.commission', section: 'commission'},
  {href: '#contact', key: 'nav.contact', section: 'contact'},
];

export function useNav(): NavItem[] {
  const {hidden} = useShop();
  return NAV.filter((n) => !n.section || !hidden(n.section));
}

/** The yellow band at the very top. It carries the trust line: certificate,
    shipping, right of withdrawal, payment. */
export function Ticker() {
  const {t, hidden, withdrawalDays} = useShop();
  const text = t('trust', {d: withdrawalDays});
  if (hidden('trust') || !text) return null;
  return (
    <div className="ticker" role="note">
      <div className="ticker-track">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} aria-hidden={i > 0 ? true : undefined}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const {site, t, lang, setLang, hidden} = useShop();
  const {open, overlay} = useUi();
  const nav = useNav();
  const other: Lang = lang === 'en' ? 'de' : 'en';
  return (
    <header className="nav">
      <div className="burger">
        <IconButton
          label={t('nav.menu')}
          icon={<Icon icon="menu" />}
          variant="ghost"
          aria-haspopup="dialog"
          aria-expanded={overlay?.type === 'menu'}
          onClick={() => open({type: 'menu'})}
        />
      </div>
      <a className="brand" href="#top">
        {site.brand.name}
      </a>
      <nav aria-label={t('nav.main')}>
        <ul className="nav-links">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} color="inherit" type="inherit">
                {t(n.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {!hidden('lang') && (
        <div className="nav-controls">
          <div className="lang-seg">
            <SegmentedControl label={t('lang.label')} value={lang} onChange={(v) => setLang(v as Lang)} size="sm">
              <SegmentedControlItem value="en" label="EN" />
              <SegmentedControlItem value="de" label="DE" />
            </SegmentedControl>
          </div>
          <div className="lang-round">
            {/* On a phone one round button shows the language in use; a tap
                switches to the other one. */}
            <Button label={`${t('lang.label')}: ${t('lang.' + other)}`} variant="primary" onClick={() => setLang(other)}>
              {lang.toUpperCase()}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const {site, t, L} = useShop();
  const b = site.brand;
  const year = new Date().getFullYear();
  const custom = L(site.texts?.copyright);
  const copyright = custom
    ? custom.replace('{year}', String(year))
    : [`© ${year} ${b.name}`, b.artist, b.motto].filter(Boolean).join(' · ');
  return (
    <footer className="foot">
      <div className="foot-top">
        {/* § 13a FAGG: the withdrawal function, labelled with the words the
            law gives, in plain sight on every page and without a login. */}
        <Button label={t('withdraw.button')} variant="secondary" href="#widerruf" />
        {b.instagram && (
          <Link href={b.instagram} target="_blank" color="inherit" type="inherit">
            Instagram
          </Link>
        )}
      </div>
      <nav aria-label={t('legal.nav')}>
        <ul className="legal-links">
          {LEGAL_KINDS.map((k) => (
            <li key={k}>
              <Link href={`#${k}`} color="inherit" type="inherit">
                {t('legal.' + k)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="foot-row">
        <span>{copyright}</span>
        {b.personSite && (
          <Link href={b.personSite} color="inherit" type="inherit">
            {t('footer.person')}
          </Link>
        )}
      </div>
    </footer>
  );
}

/** The round mark in the corner. It appears once the hero has left the screen
    and leads to the contact section. */
export function Mark() {
  const {t, hidden} = useShop();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero || !('IntersectionObserver' in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting), {threshold: 0});
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  if (hidden('contact')) return null;
  return (
    <div className={on ? 'mark on' : 'mark'}>
      <Button label={t('nav.contact')} variant="primary" elevation="high" href="#contact" tabIndex={on ? 0 : -1}>
        sa
      </Button>
    </div>
  );
}
