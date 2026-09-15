/**
 * Store metadata, regional tax and shipping rules for the DACH market.
 *
 * Every figure here is configuration, not law. Rates and thresholds are the ones
 * in force at the time of writing and must be confirmed with a tax adviser before
 * the shop goes live. See README.md, section "Was vor dem Livegang zu prüfen ist".
 */

export type CurrencyCode = "EUR" | "CHF";
export type RegionCode = "DE" | "AT" | "CH";

export type PaymentMethodId =
  | "klarna"
  | "eps"
  | "twint"
  | "applepay"
  | "paypal"
  | "sepa"
  | "card";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  /** Short line shown under the badge in the checkout. */
  note: string;
  /** Regions where the method is offered. */
  regions: RegionCode[];
}

export interface Region {
  code: RegionCode;
  label: string;
  currency: CurrencyCode;
  /** Standard rate of value added tax applied to cosmetics in this region. */
  vatRate: number;
  vatLabel: string;
  /** Flat shipping in the region currency, in minor units. */
  shippingCents: number;
  /** Order value from which shipping is free, in minor units of the region currency. */
  freeShippingCents: number;
  carrier: string;
  deliveryDays: [number, number];
  /** Customs handling, set for regions outside the EU customs union. */
  customs?: {
    /** Per parcel clearance fee charged by the carrier, in minor units. */
    clearanceCents: number;
    incoterm: "DDP";
    note: string;
  };
  paymentMethods: PaymentMethodId[];
}

export const REGIONS: Record<RegionCode, Region> = {
  DE: {
    code: "DE",
    label: "Deutschland",
    currency: "EUR",
    vatRate: 0.19,
    vatLabel: "19 % MwSt.",
    shippingCents: 490,
    freeShippingCents: 7500,
    carrier: "DHL GoGreen",
    deliveryDays: [1, 2],
    paymentMethods: ["klarna", "paypal", "applepay", "sepa", "card"],
  },
  AT: {
    code: "AT",
    label: "Österreich",
    currency: "EUR",
    vatRate: 0.2,
    vatLabel: "20 % USt.",
    shippingCents: 790,
    freeShippingCents: 9000,
    carrier: "Österreichische Post",
    deliveryDays: [2, 3],
    paymentMethods: ["eps", "klarna", "paypal", "applepay", "sepa", "card"],
  },
  CH: {
    code: "CH",
    label: "Schweiz",
    currency: "CHF",
    vatRate: 0.081,
    vatLabel: "8,1 % MWST",
    shippingCents: 1490,
    freeShippingCents: 15000,
    carrier: "Swiss Post, verzollt",
    deliveryDays: [2, 4],
    customs: {
      clearanceCents: 1100,
      incoterm: "DDP",
      note:
        "Die Schweiz liegt ausserhalb der EU-Zollunion. Wir versenden verzollt und versteuert, " +
        "Zollabfertigung und Einfuhrsteuer sind im angezeigten Preis enthalten. An der Haustür " +
        "entstehen keine weiteren Kosten.",
    },
    paymentMethods: ["twint", "card", "applepay", "paypal"],
  },
};

export const REGION_ORDER: RegionCode[] = ["DE", "AT", "CH"];
export const DEFAULT_REGION: RegionCode = "DE";

export const PAYMENT_METHODS: Record<PaymentMethodId, PaymentMethod> = {
  klarna: {
    id: "klarna",
    label: "Klarna",
    note: "Rechnung oder Ratenkauf",
    regions: ["DE", "AT"],
  },
  eps: {
    id: "eps",
    label: "EPS",
    note: "Österreichisches Online-Banking",
    regions: ["AT"],
  },
  twint: {
    id: "twint",
    label: "TWINT",
    note: "Schweizer Mobile Payment",
    regions: ["CH"],
  },
  applepay: {
    id: "applepay",
    label: "Apple Pay",
    note: "Zahlung in zwei Schritten",
    regions: ["DE", "AT", "CH"],
  },
  paypal: {
    id: "paypal",
    label: "PayPal",
    note: "Käuferschutz inklusive",
    regions: ["DE", "AT", "CH"],
  },
  sepa: {
    id: "sepa",
    label: "SEPA-Lastschrift",
    note: "Einzug nach Versand",
    regions: ["DE", "AT"],
  },
  card: {
    id: "card",
    label: "Karte",
    note: "Visa, Mastercard, Amex",
    regions: ["DE", "AT", "CH"],
  },
};

/**
 * Indicative conversion used for display only. A production shop pulls this from
 * its payment provider on the day of the order and states the source in the terms.
 */
export const CHF_PER_EUR = 0.94;

export const SITE = {
  name: "JING",
  claim: "Duality in Daily Rituals",
  description:
    "JING kuratiert ostasiatische Kosmetik und moderne Duftobjekte. Zwei Kollektionen, " +
    "ein Prinzip: YANG für den Tag, YIN für die Nacht.",
  locale: "de-DE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jing.example",
  email: "service@jing.example",
  /** Placeholders. Replace before the shop is reachable in public. */
  legalEntity: {
    company: "JING Retail GmbH",
    representative: "[Vor- und Nachname der Geschäftsführung]",
    street: "[Straße und Hausnummer]",
    zipCity: "[PLZ] [Ort]",
    country: "Deutschland",
    register: "[Amtsgericht], HRB [Nummer]",
    vatId: "[USt-IdNr. DE000000000]",
    supervisoryAuthority: "[Zuständige Aufsichtsbehörde]",
    phone: "[Telefonnummer]",
  },
  warehouse: {
    city: "Venlo",
    country: "Niederlande",
    note:
      "Zentrallager an der deutsch-niederländischen Grenze. Von dort erreichen wir " +
      "Deutschland in 1 bis 2, Österreich in 2 bis 3 Werktagen.",
  },
  ritualWindow: {
    yang: "06:00 bis 18:00",
    yin: "18:00 bis 06:00",
  },
} as const;

/**
 * Producer and responsible person, as the General Product Safety Regulation
 * (EU) 2023/988 requires them to be shown with every online offer since
 * 13 December 2024, and as Regulation (EC) 1223/2009 requires for cosmetics.
 * For a private label range these are the shop's own entity. Placeholders again.
 */
export const RESPONSIBLE_PERSON = {
  role: "Verantwortliche Person und Hersteller im Sinne der EU-Produktsicherheitsverordnung",
  company: "JING Retail GmbH",
  street: "[Straße und Hausnummer]",
  zipCity: "[PLZ] [Ort]",
  country: "Deutschland",
  email: "sicherheit@jing.example",
  note:
    "Für kosmetische Mittel ist dieselbe Stelle die verantwortliche Person nach Artikel 4 " +
    "der Verordnung (EG) Nr. 1223/2009. Die Produktinformationsdatei wird dort zehn Jahre " +
    "aufbewahrt und ist den Marktüberwachungsbehörden auf Verlangen zugänglich.",
} as const;

export const WITHDRAWAL_DAYS = 14;
