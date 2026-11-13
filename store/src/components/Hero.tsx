/* The floating wordmark on the carpet, and what the shop is, in three lines. */
import {useEffect, useRef} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {mountLiveColour} from '../lib/liveColour';
import {safeUrl, useShop} from '../lib/shop';

export function Hero() {
  const {site, t, L} = useShop();
  const b = site.brand;
  const host = useRef<HTMLHeadingElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const live = site.theme?.layout?.liveColour !== false && !b.logo;

  useEffect(() => {
    if (!live || !host.current || !word.current) return;
    return mountLiveColour(host.current, word.current);
  }, [live, b.wordmarkBottom]);

  const instagram = safeUrl(b.instagram);
  const handle = instagram ? '@' + instagram.replace(/\/$/, '').split('/').pop() : '';
  const logo = safeUrl(b.logo);

  return (
    <section className="hero">
      <div>
        <Heading level={1} className="wordmark reveal" ref={host}>
          {logo ? (
            <img src={logo} alt={b.name} style={{maxWidth: `min(100%, ${Number(b.logoWidth) || 520}px)`}} />
          ) : (
            <>
              <span className="lo" id="wm-top">
                {b.wordmarkTop}
              </span>
              <span id="wm-bottom" ref={word}>
                {b.wordmarkBottom}
              </span>
            </>
          )}
        </Heading>
        {b.motto && <p className="motto reveal">{b.motto}</p>}
      </div>
      <div className="hero-side">
        <Text as="p" type="large" className="hero-lead reveal" style={{'--d': '110ms'} as React.CSSProperties}>
          {L(site.texts?.heroLead)}
        </Text>
        <p className="hero-meta reveal" style={{'--d': '220ms'} as React.CSSProperties}>
          <span>{b.artist}</span>
          <span>{b.city}</span>
          <span>{L(site.texts?.heroMeta)}</span>
        </p>
        <div className="hero-actions reveal" style={{'--d': '330ms'} as React.CSSProperties}>
          <Button label={t('hero.cta1')} variant="primary" size="lg" href="#works" />
          {instagram && (
            <Button label={handle} variant="secondary" size="lg" href={instagram} target="_blank" rel="noopener" />
          )}
        </div>
      </div>
    </section>
  );
}
