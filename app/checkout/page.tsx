"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { PackagingViewer } from "@/components/product/packaging-viewer";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Button, buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FIELD_INPUT, FIELD_LABEL } from "@/components/ui/field";
import { localizeProduct } from "@/config/products";
import {
  PAYMENT_METHODS,
  REGIONS,
  REGION_ORDER,
  WITHDRAWAL_DAYS,
  type PaymentMethodId,
  type RegionCode,
  type CurrencyCode,
} from "@/config/site";
import { intlLocale, useLang, useT, type Text } from "@/lib/i18n";
import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { resolveLines, selectEstimate, useJingStore } from "@/lib/store";
import {
  cn,
  deliveryWindow,
  formatBasePrice,
  formatForRegion,
  formatMoney,
  orderReference,
  toRegionMinorUnits,
} from "@/lib/utils";

const SHELL = "mx-auto min-h-svh w-full max-w-[1240px] px-4 pb-[var(--space-section)] pt-8 sm:px-6 sm:pt-12";

/** The Swiss customs note in English. The German original lives in config/site.ts. */
const CUSTOMS_NOTE_EN =
  "Switzerland lies outside the EU customs union. We ship duty and tax paid. " +
  "Import tax is included in the price, and customs clearance is shown above as " +
  "a separate line. There are no further costs at the door.";

/**
 * Section 312j Abs. 2 BGB wants the essential characteristics, the total, the
 * shipping cost and the delivery window immediately before the order button.
 * The same block therefore renders twice: inside the form above the button on
 * narrow screens, and in the sticky aside from lg upwards.
 */
function OrderSummary({
  idSuffix,
  lines,
  region,
  currency,
  estimate,
  regionConfig,
}: {
  idSuffix: string;
  lines: ReturnType<typeof resolveLines>;
  region: RegionCode;
  currency: CurrencyCode;
  estimate: ReturnType<typeof selectEstimate>;
  regionConfig: (typeof REGIONS)[RegionCode];
}) {
  const lang = useLang();
  const t = useT();
  // The carrier is a name; only its Swiss suffix is a German word.
  const carrier = t({ de: regionConfig.carrier, en: regionConfig.carrier.replace("verzollt", "duty paid") });
  // vatLabel is the regional German wording, English states the rate and says VAT.
  const vatLabel = t({
    de: regionConfig.vatLabel,
    en: `${new Intl.NumberFormat(intlLocale("en", currency)).format(regionConfig.vatRate * 100)}% VAT`,
  });

  return (
            <div className="border border-line bg-surface-2 p-5 sm:p-6">
              <h2 id={`zusammenfassung-${idSuffix}`} className="type-kicker text-ink-3">
                {t({ de: "Bestellübersicht", en: "Order summary" })}
              </h2>

              <ul className="mt-4">
                {lines.map((line) => {
                  const product = localizeProduct(line.product, lang);
                  const { quantity } = line;
                  const basePrice = formatBasePrice(product, region, lang);
                  const lineTotal = toRegionMinorUnits(product.priceCents, region) * quantity;

                  return (
                    <li key={product.id} className="flex gap-3 border-b border-line py-3 first:border-t">
                      <div className="w-11 shrink-0">
                        <PackagingViewer product={product} compact />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="type-label text-ink-3">{product.code}</p>
                        <p className="mt-0.5 font-display text-[15px] leading-tight text-ink">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-ink-2">
                          {product.unitsLabel}
                        </p>
                        <p className="mt-1 font-mono text-[11px] tabular-nums text-ink-3">
                          {quantity} × {formatForRegion(product.priceCents, region, lang)}
                        </p>
                        {basePrice ? (
                          <p className="font-mono text-[11px] tabular-nums text-ink-3">
                            {t({ de: `Grundpreis ${basePrice}`, en: `Base price ${basePrice}` })}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 font-mono text-[13px] tabular-nums text-ink">
                        {formatMoney(lineTotal, currency, lang)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-4 flex flex-col gap-2 text-[13px]">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-2">{t({ de: "Zwischensumme", en: "Subtotal" })}</dt>
                  <dd className="font-mono tabular-nums text-ink">
                    {formatMoney(estimate.subtotal, currency, lang)}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-2">
                    {t({ de: "Versand", en: "Shipping" })}
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">
                      {carrier}, {deliveryWindow(regionConfig, lang)}
                    </span>
                  </dt>
                  <dd className="font-mono tabular-nums text-ink">
                    {estimate.shipping === 0
                      ? t({ de: "kostenfrei", en: "free" })
                      : formatMoney(estimate.shipping, currency, lang)}
                  </dd>
                </div>

                {estimate.clearance > 0 ? (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-2">
                      {t({ de: "Zollabfertigung", en: "Customs clearance" })}
                      <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">
                        {regionConfig.customs?.incoterm ?? "DDP"}
                        {t({ de: ", verzollt und versteuert", en: ", duty and tax paid" })}
                      </span>
                    </dt>
                    <dd className="font-mono tabular-nums text-ink">
                      {formatMoney(estimate.clearance, currency, lang)}
                    </dd>
                  </div>
                ) : null}

                <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <dt className="type-nav text-ink">{t({ de: "Gesamt", en: "Total" })}</dt>
                  <dd className="font-mono text-[17px] tabular-nums text-ink">
                    {formatMoney(estimate.total, currency, lang)}
                  </dd>
                </div>
              </dl>

              <p className="mt-2 text-[11px] leading-snug text-ink-3">
                {t({
                  de: `Darin enthalten ${formatMoney(estimate.vatIncluded, currency, lang)} bei ${vatLabel}.`,
                  en: `Includes ${formatMoney(estimate.vatIncluded, currency, lang)} at ${vatLabel}.`,
                })}
              </p>
              <p className="text-[11px] leading-snug text-ink-3">
                {regionConfig.customs
                  ? t({
                      de: "Gesamtpreis inklusive Steuer, Versand und Zollabfertigung.",
                      en: "Total price including tax, shipping and customs clearance.",
                    })
                  : t({
                      de: "Gesamtpreis inklusive Steuer und Versandkosten.",
                      en: "Total price including tax and shipping costs.",
                    })}
              </p>
              {regionConfig.customs ? (
                <p className="mt-2 text-[11px] leading-snug text-ink-3">
                  {t({ de: regionConfig.customs.note, en: CUSTOMS_NOTE_EN })}
                </p>
              ) : null}

              <Link
                href="/cart"
                className="type-nav jing-underline mt-4 inline-block pb-0.5 text-ink-2 transition-colors hover:text-ink"
              >
                {t({ de: "Warenkorb ändern", en: "Edit cart" })}
              </Link>
            </div>
  );
}


type FieldName =
  | "firstName"
  | "lastName"
  | "company"
  | "email"
  | "street"
  | "addition"
  | "zip"
  | "city"
  | "phone";

interface FieldSpec {
  name: FieldName;
  label: Text;
  type: "text" | "email" | "tel";
  autoComplete: string;
  required: boolean;
  /** Field takes the full width of the two column form grid. */
  wide?: boolean;
  hint?: Text;
}

/** Digits a postcode has per delivery country, with the wording shown to the buyer. */
const ZIP_RULES: Record<RegionCode, { digits: number; hint: Text; example: string }> = {
  DE: {
    digits: 5,
    hint: { de: "Fünf Ziffern, zum Beispiel 10115", en: "Five digits, for example 10115" },
    example: "10115",
  },
  AT: {
    digits: 4,
    hint: { de: "Vier Ziffern, zum Beispiel 1010", en: "Four digits, for example 1010" },
    example: "1010",
  },
  CH: {
    digits: 4,
    hint: { de: "Vier Ziffern, zum Beispiel 8001", en: "Four digits, for example 8001" },
    example: "8001",
  },
};

const FIELDS: FieldSpec[] = [
  {
    name: "firstName",
    label: { de: "Vorname", en: "First name" },
    type: "text",
    autoComplete: "given-name",
    required: true,
  },
  {
    name: "lastName",
    label: { de: "Nachname", en: "Last name" },
    type: "text",
    autoComplete: "family-name",
    required: true,
  },
  {
    name: "email",
    label: { de: "E-Mail", en: "Email" },
    type: "email",
    autoComplete: "email",
    required: true,
    wide: true,
    hint: {
      de: "An diese Adresse ginge im Echtbetrieb die Bestellbestätigung.",
      en: "In live operation the order confirmation would go to this address.",
    },
  },
  {
    name: "company",
    label: { de: "Firma, optional", en: "Company, optional" },
    type: "text",
    autoComplete: "organization",
    required: false,
    wide: true,
  },
  {
    name: "street",
    label: { de: "Straße und Hausnummer", en: "Street and number" },
    type: "text",
    autoComplete: "street-address",
    required: true,
    wide: true,
  },
  {
    name: "addition",
    label: { de: "Adresszusatz, optional", en: "Address line 2, optional" },
    type: "text",
    autoComplete: "address-line2",
    required: false,
    wide: true,
  },
  {
    name: "zip",
    label: { de: "PLZ", en: "Postcode" },
    type: "text",
    autoComplete: "postal-code",
    required: true,
  },
  {
    name: "city",
    label: { de: "Ort", en: "Town" },
    type: "text",
    autoComplete: "address-level2",
    required: true,
  },
  {
    name: "phone",
    label: { de: "Telefon, optional", en: "Phone, optional" },
    type: "tel",
    autoComplete: "tel",
    required: false,
    wide: true,
    hint: { de: "Nur für Rückfragen des Zustellers.", en: "Only for queries from the courier." },
  },
];

interface CheckoutSession {
  reference: string;
  redirectUrl: string | null;
  status: string | null;
  /** Resolved to a label at render, so the confirmation follows a language switch. */
  method: PaymentMethodId;
  /** Region minor units, formatted at render for the same reason. */
  amountMinor: number;
  currency: CurrencyCode;
  email: string;
}

/* ----------------------------------------------------------- response reading */

/*
 * The checkout route answers with a mock session. Its field names are read
 * defensively so a rename on the server surfaces as an error message in the
 * page instead of an empty confirmation panel.
 */
const REFERENCE_KEYS = ["reference", "orderReference", "order_reference", "id", "sessionId"];
const REDIRECT_KEYS = ["redirectUrl", "redirect_url", "redirect", "checkoutUrl", "url"];
const ERROR_KEYS = ["error", "message", "detail", "reason"];

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function readString(source: Record<string, unknown> | null, keys: string[]): string | null {
  if (!source) return null;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return null;
}

function payloadParts(payload: unknown): {
  root: Record<string, unknown> | null;
  nested: Record<string, unknown> | null;
} {
  const root = asRecord(payload);
  const nested = asRecord(root?.session) ?? asRecord(root?.order) ?? asRecord(root?.data);
  return { root, nested };
}

/** A server message has one wording only; it is shown as it came in both languages. */
function plain(message: string): Text {
  return { de: message, en: message };
}

export default function CheckoutPage() {
  const { region, setRegion, hydrated } = useYinYang();
  const lang = useLang();
  const t = useT();
  const items = useJingStore((state) => state.items);
  const clearCart = useJingStore((state) => state.clearCart);

  const [method, setMethod] = useState<PaymentMethodId | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Text | null>(null);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  // Per field messages, so a rejected order says what is wrong and where, and
  // says it in the page rather than in a native bubble that no screen reader
  // announces and that vanishes on the next click. Kept as language pairs and
  // resolved at render, so they follow a language switch.
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, Text>>>({});
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion() === true;

  // Both helpers build a fresh object on every call, so they may never be used as
  // store selectors. Memoised here they stay stable between renders.
  const lines = useMemo(() => resolveLines(items), [items]);
  const estimate = useMemo(() => selectEstimate({ items, region }), [items, region]);

  // The form is gone once the order lands, so focus has to be handed to the
  // confirmation. Without this it falls to the body and a screen reader user is
  // left on a page that silently changed under them.
  useEffect(() => {
    if (session) confirmationRef.current?.focus();
  }, [session]);

  // The region decides which methods exist, the method stays authoritative about
  // where it may be offered.
  const methods = useMemo(
    () =>
      REGIONS[region].paymentMethods
        .map((id) => PAYMENT_METHODS[id])
        .filter((entry) => entry.regions.includes(region)),
    [region],
  );

  // A stored method that the new region does not offer falls back to the first one,
  // which keeps the radio group valid without an effect.
  const selected = useMemo(() => {
    if (method && methods.some((entry) => entry.id === method)) return method;
    return methods.length > 0 ? methods[0].id : null;
  }, [method, methods]);

  // A chosen method that the new delivery country does not offer is replaced
  // silently by the fallback above. The buyer is told instead of finding a
  // different method preselected without explanation.
  const droppedMethod = useMemo(
    () => (method && !methods.some((entry) => entry.id === method) ? method : null),
    [method, methods],
  );

  // No dates and no randomness in render. The fallback reference comes from the cart.
  const seed = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          item.quantity * 977 +
          Array.from(item.productId).reduce((acc, char) => acc + char.charCodeAt(0), 0),
        estimate.total,
      ),
    [items, estimate.total],
  );

  // Stored values may not reach the first client render, otherwise the markup differs.
  if (!hydrated) {
    return (
      <div className={SHELL} aria-busy="true">
        <h1 className="type-display text-ink">{t({ de: "Kasse", en: "Checkout" })}</h1>
        <span aria-hidden="true" className="mt-4 block h-px w-24 bg-line-2 [animation:jing-breathe_1.4s_ease-in-out_infinite]" />
        <p className="type-nav mt-4 text-ink-3">
          {t({ de: "Bestellung wird geladen", en: "Loading the order" })}
        </p>
      </div>
    );
  }

  const regionConfig = estimate.region;
  const currency = estimate.currency;
  const regionLabel = t({ de: regionConfig.label, en: regionConfig.labelEn });
  const methodLabel = (id: PaymentMethodId) =>
    t({ de: PAYMENT_METHODS[id].label, en: PAYMENT_METHODS[id].labelEn });

  if (lines.length === 0 && !session) {
    return (
      <div className={SHELL}>
        <h1 className="type-display text-ink">{t({ de: "Kasse", en: "Checkout" })}</h1>
        <EmptyState
          className="mt-10"
          title={t({ de: "Nichts zu bezahlen", en: "Nothing to pay" })}
          text={t({
            de:
              "Der Warenkorb ist leer, deshalb gibt es hier nichts zu bezahlen. Leg zuerst etwas ab, " +
              "danach führt der Weg zurück an diese Stelle.",
            en:
              "The cart is empty, so there is nothing to pay here. Add something first, then the " +
              "way leads back to this point.",
          })}
          actions={
            <>
              <Link href="/" className={buttonClasses("solid", "md")}>
                {t({ de: "Zur Kollektion", en: "To the collection" })}
              </Link>
              <Link href="/cart" className={buttonClasses("outline", "md")}>
                {t({ de: "Warenkorb ansehen", en: "View cart" })}
              </Link>
            </>
          }
        />
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    // Read the form before the first await, the element is gone once the panel swaps.
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");

    const problems: Record<string, Text> = {};
    for (const field of FIELDS) {
      if (!field.required) continue;
      if (String(data.get(field.name) ?? "").trim()) continue;
      problems[field.name] = {
        de: `Bitte ${field.label.de} ausfüllen.`,
        en: `Please enter your ${field.label.en.toLowerCase()}.`,
      };
    }
    if (!problems.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      problems.email = {
        de: "Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.",
        en: "This does not look like an email address.",
      };
    }
    const zip = String(data.get("zip") ?? "").trim();
    const zipRule = ZIP_RULES[region];
    if (!problems.zip && zip && !new RegExp(`^[0-9]{${zipRule.digits}}$`).test(zip)) {
      problems.zip = {
        de: `Die PLZ für ${regionConfig.label} hat ${zipRule.digits} Ziffern, zum Beispiel ${zipRule.example}.`,
        en: `The postcode for ${regionConfig.labelEn} has ${zipRule.digits} digits, for example ${zipRule.example}.`,
      };
    }
    if (!accepted) {
      problems.agb = {
        de: "Bitte bestätige zuerst die AGB.",
        en: "Please accept the terms and conditions first.",
      };
    }
    if (!selected) {
      problems.method = {
        de: "Bitte wähle eine Zahlungsart.",
        en: "Please choose a payment method.",
      };
    }

    setFieldErrors(problems);

    const first = Object.keys(problems)[0];
    if (first) {
      const count = Object.keys(problems).length;
      setError(
        count === 1
          ? problems[first]
          : {
              de: `Die Bestellung ist noch nicht vollständig, ${count} Angaben fehlen oder stimmen nicht.`,
              en: `The order is not complete yet, ${count} details are missing or incorrect.`,
            },
      );
      const target = form.querySelector<HTMLElement>(
        first === "agb" ? "#feld-agb" : first === "method" ? "[name='zahlungsart']" : `[name='${first}']`,
      );
      // Under the sticky header a focused field can sit hidden behind it, so it
      // is centred first. The scroll is instant where motion is not wanted.
      target?.scrollIntoView({
        block: "center",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      target?.focus({ preventScroll: true });
      return;
    }

    if (!selected) return;

    setPending(true);
    setError(null);

    // The static demo has no server. Its mock session comes from the same
    // estimateOrder the summary uses, so the figures cannot disagree, and the
    // reference is derived the same way the route derives it. The real build
    // never takes this branch: the amount is recomputed server side there.
    if (process.env.NEXT_PUBLIC_JING_STATIC_DEMO === "1") {
      clearCart();
      setSession({
        reference: orderReference(seed),
        redirectUrl: null,
        status: "demo",
        method: selected,
        amountMinor: estimate.total,
        currency,
        email,
      });
      setPending(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The resolved lines, not the raw persisted items: the summary, every
        // total and the amount on the button are all computed from these, so
        // the order must be placed for exactly the same basket.
        body: JSON.stringify({
          items: lines.map((line) => ({
            productId: line.product.id,
            quantity: line.quantity,
          })),
          region,
          method: selected,
        }),
      });

      const payload: unknown = await response.json().catch(() => null);
      const { root, nested } = payloadParts(payload);

      if (!response.ok) {
        const serverMessage = readString(nested, ERROR_KEYS) ?? readString(root, ERROR_KEYS);
        setError(
          serverMessage
            ? plain(serverMessage)
            : {
                de: `Die Bestellung konnte nicht angelegt werden, die Zahlungsstelle antwortete mit Status ${response.status}.`,
                en: `The order could not be created, the payment gateway answered with status ${response.status}.`,
              },
        );
        return;
      }

      const reference =
        readString(nested, REFERENCE_KEYS) ??
        readString(root, REFERENCE_KEYS) ??
        orderReference(seed);

      // The order exists now. Leaving the basket filled invites a second,
      // identical order and makes the header badge lie about what is pending.
      clearCart();

      setSession({
        reference,
        redirectUrl: readString(nested, REDIRECT_KEYS) ?? readString(root, REDIRECT_KEYS),
        status: readString(nested, ["status"]) ?? readString(root, ["status"]),
        method: selected,
        amountMinor: estimate.total,
        currency,
        email,
      });
    } catch {
      setError({
        de: "Die Zahlungsstelle war nicht erreichbar. Bitte prüfe deine Verbindung und versuche es noch einmal.",
        en: "The payment gateway could not be reached. Please check your connection and try again.",
      });
    } finally {
      setPending(false);
    }
  }

  const errorText = error ? t(error) : "";

  return (
    <div className={SHELL}>
      <header>
        <p className="type-kicker text-ink-3">{t({ de: "Schritt 2", en: "Step 2" })}</p>
        <h1 className="type-display mt-3 text-ink">{t({ de: "Kasse", en: "Checkout" })}</h1>
        <p className="type-body mt-3 max-w-[54ch] text-ink-2">
          {t({
            de:
              "Diese Kasse ist eine Demonstration. Es wird keine Zahlung ausgelöst und keine Adresse " +
              "gespeichert, die Bestellung legt nur eine Mock-Session an.",
            en:
              "This checkout is a demonstration. No payment is triggered and no address is stored, " +
              "the order only creates a mock session.",
          })}
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <div>
          {session ? (
            <section
              aria-labelledby="bestaetigung-titel"
              role="status"
              aria-live="polite"
              className="border border-line bg-surface-2 p-5 sm:p-7"
            >
              <p className="type-kicker inline-flex items-center gap-2 text-ink-3">
                <Check size={14} aria-hidden="true" />
                {t({ de: "Session angelegt", en: "Session created" })}
              </p>
              <h2
                id="bestaetigung-titel"
                ref={confirmationRef}
                tabIndex={-1}
                className="mt-3 font-display text-3xl leading-tight text-ink"
              >
                {t({ de: "Danke, die Bestellung steht bereit.", en: "Thank you, the order is ready." })}
              </h2>
              <p className="type-body mt-3 max-w-[50ch] text-ink-2">
                {t({
                  de:
                    "Die Zahlungsstelle hat eine Mock-Session erzeugt. In einem echten Shop würde die " +
                    "Weiterleitung jetzt zum Zahlungsanbieter führen, hier bleibt alles an Ort und " +
                    "Stelle. Es wurde nichts abgebucht.",
                  en:
                    "The payment gateway has created a mock session. In a real shop you would now be " +
                    "redirected to the payment provider, here everything stays in place. Nothing has " +
                    "been charged.",
                })}
              </p>

              <dl className="mt-6 flex flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>{t({ de: "Referenz", en: "Reference" })}</dt>
                  <dd className="font-mono text-[15px] tabular-nums text-ink">
                    {session.reference}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>{t({ de: "Weiterleitung, simuliert", en: "Redirect, simulated" })}</dt>
                  <dd className="break-all text-right font-mono text-[12px] text-ink-2">
                    {session.redirectUrl ??
                      t({ de: "Keine Weiterleitung übermittelt", en: "No redirect provided" })}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>{t({ de: "Zahlungsart", en: "Payment method" })}</dt>
                  <dd className="text-[14px] text-ink">{methodLabel(session.method)}</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>{t({ de: "Betrag", en: "Amount" })}</dt>
                  <dd className="font-mono text-[14px] tabular-nums text-ink">
                    {formatMoney(session.amountMinor, session.currency, lang)}
                  </dd>
                </div>
                {session.status ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                    <dt className={FIELD_LABEL}>Status</dt>
                    <dd className="font-mono text-[13px] text-ink-2">{session.status}</dd>
                  </div>
                ) : null}
                {session.email ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-y border-line py-3">
                    <dt className={FIELD_LABEL}>{t({ de: "E-Mail, angegeben", en: "Email, as entered" })}</dt>
                    <dd className="break-all text-right text-[14px] text-ink-2">{session.email}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/" className={buttonClasses("solid", "md")}>
                  {t({ de: "Weiter stöbern", en: "Keep browsing" })}
                </Link>
                <Link href="/cart" className={buttonClasses("outline", "md")}>
                  {t({ de: "Warenkorb ansehen", en: "View cart" })}
                </Link>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <section aria-labelledby="adresse-titel">
                <h2 id="adresse-titel" className="type-kicker text-ink-3">
                  {t({ de: "Lieferadresse", en: "Delivery address" })}
                </h2>
                <p className="type-meta mt-2 text-ink-3">
                  {t({
                    de: "Pflichtfelder sind mit einem Stern",
                    en: "Required fields are marked with an asterisk",
                  })}
                  <span aria-hidden="true"> *</span>
                  {t({ de: " markiert.", en: "." })}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {FIELDS.map((field) => {
                    const id = `feld-${field.name}`;
                    const isZip = field.name === "zip";
                    const hint = isZip ? ZIP_RULES[region].hint : field.hint;
                    const hintId = hint ? `${id}-hinweis` : undefined;
                    const fieldError = fieldErrors[field.name];
                    const errorId = fieldError ? `${id}-fehler` : undefined;

                    return (
                      <Field
                        key={field.name}
                        id={id}
                        className={field.wide ? "sm:col-span-2" : undefined}
                        label={
                          <>
                            {t(field.label)}
                            {field.required ? (
                              <>
                                <span aria-hidden="true"> *</span>
                                <span className="sr-only">{t({ de: ", Pflichtfeld", en: ", required" })}</span>
                              </>
                            ) : null}
                          </>
                        }
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        required={field.required}
                        aria-required={field.required}
                        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
                        aria-invalid={fieldError ? true : undefined}
                        inputMode={isZip ? "numeric" : undefined}
                        hint={hint ? t(hint) : undefined}
                        hintId={hintId}
                        error={fieldError ? t(fieldError) : undefined}
                        errorId={errorId}
                      />
                    );
                  })}

                  <div className="group scroll-mt-28 sm:col-span-2">
                    <label htmlFor="feld-land" className={FIELD_LABEL}>
                      {t({ de: "Land", en: "Country" })}
                      <span aria-hidden="true"> *</span>
                      <span className="sr-only">{t({ de: ", Pflichtfeld", en: ", required" })}</span>
                    </label>
                    <select
                      id="feld-land"
                      name="country"
                      autoComplete="country"
                      value={region}
                      onChange={(event) => setRegion(event.target.value as typeof region)}
                      aria-describedby="feld-land-hinweis"
                      className={FIELD_INPUT}
                    >
                      {REGION_ORDER.map((code) => (
                        <option key={code} value={code}>
                          {t({ de: REGIONS[code].label, en: REGIONS[code].labelEn })}
                        </option>
                      ))}
                    </select>
                    <p id="feld-land-hinweis" className="mt-1 text-[11px] leading-snug text-ink-3">
                      {t({
                        de:
                          "Das Land bestimmt Währung, Steuersatz, Versandkosten und Zahlungsarten. Die " +
                          "Zusammenfassung rechnet sofort um.",
                        en:
                          "The country sets the currency, tax rate, shipping costs and payment methods. " +
                          "The summary updates at once.",
                      })}
                    </p>
                  </div>
                </div>
              </section>

              <section aria-labelledby="zahlung-titel" className="mt-10 border-t border-line pt-8">
                <h2 id="zahlung-titel" className="type-kicker text-ink-3">
                  {t({ de: "Zahlungsart", en: "Payment method" })}
                </h2>
                <p className="type-meta mt-2 text-ink-3">
                  {t({
                    de: `Angeboten werden nur Verfahren, die für ${regionLabel} freigeschaltet sind.`,
                    en: `Only methods enabled for ${regionLabel} are offered.`,
                  })}
                </p>

                {droppedMethod ? (
                  <p role="status" className="type-meta mt-2 max-w-[62ch] text-seal">
                    {t({
                      de: `${methodLabel(droppedMethod)} wird für ${regionLabel} nicht angeboten. Wir haben ${selected ? methodLabel(selected) : "keine Zahlungsart"} vorausgewählt, du kannst sie ändern.`,
                      en: `${methodLabel(droppedMethod)} is not offered for ${regionLabel}. We have preselected ${selected ? methodLabel(selected) : "no payment method"}, you can change it.`,
                    })}
                  </p>
                ) : null}

                {fieldErrors.method ? (
                  <p className="jing-rise type-meta mt-2 text-seal">{t(fieldErrors.method)}</p>
                ) : null}

                <fieldset className="mt-5">
                  <legend className="sr-only">
                    {t({ de: "Zahlungsart wählen", en: "Choose a payment method" })}
                  </legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {methods.map((entry) => {
                      const active = selected === entry.id;
                      return (
                        <label
                          key={entry.id}
                          className={cn(
                            "flex cursor-pointer flex-col gap-1 rounded-[2px] border px-4 py-3.5",
                            "transition-colors duration-[var(--duration-swap)] ease-ritual",
                            "jing-focus-within scroll-mt-28",
                            active
                              ? "border-ink bg-surface-2"
                              : "border-control hover:border-ink-2 hover:bg-surface-2",
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="zahlungsart"
                              value={entry.id}
                              checked={active}
                              onChange={() => setMethod(entry.id)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={cn(
                                "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                                "transition-colors duration-[var(--duration-state)] ease-ritual",
                                active ? "border-ink" : "border-control",
                              )}
                            >
                              {/* The dot grows from nothing; its colour never changes. */}
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full bg-ink",
                                  "transition-transform duration-[var(--duration-state)] ease-ritual",
                                  active ? "scale-100" : "scale-0",
                                )}
                              />
                            </span>
                            <span
                              className={cn(
                                "type-nav transition-colors duration-[var(--duration-state)] ease-ritual",
                                active ? "text-ink" : "text-ink-2",
                              )}
                            >
                              {t({ de: entry.label, en: entry.labelEn })}
                            </span>
                          </span>
                          <span className="type-meta pl-6 text-ink-3">
                            {t({ de: entry.note, en: entry.noteEn })}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </section>

              <div className="mt-10 lg:hidden">
                <OrderSummary
                  idSuffix="inline"
                  lines={lines}
                  region={region}
                  currency={currency}
                  estimate={estimate}
                  regionConfig={regionConfig}
                />
              </div>

              <section aria-labelledby="abschluss-titel" className="mt-10 border-t border-line pt-8">
                <h2 id="abschluss-titel" className="type-kicker text-ink-3">
                  {t({ de: "Bestellung abschließen", en: "Complete the order" })}
                </h2>

                <p className="type-meta mt-4 max-w-[62ch] text-ink-3">
                  {t({
                    de:
                      `Du kannst diese Bestellung innerhalb von ${WITHDRAWAL_DAYS} Tagen ohne Angabe von ` +
                      "Gründen widerrufen. Ausgenommen sind versiegelte kosmetische Mittel, deren Siegel " +
                      "du nach der Lieferung entfernt hast. Alle Einzelheiten und das " +
                      "Muster-Widerrufsformular stehen in der ",
                    en:
                      `You may withdraw from this order within ${WITHDRAWAL_DAYS} days without giving ` +
                      "reasons. Sealed cosmetic products whose seal you have removed after delivery are " +
                      "excluded. All details and the model withdrawal form are in the ",
                  })}
                  <Link href="/legal/widerruf" className="jing-underline text-ink">
                    {t({ de: "Widerrufsbelehrung", en: "notice on the right of withdrawal" })}
                  </Link>
                  .
                </p>

                <label
                  htmlFor="feld-agb"
                  className="mt-4 flex max-w-[62ch] scroll-mt-28 cursor-pointer items-start gap-3"
                >
                  <input
                    id="feld-agb"
                    name="agb"
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.agb ? true : undefined}
                    aria-describedby={fieldErrors.agb ? "feld-agb-fehler" : undefined}
                    className={cn(
                      "jing-check mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-[2px] border border-control bg-surface",
                      "checked:border-ink checked:bg-ink",
                      fieldErrors.agb && "border-seal",
                    )}
                  />
                  <span className="type-meta text-ink-2">
                    {t({ de: "Ich habe die ", en: "I have read the " })}
                    <Link href="/legal/agb" className="jing-underline text-ink">
                      {t({ de: "AGB", en: "terms and conditions" })}
                    </Link>
                    {t({ de: " gelesen und stimme ihnen zu.", en: " and agree to them." })}
                    <span aria-hidden="true"> *</span>
                  </span>
                </label>

                {fieldErrors.agb ? (
                  <p id="feld-agb-fehler" className="jing-rise type-meta mt-1.5 text-seal">
                    {t(fieldErrors.agb)}
                  </p>
                ) : null}

                <p className="type-meta mt-3 max-w-[62ch] text-ink-3">
                  {t({
                    de: "Wie wir deine Daten für die Bestellung verarbeiten, steht in der ",
                    en: "How we process your data for the order is set out in the ",
                  })}
                  <Link href="/legal/datenschutz" className="jing-underline text-ink">
                    {t({ de: "Datenschutzerklärung", en: "privacy policy" })}
                  </Link>
                  {t({
                    de: ". Grundlage ist die Vertragserfüllung, eine Einwilligung brauchen wir dafür nicht.",
                    en: ". The legal basis is the performance of the contract, so no consent is needed.",
                  })}
                </p>

                <p className="type-meta mt-4 max-w-[62ch] text-ink-2">
                  {t({
                    de: `Mit dem Absenden gibst du eine verbindliche Bestellung ab und gehst eine Zahlungsverpflichtung über ${formatMoney(estimate.total, currency, lang)} ein.`,
                    en: `By submitting you place a binding order and take on an obligation to pay ${formatMoney(estimate.total, currency, lang)}.`,
                  })}
                </p>

                <div className="mt-5 max-w-[26rem]">
                  <Button
                    type="submit"
                    variant="solid"
                    size="lg"
                    fullWidth
                    disabled={pending || !selected || lines.length === 0}
                  >
                    {/* Both labels share one grid cell, so the button keeps
                        the width of the longer one while they crossfade. */}
                    <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
                      <span className="invisible whitespace-nowrap" aria-hidden="true">
                        {t({ de: "Zahlungspflichtig bestellen", en: "Order with obligation to pay" })}
                      </span>
                      <AnimatePresence initial={false} mode="wait">
                        {pending ? (
                          <motion.span
                            key="pending"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: reduce ? 0 : DURATION.swap, ease: EASE_RITUAL }}
                          >
                            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
                            {t({ de: "Wird übermittelt", en: "Submitting" })}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="order"
                            className="inline-flex items-center justify-center whitespace-nowrap"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: reduce ? 0 : DURATION.swap, ease: EASE_RITUAL }}
                          >
                            {t({ de: "Zahlungspflichtig bestellen", en: "Order with obligation to pay" })}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </Button>
                </div>

                <p role="status" aria-live="polite" className="type-meta mt-2 min-h-4 text-ink-3">
                  {pending
                    ? t({
                        de: "Die Bestellung wird an die Zahlungsstelle übermittelt.",
                        en: "The order is being sent to the payment gateway.",
                      })
                    : ""}
                </p>

                <p
                  role="alert"
                  aria-live="assertive"
                  className="type-meta mt-1 min-h-4 max-w-[62ch] text-seal"
                >
                  {/* Keyed on the message, so each new message rises once. */}
                  <span key={errorText} className={cn("block", errorText && "jing-rise")}>
                    {errorText}
                  </span>
                </p>
              </section>
            </form>
          )}
        </div>

        {/* Once the order exists the basket is empty, so an empty summary
            beside the confirmation would only confuse. */}
        {session ? null : (
          <aside
            aria-labelledby="zusammenfassung-aside"
            className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
          >
            <OrderSummary
              idSuffix="aside"
              lines={lines}
              region={region}
              currency={currency}
              estimate={estimate}
              regionConfig={regionConfig}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
