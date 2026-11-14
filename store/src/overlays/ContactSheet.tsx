/* A message to the studio. Besides the email address this is the second way
   to reach the seller directly, which a commercial site has to offer. */
import {useState, type FormEvent} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {isEmail, mailto, sendForm} from '../lib/forms';
import {useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import {Sheet} from './Sheet';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function ContactSheet({subject: initialSubject = ''}: {subject?: string}) {
  const {site, t, lang, email: shopEmail} = useShop();
  const {open, close} = useUi();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const e: Errors = {};
    if (!name.trim()) e.name = t('order.err.required');
    if (!isEmail(email)) e.email = t('order.err.email');
    if (!message.trim()) e.message = t('order.err.required');
    setErrors(e);
    if (Object.keys(e).length) return;
    setState('sending');
    const ok = await sendForm(site, 'contact', {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      lang,
    });
    setState(ok ? 'done' : 'failed');
  }

  if (state === 'done')
    return (
      <Sheet title={t('cform.title')} width={640} onClose={close}>
        <div className="form done">
          <Text as="p">{t('cform.done')}</Text>
          <div className="form-actions start">
            <Button label={t('close')} variant="primary" onClick={close} />
          </div>
        </div>
      </Sheet>
    );

  return (
    <Sheet title={t('cform.title')} width={640} purpose="form" onClose={close}>
      <form className="form" onSubmit={submit} noValidate>
        <Text as="p">{t('cform.lead')}</Text>
        {state === 'failed' && (
          <Banner
            status="error"
            title={t('cform.fail')}
            collapsible={false}
            endContent={
              <Button
                label={t('cform.failBtn')}
                variant="primary"
                href={mailto(shopEmail, subject.trim() || site.brand.name, `${message.trim()}\n\n${name.trim()}\n${email.trim()}`)}
              />
            }
          />
        )}
        <div className="form-grid">
          <TextInput
            label={t('cform.name')}
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
            label={t('cform.email')}
            value={email}
            onChange={setEmail}
            autoComplete="email"
            htmlName="email"
            isRequired
            status={errors.email ? {type: 'error', message: errors.email} : undefined}
            statusVariant="detached"
          />
          <div className="full">
            <TextInput label={t('cform.subject')} value={subject} onChange={setSubject} htmlName="subject" />
          </div>
          <div className="full">
            <TextArea
              label={t('cform.message')}
              value={message}
              onChange={setMessage}
              htmlName="message"
              rows={6}
              isRequired
              status={errors.message ? {type: 'error', message: errors.message} : undefined}
              statusVariant="detached"
            />
          </div>
        </div>
        <Text as="p" className="form-note">
          {t('cform.privacy')}{' '}
          <button type="button" className="linkish" onClick={() => open({type: 'legal', kind: 'privacy'})}>
            {t('legal.privacy')}
          </button>
        </Text>
        <div className="form-actions">
          <Button type="submit" label={t('cform.send')} variant="primary" size="lg" isLoading={state === 'sending'} />
        </div>
      </form>
    </Sheet>
  );
}
