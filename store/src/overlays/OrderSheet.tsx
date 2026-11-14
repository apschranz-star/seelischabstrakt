/* Ordering a work, in three steps: details, check, confirmation.

   The shape follows the law for online orders (§ 8 FAGG, §§ 9 and 10 ECG):
   - at the start: where we deliver and how payment works;
   - directly before the order: what is bought and the total price, and then
     one button that says in plain words that pressing it costs money;
   - afterwards, at once: the acknowledgement that the order has arrived.
   The texts a buyer may want to read first (terms, withdrawal notice, the
   EU notice on the legal guarantee) open inside this sheet, so nothing typed
   is lost. */
import {useMemo, useState, type FormEvent} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Heading} from '@astryxdesign/core/Heading';
import {Step, Stepper} from '@astryxdesign/core/Stepper';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {useToast} from '@astryxdesign/core/Toast';
import {NativeSelect} from '../components/NativeSelect';
import {Placeholder} from '../components/Works';
import {isEmail, mailto, orderRef, recordLines, saveText, sendForm, stamp} from '../lib/forms';
import {small} from '../lib/images';
import {safeUrl, useShop} from '../lib/shop';
import {countryOptions, OTHER, PICKUP, shippingFor} from '../lib/shipping';
import {useUi} from '../lib/ui';
import type {LegalKind, OrderVariant} from '../lib/types';
import {LegalText} from '../legal/LegalText';
import {Sheet} from './Sheet';

type View = 'form' | 'review' | 'done';
type Errors = Partial<Record<'name' | 'email' | 'address' | 'country' | 'agree', string>>;

export function OrderSheet({id, variant}: {id: string; variant: OrderVariant}) {
  const shop = useShop();
  const {site, works, t, L, fmt, lang, withdrawalDays, email: shopEmail} = shop;
  const {close} = useUi();
  const toast = useToast();
  const w = works.find((x) => x.id === id);

  const [ref] = useState(() => orderRef());
  const [view, setView] = useState<View>('form');
  const [reading, setReading] = useState<LegalKind | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{sent: boolean; at: Date} | null>(null);

  const c = site.commerce || {};
  const currency = c.currency || 'EUR';
  const city = c.shipping?.pickupCity || 'Wien';
  const options = useMemo(
    () => countryOptions(site, {pickup: t('order.pickup', {city}), other: t('order.country.other')}),
    [site, t, city],
  );
  if (!w) return null;

  const shipping = shippingFor(site, country, variant.kind);
  const total = variant.price + (shipping || 0);
  const pickup = country === PICKUP;
  const countryLabel = pickup ? t('order.collect', {city}) : country === OTHER ? t('order.country.other') : country;
  const spec = [variant.label, L(w.medium), `${w.w} × ${w.h} cm`, w.year].filter(Boolean).join(' · ');
  const vat =
    c.kleinunternehmer || site.legal?.kleinunternehmerNote
      ? t('price.klein')
      : t('price.incl', {vo: c.vatOriginals ?? '', vp: c.vatPrints ?? ''});
  const payLink = `${(c.payment?.revolutLink || '').replace(/\/$/, '')}?amount=${total}&currency=${currency}`;
  const hours = c.payment?.confirmationHours || 48;
  const base = `${location.origin}${location.pathname}`;
  const thumb = w._preview || w.img;

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = t('order.err.required');
    if (!isEmail(email)) e.email = t('order.err.email');
    if (!country) e.country = t('order.err.country');
    if (!pickup && !address.trim()) e.address = t('order.err.required');
    if (!agree) e.agree = t('order.needAgree');
    return e;
  }

  function toReview(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setView('review');
  }

  const record = (at: Date): Record<string, string> => ({
    ref,
    date: at.toISOString().slice(0, 10),
    work: `${w.title} (${w.id})`,
    variant: variant.label,
    price: `${variant.price} ${currency}`,
    shipping: `${shipping ?? 0} ${currency}`,
    total: `${total} ${currency}`,
    name: name.trim(),
    email: email.trim(),
    address: address.trim(),
    country: countryLabel,
    message: message.trim(),
    lang,
  });

  async function place() {
    setSending(true);
    const at = new Date();
    const sent = await sendForm(site, 'order', record(at));
    setResult({sent, at});
    setSending(false);
    setView('done');
  }

  function confirmationText(at: Date): string {
    const s = stamp(lang, at);
    return [
      `${site.brand.name}: ${t('order.thanks')}`,
      '',
      `${t('order.number')}: ${ref}`,
      `${t('order.date')}: ${s.date}, ${s.time}`,
      '',
      `${t('order.item')}: ${w!.title}`,
      spec,
      `${t('order.price')}: ${fmt(variant.price)}`,
      `${t('order.ship')}: ${fmt(shipping ?? 0)}`,
      `${t('order.total')}: ${fmt(total)}`,
      vat,
      '',
      `${t('order.deliverTo')}:`,
      name.trim(),
      pickup ? countryLabel : `${address.trim()}\n${countryLabel}`,
      email.trim(),
      message.trim() ? `\n${t('order.message')}: ${message.trim()}` : '',
      '',
      `${t('order.payTitle')}: ${payLink}`,
      t('order.payText'),
      '',
      t('order.received', {date: s.date, time: s.time, h: hours}),
      t('order.withdrawHint', {d: withdrawalDays}),
      '',
      `${t('legal.terms')}: ${base}#terms`,
      `${t('legal.withdrawal')}: ${base}#withdrawal`,
      `${t('withdraw.button')}: ${base}#widerruf`,
      `${t('legal.guarantee')}: ${base}#guarantee`,
      '',
      `${site.legal?.legalName || site.brand.artist || ''}, ${site.legal?.zipCity || ''} · ${shopEmail}`,
    ]
      .filter((line) => line !== undefined)
      .join('\n');
  }

  const step = view === 'form' ? 0 : view === 'review' ? 1 : 2;
  const title = reading
    ? t('legal.' + reading)
    : view === 'done'
      ? result?.sent
        ? t('order.thanks')
        : t('order.title')
      : `${t('order.title')}: ${w.title}`;

  const summary = (
    <dl className="sum" aria-label={t('order.summary')}>
      <div>
        <dt>{t('order.item')}</dt>
        <dd>
          {w.title}
          {'\n'}
          {spec}
        </dd>
      </div>
      <div>
        <dt>{t('order.price')}</dt>
        <dd>{fmt(variant.price)}</dd>
      </div>
      <div>
        <dt>{t('order.ship')}</dt>
        <dd>{shipping === null ? t('order.shipTbd') : fmt(shipping)}</dd>
      </div>
      <div className="total">
        <dt>{t('order.total')}</dt>
        <dd>{fmt(total)}</dd>
      </div>
    </dl>
  );

  return (
    <Sheet
      title={title}
      width={760}
      purpose="form"
      onClose={close}
      startContent={
        reading ? <Button label={t('back')} variant="secondary" size="sm" onClick={() => setReading(null)} /> : undefined
      }>
      {reading ? (
        <LegalText kind={reading} />
      ) : (
        <div className="form">
          <Stepper
            activeStep={step}
            label={t('order.steps')}
            density="compact"
            horizontalOptions={{minimumStepWidth: 150, collapsedVariant: 'withLabel'}}>
            <Step step={0} label={t('order.step1')} />
            <Step step={1} label={t('order.step2')} />
            <Step step={2} label={t('order.step3')} />
          </Stepper>

          {view !== 'done' && (
            <div className="order-head">
              {thumb ? (
                <img src={safeUrl(w._preview ? thumb : small(w, thumb))} alt="" />
              ) : (
                <Placeholder work={w} label="" />
              )}
              <div>
                <Heading level={3} className="order-head-title">
                  {w.title}
                </Heading>
                <Text as="p">{spec}</Text>
              </div>
            </div>
          )}

          {view === 'form' && (
            <form className="form" onSubmit={toReview} noValidate>
              <Text as="p" className="form-note">{t('order.start', {city})}</Text>
              {Object.keys(errors).length > 0 && (
                <Banner status="error" title={t('order.err.fix')} collapsible={false} />
              )}
              <div className="form-grid">
                <TextInput
                  label={t('order.name')}
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                  htmlName="name"
                  isRequired
                  status={errors.name ? {type: 'error', message: errors.name} : undefined}
                  statusVariant="detached"
                />
                <TextInput
                  type="email"
                  label={t('order.email')}
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  htmlName="email"
                  isRequired
                  status={errors.email ? {type: 'error', message: errors.email} : undefined}
                  statusVariant="detached"
                />
                <div className="full">
                  <NativeSelect
                    label={t('order.country')}
                    value={country}
                    onChange={setCountry}
                    options={options}
                    placeholder={t('order.country.pick')}
                    name="country"
                    autoComplete="country-name"
                    isRequired
                    error={errors.country}
                    description={country === OTHER ? t('order.rowNote') : undefined}
                  />
                </div>
                {!pickup && (
                  <div className="full">
                    <TextArea
                      label={t('order.address')}
                      description={t('order.addressHint')}
                      value={address}
                      onChange={setAddress}
                      autoComplete="street-address"
                      htmlName="address"
                      rows={3}
                      isRequired
                      status={errors.address ? {type: 'error', message: errors.address} : undefined}
                      statusVariant="detached"
                    />
                  </div>
                )}
                <div className="full">
                  <TextInput label={t('order.message')} value={message} onChange={setMessage} htmlName="message" />
                </div>
              </div>

              {summary}
              <Text as="p" className="form-note">{vat}</Text>

              <div>
                <Heading level={3} className="ws-h">
                  {t('order.read')}
                </Heading>
                <Text as="p">{t('order.readText', {d: withdrawalDays})}</Text>
                <ul className="form-links">
                  {(['withdrawal', 'terms', 'guarantee', 'shipping', 'privacy'] as LegalKind[]).map((k) => (
                    <li key={k}>
                      <button type="button" className="linkish" onClick={() => setReading(k)}>
                        {t('legal.' + k)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <CheckboxInput
                label={t('order.agree')}
                value={agree}
                onChange={setAgree}
                isRequired
                status={errors.agree ? {type: 'error', message: errors.agree} : undefined}
              />
              <div className="form-actions">
                <Button type="submit" label={t('order.next')} variant="primary" size="lg" />
              </div>
            </form>
          )}

          {view === 'review' && (
            <div className="form">
              <div>
                <Heading level={3} className="order-head-title">
                  {t('order.review')}
                </Heading>
                <Text as="p">{t('order.reviewLead')}</Text>
              </div>
              {summary}
              <dl className="sum">
                <div>
                  <dt>{t('order.deliverTo')}</dt>
                  <dd>
                    {name.trim()}
                    {'\n'}
                    {pickup ? countryLabel : `${address.trim()}\n${countryLabel}`}
                  </dd>
                </div>
                <div>
                  <dt>{t('order.contact')}</dt>
                  <dd>{email.trim()}</dd>
                </div>
                <div>
                  <dt>{t('order.payment')}</dt>
                  <dd>{t('order.paymentText')}</dd>
                </div>
                {message.trim() && (
                  <div>
                    <dt>{t('order.message')}</dt>
                    <dd>{message.trim()}</dd>
                  </div>
                )}
              </dl>
              <Text as="p" className="form-note">
                {vat} {t('price.returns', {d: withdrawalDays})}
              </Text>
              <div className="form-actions">
                <Button label={t('order.edit')} variant="secondary" onClick={() => setView('form')} isDisabled={sending} />
                {/* § 8 Abs 2 FAGG: this label and nothing else. */}
                <Button label={t('order.submit')} variant="primary" size="lg" isLoading={sending} clickAction={place} />
              </div>
            </div>
          )}

          {view === 'done' && result && (
            <div className="form done">
              <div className="done-row">
                <span className="ref" aria-label={`${t('order.number')}: ${ref}`}>
                  {ref}
                </span>
                <Button
                  label={t('order.copy')}
                  variant="secondary"
                  onClick={() => {
                    void navigator.clipboard?.writeText(ref);
                    toast({body: t('order.copied'), uniqueID: 'copied'});
                  }}
                />
              </div>
              {result.sent ? (
                <Text as="p">
                  {t('order.received', {date: stamp(lang, result.at).date, time: stamp(lang, result.at).time, h: hours})}
                </Text>
              ) : (
                <Banner
                  status="error"
                  title={t('order.fail')}
                  collapsible={false}
                  endContent={
                    <Button
                      label={t('order.failBtn')}
                      variant="primary"
                      href={mailto(
                        c.orders?.notifyEmail || shopEmail,
                        `Order ${ref}: ${w.title}`,
                        recordLines(record(result.at)),
                      )}
                    />
                  }
                />
              )}
              {summary}
              <div className="pay">
                <h3>{t('order.payTitle')}</h3>
                <Text as="p">{t('order.payText')}</Text>
                <Text as="p">{t('order.payNote')}</Text>
              </div>
              <div className="form-actions start">
                <Button label={t('order.payBtn', {amount: fmt(total)})} variant="primary" size="lg" href={safeUrl(payLink)} target="_blank" rel="noopener" />
              </div>
              <div className="form-actions start">
                <Button
                  label={t('order.save')}
                  variant="secondary"
                  onClick={() => saveText(`${site.brand.name}-${ref}.txt`, confirmationText(result.at))}
                />
                <Button
                  label={t('order.copyMail')}
                  variant="secondary"
                  href={mailto(email.trim(), `${site.brand.name} ${ref}`, confirmationText(result.at))}
                />
                <Button label={t('order.print')} variant="secondary" onClick={() => window.print()} />
              </div>
              <Text as="p" className="form-note">
                {t('order.after', {email: shopEmail})} {t('order.withdrawHint', {d: withdrawalDays})}
              </Text>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
