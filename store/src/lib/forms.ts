/* Sending forms. The shop is a static page; Netlify Forms stores a submission
   and tells the studio by email. Each form also exists as plain HTML in
   index.html so that Netlify registers it at deploy time.

   When sending fails (no network, or the copy of the shop on GitHub Pages,
   where no form service exists), every flow falls back to the visitor's own
   email program with the finished text. Nothing is silently lost. */
import type {Site} from './types';

export type FormName = 'order' | 'notify' | 'contact' | 'withdrawal';

export async function sendForm(site: Site, name: FormName, fields: Record<string, string>): Promise<boolean> {
  const orders = site.commerce?.orders || {};
  const body = new URLSearchParams({'form-name': name, ...fields});
  try {
    if (name === 'order' && orders.provider === 'formspree' && orders.endpoint) {
      const r = await fetch(orders.endpoint, {method: 'POST', headers: {Accept: 'application/json'}, body});
      return r.ok;
    }
    if (orders.provider === 'mailto') return false;
    const r = await fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body,
    });
    /* A host without the form service answers with its own 404 page or with
       index.html. Netlify answers a stored submission with 200. */
    return r.ok && !/github\.io$/i.test(location.hostname);
  } catch {
    return false;
  }
}

export function mailto(to: string, subject: string, lines: string[] | string): string {
  const body = Array.isArray(lines) ? lines.join('\n') : lines;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function recordLines(record: Record<string, string>): string[] {
  return Object.entries(record)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}: ${v}`);
}

/** Order number: SA-YYMM-nnnn. Random, not sequential: it identifies an order
    in an email, it is not an invoice number. */
export function orderRef(now = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `SA-${yy}${mm}-${n}`;
}

/** Hands the visitor a text file to keep: the durable copy of what they sent. */
export function saveText(filename: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function stamp(lang: string, when = new Date()): {date: string; time: string; iso: string} {
  const loc = lang === 'de' ? 'de-AT' : 'en-GB';
  return {
    date: when.toLocaleDateString(loc, {day: '2-digit', month: '2-digit', year: 'numeric'}),
    time: when.toLocaleTimeString(loc, {hour: '2-digit', minute: '2-digit', timeZoneName: 'short'}),
    iso: when.toISOString(),
  };
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
