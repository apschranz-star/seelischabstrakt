/* Editions, the about band, what to know before buying, commissions and contact. */
import {useState, type FormEvent} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {isEmail, sendForm} from '../lib/forms';
import {richText, safeUrl, useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import {noticeFiles} from '../lib/notice';
import {Paper} from './Paper';

export function Editions() {
  const {site, works, t, L, fmt, hidden, soon} = useShop();
  if (hidden('prints')) return null;
  const any = !soon && works.some((w) => w.prints?.length);
  return (
    <section className="sec" id="prints" tabIndex={-1}>
      <div className="sec-head reveal">
        <div>
          <Text as="p" className="kicker">{t('prints.kicker')}</Text>
          <Heading level={2} className="sec-title">
            {t('prints.title')}
          </Heading>
        </div>
        {any && (
          <Text as="p" className="prints-lead">
            {L(site.texts?.printsLead)}
          </Text>
        )}
      </div>
      {any ? (
        <div className="prints">
          {(site.printTiers || []).map((p) => (
            <div className="print-tier reveal" key={p.size}>
              <div className="size">{p.size}</div>
              <div className="p">{fmt(p.price)}</div>
              <small>
                {t('lbl.edition')} {p.edition}
                {p.paper ? ` · ${p.paper}` : ''}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <Text as="p" className="empty reveal">{L(site.texts?.empty?.prints) || t('prints.empty')}</Text>
      )}
    </section>
  );
}

export function About() {
  const {site, lang, L, hidden} = useShop();
  if (hidden('about')) return null;
  const x = site.texts || {};
  const paragraphs = x.aboutParagraphs?.[lang] || x.aboutParagraphs?.en || [];
  const image = safeUrl(x.aboutImage?.src);
  const caption = L(x.aboutImage?.caption);
  return (
    <section className="sec shawl" id="about" tabIndex={-1}>
      <div className="about">
        <div>
          <Text as="p" className="lead reveal">{richText(L(x.aboutLead))}</Text>
          {image && (
            <figure className="portrait reveal">
              <img src={image} alt={L(x.aboutImage?.alt) || site.brand.artist || ''} loading="lazy" decoding="async" />
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          )}
        </div>
        <div className="body reveal">
          {paragraphs.map((p, i) => (
            <Text as="p" key={i}>{p}</Text>
          ))}
          {!hidden('facts') && !!x.facts?.length && (
            <dl className="facts">
              {x.facts.map((f, i) => (
                <div key={i}>
                  <dt>{L(f.label)}</dt>
                  <dd>{L(f.value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

/** What a buyer should know before ordering, and the EU notice on the legal
    guarantee, which § 4 Abs 1 Z 12 FAGG wants shown prominently. */
export function Buying() {
  const {t, lang, withdrawalDays} = useShop();
  const {open} = useUi();
  const notice = noticeFiles(lang);
  const items = [
    {t: t('buy.unique.t'), d: t('buy.unique.d')},
    {t: t('buy.ship.t'), d: t('buy.ship.d')},
    {t: t('buy.back.t', {d: withdrawalDays}), d: t('buy.back.d', {d: withdrawalDays})},
    {t: t('buy.pay.t'), d: t('buy.pay.d')},
  ];
  return (
    <section className="sec" id="buying" tabIndex={-1}>
      <div className="sec-head reveal">
        <div>
          <Text as="p" className="kicker">{t('buy.kicker')}</Text>
          <Heading level={2} className="sec-title">
            {t('buy.title')}
          </Heading>
        </div>
      </div>
      <div className="know">
        {items.map((it, i) => (
          <div className="know-item reveal" key={i} style={{'--d': `${i * 90}ms`} as React.CSSProperties}>
            <Text as="p" className="know-n">0{i + 1}</Text>
            <Heading level={3} className="know-t">
              {it.t}
            </Heading>
            <Text as="p" className="know-d">
              {it.d}
            </Text>
          </div>
        ))}
      </div>
      <div className="know-more reveal">
        <Button label={t('buy.more.shipping')} variant="secondary" href="#shipping" />
        <Button label={t('buy.more.withdrawal')} variant="secondary" href="#withdrawal" />
        <Button label={t('legal.terms')} variant="secondary" href="#terms" />
      </div>
      <Paper>
        <div className="guarantee reveal">
          <button type="button" className="guarantee-thumb" aria-label={t('guarantee.open')} onClick={() => open({type: 'legal', kind: 'guarantee'})}>
            <img src={notice.preview} alt="" width={794} height={1123} loading="lazy" decoding="async" />
          </button>
          <div>
            <Heading level={3}>{t('guarantee.title')}</Heading>
            <Text as="p">{t('guarantee.lead')}</Text>
            <div className="guarantee-actions">
              <Button label={t('guarantee.open')} variant="primary" onClick={() => open({type: 'legal', kind: 'guarantee'})} />
              <Button label={t('guarantee.download')} variant="secondary" href={notice.file} target="_blank" />
            </div>
          </div>
        </div>
      </Paper>
    </section>
  );
}

export function CommissionAndContact() {
  const {site, t, L, lang, hidden, withdrawalDays, email} = useShop();
  const {open} = useUi();
  const c = site.commerce || {};
  const x = site.texts || {};
  const showCommission = !hidden('commission');
  const showContact = !hidden('contact');
  if (!showCommission && !showContact) return null;
  const steps = x.commission?.steps?.[lang] || x.commission?.steps?.en || [];
  const commissionLink = safeUrl(c.commissionLink);
  const instagram = safeUrl(site.brand.instagram);
  const vat =
    c.kleinunternehmer || site.legal?.kleinunternehmerNote
      ? t('price.klein')
      : t('price.incl', {vo: c.vatOriginals ?? '', vp: c.vatPrints ?? ''});

  return (
    <section className="sec" id="commission" tabIndex={-1}>
      <Paper>
        <div className="two">
          {showCommission && (
            <div className="card reveal">
              <Heading level={2} className="card-title">
                {t('comm.title')}
              </Heading>
              <Text as="p">{L(x.commission?.intro)}</Text>
              <ol className="steps">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <div className="links">
                {commissionLink ? (
                  <Button label={t('comm.cta')} variant="primary" href={commissionLink} />
                ) : (
                  <Button
                    label={t('comm.cta')}
                    variant="primary"
                    onClick={() => open({type: 'contact', subject: t('cform.subject.commission')})}
                  />
                )}
              </div>
            </div>
          )}
          {showContact && (
            <div className="card reveal" id="contact" tabIndex={-1}>
              <Heading level={2} className="card-title">
                {t('contact.title')}
              </Heading>
              <Text as="p">{L(x.contactIntro)}</Text>
              <div className="links">
                <Button label={t('contact.form')} variant="primary" onClick={() => open({type: 'contact'})} />
                {email && <Button label={t('contact.mail')} variant="secondary" href={`mailto:${email}`} />}
                {instagram && <Button label="Instagram" variant="secondary" href={instagram} target="_blank" rel="noopener" />}
              </div>
              <Text as="p" className="terms">
                {vat} {L(c.shippingNote)} {t('price.returns', {d: withdrawalDays})}
              </Text>
              {c.notify?.enabled && <Notify />}
            </div>
          )}
        </div>
      </Paper>
    </section>
  );
}

/** "Tell me when a new work goes up." Consent is given with the tick box, and
    its wording and time travel with the address (Art 7 (1) GDPR). */
function Notify() {
  const {site, t, lang} = useShop();
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [error, setError] = useState<{email?: string; consent?: string}>({});

  async function submit(e: FormEvent) {
    e.preventDefault();
    const problems = {
      email: isEmail(address) ? undefined : t('order.err.email'),
      consent: consent ? undefined : t('order.needAgree'),
    };
    setError(problems);
    if (problems.email || problems.consent) return;
    setState('sending');
    const ok = await sendForm(site, 'notify', {
      email: address.trim(),
      lang,
      consent: `${t('notify.consent')} (${new Date().toISOString()})`,
    });
    setState(ok ? 'done' : 'failed');
    if (ok) {
      setAddress('');
      setConsent(false);
    }
  }

  return (
    <form className="notify" onSubmit={submit} noValidate>
      <Heading level={3} className="notify-title">
        {t('notify.title')}
      </Heading>
      <Text as="p">{t('notify.text')}</Text>
      <div className="notify-row">
        <TextInput
          type="email"
          label={t('notify.email')}
          isLabelHidden
          placeholder={t('notify.placeholder')}
          autoComplete="email"
          htmlName="email"
          value={address}
          onChange={setAddress}
          status={error.email ? {type: 'error', message: error.email} : undefined}
          statusVariant="detached"
        />
        <Button type="submit" label={t('notify.btn')} variant="primary" isLoading={state === 'sending'} />
      </div>
      <CheckboxInput
        label={t('notify.consent')}
        value={consent}
        onChange={setConsent}
        status={error.consent ? {type: 'error', message: error.consent} : undefined}
      />
      <Text as="p" className="terms" role="status" aria-live="polite">
        {state === 'done' ? t('notify.ok') : state === 'failed' ? t('notify.fail') : ''}
      </Text>
    </form>
  );
}
