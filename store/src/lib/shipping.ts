/* Flat shipping rates by region from site.json (commerce.shipping). */
import type {Site} from './types';

export const PICKUP = '__pickup';
export const OTHER = '__row';

export interface CountryOption {
  value: string;
  label: string;
}

export function countryOptions(site: Site, labels: {pickup: string; other: string}): CountryOption[] {
  const cc = site.commerce?.shipping?.countries || {};
  const seen = new Set<string>();
  const out: CountryOption[] = [{value: PICKUP, label: labels.pickup}];
  const push = (name?: string) => {
    if (name && !seen.has(name)) {
      seen.add(name);
      out.push({value: name, label: name});
    }
  };
  push(cc.AT?.[0]);
  (cc.EU || []).forEach(push);
  push(cc.UK?.[0]);
  push(cc.CH?.[0]);
  push(cc.US?.[0]);
  out.push({value: OTHER, label: labels.other});
  return out;
}

/** Shipping in the shop currency, or null while no country is chosen. */
export function shippingFor(site: Site, country: string, kind: 'original' | 'print'): number | null {
  if (!country) return null;
  if (country === PICKUP) return 0;
  const shipping = site.commerce?.shipping || {};
  const rates = shipping.rates || {};
  let region = 'ROW';
  if (country !== OTHER) {
    for (const [r, list] of Object.entries(shipping.countries || {})) {
      if (list.includes(country)) {
        region = r;
        break;
      }
    }
  }
  const rate = rates[region] || rates.ROW || {print: 0, original: 0};
  return kind === 'print' ? rate.print : rate.original;
}
