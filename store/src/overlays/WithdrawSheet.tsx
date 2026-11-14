/* The withdrawal function of § 13a FAGG (Art 11a of Directive 2011/83/EU).

   What the law fixes, and what this sheet therefore does not vary:
   - it is reached from every page by a control labelled "Vertrag widerrufen",
     without a login;
   - the declaration asks for three things only: the name, what identifies the
     contract, and where the acknowledgement of receipt should go;
   - it is sent with one control labelled "Widerruf bestätigen", nothing else;
   - the acknowledgement names the content and the day and time of receipt.
   The acknowledgement on a durable medium is an email from the studio: the
   studio desk prepares it. This page hands the same record over at once, to
   keep. */
import {useState, type FormEvent} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {isEmail, mailto, saveText, sendForm, stamp} from '../lib/forms';
import {useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import {LegalText} from '../legal/LegalText';
import {Sheet} from './Sheet';

type Errors = Partial<Record<'name' | 'order' | 'email', string>>;

export function WithdrawSheet() {
  const {site, t, lang, withdrawalDays, email: shopEmail} = useShop();
  const {close} = useUi();
  const [name, setName] = useState('');
  const [order, setOrder] = useState('');
  const [email, setEmail] = useState('');
  const [part, setPart] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [reading, setReading] = useState(false);
  const [result, setResult] = useState<{sent: boolean; at: Date} | null>(null);

  const statement = t('withdraw.statement');
  const lines = (at: Date) => {
    const s = stamp(lang, at);
    return [
      `${site.brand.name}: ${t('withdraw.title')}`,
      '',
      statement,
      '',
      `${t('withdraw.name')}: ${name.trim()}`,
      `${t('withdraw.order')}: ${order.trim()}`,
      `${t('withdraw.email')}: ${email.trim()}`,
      part.trim() ? `${t('withdraw.part')}: ${part.trim()}` : '',
      '',
      `${t('withdraw.received')}: ${s.date}, ${s.time} (${s.iso})`,
      '',
      `${site.legal?.legalName || site.brand.artist || ''}, ${site.legal?.zipCity || ''} · ${shopEmail}`,
    ].filter((l, i, all) => l !== '' || all[i - 1] !== '');
  };

  async function confirm(ev: FormEvent) {
    ev.preventDefault();
    const e: Errors = {};
    if (!name.trim()) e.name = t('order.err.required');
    if (!order.trim()) e.order = t('order.err.required');
    if (!isEmail(email)) e.email = t('order.err.email');
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    const at = new Date();
    const sent = await sendForm(site, 'withdrawal', {
      name: name.trim(),
      order: order.trim(),
      email: email.trim(),
      part: part.trim(),
      statement,
      received: at.toISOString(),
      lang,
    });
    setResult({sent, at});
    setSending(false);
  }

  if (reading)
    return (
      <Sheet
        title={t('legal.withdrawal')}
        width={720}
        purpose="form"
        onClose={close}
        startContent={<Button label={t('back')} variant="secondary" size="sm" onClick={() => setReading(false)} />}>
        <LegalText kind="withdrawal" />
      </Sheet>
    );

  if (result) {
    const s = stamp(lang, result.at);
    return (
      <Sheet title={result.sent ? t('withdraw.done') : t('withdraw.title')} width={720} purpose="form" onClose={close}>
        <div className="form done">
          {result.sent ? (
            <Text as="p">{t('withdraw.doneText', {date: s.date, time: s.time, email: email.trim()})}</Text>
          ) : (
            <Banner
              status="error"
              title={t('withdraw.fail')}
              collapsible={false}
              endContent={
                <Button
                  label={t('withdraw.failBtn')}
                  variant="primary"
                  href={mailto(shopEmail, `${t('withdraw.title')}: ${order.trim()}`, lines(result.at))}
                />
              }
            />
          )}
          <dl className="sum" aria-label={t('withdraw.record')}>
            <div>
              <dt>{t('withdraw.name')}</dt>
              <dd>{name.trim()}</dd>
            </div>
            <div>
              <dt>{t('withdraw.order')}</dt>
              <dd>{order.trim()}</dd>
            </div>
            {part.trim() && (
              <div>
                <dt>{t('withdraw.part')}</dt>
                <dd>{part.trim()}</dd>
              </div>
            )}
            <div>
              <dt>{t('withdraw.received')}</dt>
              <dd>
                {s.date}, {s.time}
              </dd>
            </div>
          </dl>
          <div>
            <h3>{t('withdraw.next')}</h3>
            <Text as="p">{t('withdraw.nextText')}</Text>
          </div>
          <div className="form-actions start">
            <Button
              label={t('withdraw.save')}
              variant="primary"
              onClick={() => saveText(`${site.brand.name}-${t('withdraw.title')}.txt`, lines(result.at).join('\n'))}
            />
            <Button label={t('order.print')} variant="secondary" onClick={() => window.print()} />
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title={t('withdraw.title')} width={720} purpose="form" onClose={close}>
      <form className="form" onSubmit={confirm} noValidate>
        <Text as="p">{t('withdraw.lead', {d: withdrawalDays})}</Text>
        <Text as="p" className="form-note">
          {t('withdraw.excluded')}{' '}
          <button type="button" className="linkish" onClick={() => setReading(true)}>
            {t('withdraw.terms')}
          </button>
        </Text>
        <div className="form-grid">
          <TextInput
            label={t('withdraw.name')}
            value={name}
            onChange={setName}
            autoComplete="name"
            htmlName="name"
            isRequired
            status={errors.name ? {type: 'error', message: errors.name} : undefined}
            statusVariant="detached"
          />
          <TextInput
            label={t('withdraw.order')}
            description={t('withdraw.orderHint')}
            value={order}
            onChange={setOrder}
            htmlName="order"
            autoCapitalize="characters"
            isRequired
            status={errors.order ? {type: 'error', message: errors.order} : undefined}
            statusVariant="detached"
          />
          <div className="full">
            <TextInput
              type="email"
              label={t('withdraw.email')}
              value={email}
              onChange={setEmail}
              autoComplete="email"
              htmlName="email"
              isRequired
              status={errors.email ? {type: 'error', message: errors.email} : undefined}
              statusVariant="detached"
            />
          </div>
          <div className="full">
            <TextInput
              label={t('withdraw.part')}
              description={t('withdraw.partHint')}
              value={part}
              onChange={setPart}
              htmlName="part"
            />
          </div>
        </div>
        <Text as="p" className="legal model">{statement}</Text>
        <div className="form-actions">
          {/* § 13a Abs 4 FAGG: this label and nothing else. */}
          <Button type="submit" label={t('withdraw.confirm')} variant="primary" size="lg" isLoading={sending} />
        </div>
      </form>
    </Sheet>
  );
}
