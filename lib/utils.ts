/**
 * Formatting and money maths for a DACH consumer shop.
 *
 * Two rules drive everything in this file.
 *
 * 1. Consumer prices in the EU are gross. Value added tax is contained in the price
 *    and is shown as an included amount, never added on top at the end.
 * 2. The Preisangabenverordnung requires a base price next to the selling price for
 *    goods sold by volume or weight. The reference quantity is one litre or one
 *    kilogram, with the permitted exception that packs below 250 ml or 250 g may use
 *    100 ml or 100 g. computeBasePrice implements exactly that.
 */

import {
  CHF_PER_EUR,
  REGIONS,
  type CurrencyCode,
  type Region,
  type RegionCode,
} from "@/config/site";
import type { NetQuantity, Product } from "@/config/products";

/** Join class names, skipping anything falsy. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ currency */

export type MoneyLang = "de" | "en";

const MONEY_LOCALE: Record<MoneyLang, Record<CurrencyCode, string>> = {
  de: { EUR: "de-DE", CHF: "de-CH" },
  en: { EUR: "en-IE", CHF: "en-CH" },
};

/** Format minor units of the given currency, for example 8900 EUR cents to "89,00 €" or "€89.00". */
export function formatMoney(
  minorUnits: number,
  currency: CurrencyCode = "EUR",
  lang: MoneyLang = "de",
): string {
  return new Intl.NumberFormat(MONEY_LOCALE[lang][currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
}

/**
 * Convert euro cents into the minor units of a region currency.
 * The rate is indicative and lives in config/site.ts, a production shop takes it
 * from the payment provider on the day of the order.
 */
export function toRegionMinorUnits(eurCents: number, region: RegionCode): number {
  const target = REGIONS[region].currency;
  if (target === "EUR") return Math.round(eurCents);
  return Math.round(eurCents * CHF_PER_EUR);
}

export function formatForRegion(eurCents: number, region: RegionCode, lang: MoneyLang = "de"): string {
  return formatMoney(toRegionMinorUnits(eurCents, region), REGIONS[region].currency, lang);
}

/* ---------------------------------------------------------------- PAngV maths */

export interface BasePrice {
  /** Price per reference quantity, in the same minor units that were passed in. */
  perReferenceMinorUnits: number;
  /** 100 or 1000. */
  referenceValue: number;
  /** "100 ml", "100 g", "1 l" or "1 kg". */
  referenceLabel: string;
}

/**
 * Threshold below which the reduced reference quantity of 100 ml or 100 g may be used.
 * Packs at or above it are quoted per litre or per kilogram.
 */
const SMALL_PACK_THRESHOLD = 250;

export function computeBasePrice(
  grossMinorUnits: number,
  netQuantity: NetQuantity | null,
): BasePrice | null {
  if (!netQuantity || netQuantity.value <= 0) return null;

  const small = netQuantity.value < SMALL_PACK_THRESHOLD;
  const referenceValue = small ? 100 : 1000;
  const referenceLabel = small
    ? `100 ${netQuantity.unit}`
    : netQuantity.unit === "ml"
      ? "1 l"
      : "1 kg";

  return {
    perReferenceMinorUnits: Math.round((grossMinorUnits / netQuantity.value) * referenceValue),
    referenceValue,
    referenceLabel,
  };
}

/** The full Grundpreis line, for example "108,00 € / 100 ml". Null when not required. */
export function formatBasePrice(
  product: Product,
  region: RegionCode,
  lang: MoneyLang = "de",
): string | null {
  const base = computeBasePrice(
    toRegionMinorUnits(product.priceCents, region),
    product.netQuantity,
  );
  if (!base) return null;
  return `${formatMoney(base.perReferenceMinorUnits, REGIONS[region].currency, lang)} / ${base.referenceLabel}`;
}

/* --------------------------------------------------------------------- taxes */

/** Value added tax contained in a gross amount. */
export function vatIncludedInGross(grossMinorUnits: number, vatRate: number): number {
  return Math.round(grossMinorUnits - grossMinorUnits / (1 + vatRate));
}

export function netFromGross(grossMinorUnits: number, vatRate: number): number {
  return grossMinorUnits - vatIncludedInGross(grossMinorUnits, vatRate);
}

/* ----------------------------------------------------------------- order maths */

export interface OrderLine {
  product: Product;
  quantity: number;
}

export interface OrderEstimate {
  currency: CurrencyCode;
  region: Region;
  /** Goods value in region minor units, gross. */
  subtotal: number;
  shipping: number;
  /** Customs clearance, zero inside the EU. */
  clearance: number;
  total: number;
  /** Tax already contained in the total. */
  vatIncluded: number;
  /** Amount still missing for free shipping, zero once it is reached. */
  freeShippingGap: number;
  freeShippingReached: boolean;
  itemCount: number;
}

export function estimateOrder(lines: OrderLine[], regionCode: RegionCode): OrderEstimate {
  const region = REGIONS[regionCode];

  const subtotal = lines.reduce(
    (sum, line) => sum + toRegionMinorUnits(line.product.priceCents, regionCode) * line.quantity,
    0,
  );
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const freeShippingReached = subtotal >= region.freeShippingCents;
  const shipping = itemCount === 0 || freeShippingReached ? 0 : region.shippingCents;
  const clearance = itemCount === 0 ? 0 : (region.customs?.clearanceCents ?? 0);
  const total = subtotal + shipping + clearance;

  return {
    currency: region.currency,
    region,
    subtotal,
    shipping,
    clearance,
    total,
    vatIncluded: vatIncludedInGross(total, region.vatRate),
    freeShippingGap: freeShippingReached ? 0 : Math.max(0, region.freeShippingCents - subtotal),
    freeShippingReached,
    itemCount,
  };
}

/** Progress towards free shipping, between 0 and 1, for the threshold meter. */
export function freeShippingProgress(subtotal: number, region: Region): number {
  if (region.freeShippingCents <= 0) return 1;
  return Math.max(0, Math.min(1, subtotal / region.freeShippingCents));
}

/** Delivery promise such as "1 bis 2 Werktage" or "1 to 2 working days". */
export function deliveryWindow(region: Region, lang: MoneyLang = "de"): string {
  const [from, to] = region.deliveryDays;
  if (lang === "en") return from === to ? `${from} working day` : `${from} to ${to} working days`;
  return from === to ? `${from} Werktag` : `${from} bis ${to} Werktage`;
}

/** Stable, human readable order reference. No randomness, so server and client agree. */
export function orderReference(seed: number): string {
  const base = Math.abs(Math.trunc(seed)).toString(36).toUpperCase().padStart(6, "0");
  return `JING-${base.slice(-6)}`;
}
