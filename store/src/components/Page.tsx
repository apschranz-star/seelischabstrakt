/* The page, top to bottom. */
import {lazy, Suspense, useEffect} from 'react';
import {useShop} from '../lib/shop';
import {writeStructuredData} from '../lib/seo';
import {useUi} from '../lib/ui';
import {Drops} from './Drops';
import {Hero} from './Hero';
import {About, Buying, CommissionAndContact, Editions} from './Sections';
import {Footer, Header, Mark, Ticker} from './Shell';
import {Works} from './Works';

/* Everything that opens on top of the page (work details, order, legal texts,
   forms) is one chunk of its own, fetched after the page is up. */
const loadOverlays = () => import('../overlays');
const Overlays = lazy(loadOverlays);

/** Sections and works slide in softly when they enter the screen
    (theme.layout.reveal). New elements are picked up as they appear. */
function useReveal(enabled: boolean) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    const show = (el: Element) => el.classList.add('in');
    if (!enabled || !('IntersectionObserver' in window)) {
      const all = () => root.querySelectorAll('.reveal:not(.in)').forEach(show);
      all();
      const mo = new MutationObserver(all);
      mo.observe(root, {childList: true, subtree: true});
      return () => mo.disconnect();
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }),
      {threshold: 0.12, rootMargin: '0px 0px -6% 0px'},
    );
    const scan = () => root.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, {childList: true, subtree: true});
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [enabled]);
}

export function Page() {
  const shop = useShop();
  const {overlay} = useUi();
  useReveal(shop.site.theme?.layout?.reveal !== false);

  useEffect(() => {
    writeStructuredData(shop);
  }, [shop]);

  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = idle(() => void loadOverlays());
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id as number) : clearTimeout(id as number));
  }, []);

  return (
    <>
      <a className="skip" href="#works">
        {shop.t('skip')}
      </a>
      <Ticker />
      <Header />
      <main id="top">
        <Hero />
        <Drops />
        <Works />
        <Editions />
        <About />
        <Buying />
        <CommissionAndContact />
      </main>
      <Footer />
      <Mark />
      {overlay && (
        <Suspense fallback={null}>
          <Overlays />
        </Suspense>
      )}
    </>
  );
}
