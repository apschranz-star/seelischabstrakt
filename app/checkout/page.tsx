"use client";

import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { PackagingViewer } from "@/components/product/packaging-viewer";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Button, buttonClasses } from "@/components/ui/button";
import {
  PAYMENT_METHODS,
  REGIONS,
  REGION_ORDER,
  WITHDRAWAL_DAYS,
  type PaymentMethodId,
  type RegionCode,
  type CurrencyCode,
} from "@/config/site";
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

const SHELL = "mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 sm:px-6 sm:pt-12";

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
  return (
            <div className="border border-line bg-surface-2 p-5 sm:p-6">
              <h2
                id={`zusammenfassung-${idSuffix}`}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
              >
                Bestellübersicht
              </h2>

              <ul className="mt-4">
                {lines.map(({ product, quantity }) => {
                  const basePrice = formatBasePrice(product, region);
                  const lineTotal = toRegionMinorUnits(product.priceCents, region) * quantity;

                  return (
                    <li key={product.id} className="flex gap-3 border-b border-line py-3 first:border-t">
                      <div className="w-11 shrink-0">
                        <PackagingViewer product={product} compact />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                          {product.code}
                        </p>
                        <p className="mt-0.5 font-display text-[15px] leading-tight text-ink">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-ink-2">
                          {product.unitsLabel}
                        </p>
                        <p className="mt-1 font-mono text-[11px] tabular-nums text-ink-3">
                          {quantity} × {formatForRegion(product.priceCents, region)}
                        </p>
                        {basePrice ? (
                          <p className="font-mono text-[11px] tabular-nums text-ink-3">
                            Grundpreis {basePrice}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 font-mono text-[13px] tabular-nums text-ink">
                        {formatMoney(lineTotal, currency)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-4 flex flex-col gap-2 text-[13px]">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-2">Zwischensumme</dt>
                  <dd className="font-mono tabular-nums text-ink">
                    {formatMoney(estimate.subtotal, currency)}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-2">
                    Versand
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">
                      {regionConfig.carrier}, {deliveryWindow(regionConfig)}
                    </span>
                  </dt>
                  <dd className="font-mono tabular-nums text-ink">
                    {estimate.shipping === 0 ? "kostenfrei" : formatMoney(estimate.shipping, currency)}
                  </dd>
                </div>

                {estimate.clearance > 0 ? (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-2">
                      Zollabfertigung
                      <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">
                        {regionConfig.customs?.incoterm ?? "DDP"}, verzollt und versteuert
                      </span>
                    </dt>
                    <dd className="font-mono tabular-nums text-ink">
                      {formatMoney(estimate.clearance, currency)}
                    </dd>
                  </div>
                ) : null}

                <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
                    Gesamt
                  </dt>
                  <dd className="font-mono text-[17px] tabular-nums text-ink">
                    {formatMoney(estimate.total, currency)}
                  </dd>
                </div>
              </dl>

              <p className="mt-2 text-[11px] leading-snug text-ink-3">
                Darin enthalten {formatMoney(estimate.vatIncluded, currency)} bei{" "}
                {regionConfig.vatLabel}.
              </p>
              <p className="text-[11px] leading-snug text-ink-3">
                {regionConfig.customs
                  ? "Gesamtpreis inklusive Steuer, Versand und Zollabfertigung."
                  : "Gesamtpreis inklusive Steuer und Versandkosten."}
              </p>
              {regionConfig.customs ? (
                <p className="mt-2 text-[11px] leading-snug text-ink-3">{regionConfig.customs.note}</p>
              ) : null}

              <Link
                href="/cart"
                className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Warenkorb ändern
              </Link>
            </div>
  );
}


const FIELD_INPUT = cn(
  "mt-1.5 w-full rounded-[2px] border border-control bg-surface px-3 py-2.5",
  "font-sans text-[14px] text-ink placeholder:text-ink-3",
  "transition-colors duration-300 ease-ritual hover:border-ink-2",
  "focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
);
const FIELD_LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3";

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

interface Field {
  name: FieldName;
  label: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  required: boolean;
  /** Field takes the full width of the two column form grid. */
  wide?: boolean;
  hint?: string;
}

/** Digits a postcode has per delivery country, with the wording shown to the buyer. */
const ZIP_RULES: Record<RegionCode, { digits: number; hint: string; example: string }> = {
  DE: { digits: 5, hint: "Fünf Ziffern, zum Beispiel 10115", example: "10115" },
  AT: { digits: 4, hint: "Vier Ziffern, zum Beispiel 1010", example: "1010" },
  CH: { digits: 4, hint: "Vier Ziffern, zum Beispiel 8001", example: "8001" },
};

const FIELDS: Field[] = [
  { name: "firstName", label: "Vorname", type: "text", autoComplete: "given-name", required: true },
  { name: "lastName", label: "Nachname", type: "text", autoComplete: "family-name", required: true },
  {
    name: "email",
    label: "E-Mail",
    type: "email",
    autoComplete: "email",
    required: true,
    wide: true,
    hint: "An diese Adresse ginge im Echtbetrieb die Bestellbestätigung.",
  },
  {
    name: "company",
    label: "Firma, optional",
    type: "text",
    autoComplete: "organization",
    required: false,
    wide: true,
  },
  {
    name: "street",
    label: "Straße und Hausnummer",
    type: "text",
    autoComplete: "street-address",
    required: true,
    wide: true,
  },
  {
    name: "addition",
    label: "Adresszusatz, optional",
    type: "text",
    autoComplete: "address-line2",
    required: false,
    wide: true,
  },
  { name: "zip", label: "PLZ", type: "text", autoComplete: "postal-code", required: true },
  { name: "city", label: "Ort", type: "text", autoComplete: "address-level2", required: true },
  {
    name: "phone",
    label: "Telefon, optional",
    type: "tel",
    autoComplete: "tel",
    required: false,
    wide: true,
    hint: "Nur für Rückfragen des Zustellers.",
  },
];

interface CheckoutSession {
  reference: string;
  redirectUrl: string | null;
  status: string | null;
  methodLabel: string;
  amount: string;
  email: string;
}

/* ----------------------------------------------------------- response reading */

/*
 * The checkout route answers with a mock session. Its field names are read
 * defensively so a rename on the server surfaces as a German error message
 * instead of an empty confirmation panel.
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

export default function CheckoutPage() {
  const { region, setRegion, hydrated } = useYinYang();
  const items = useJingStore((state) => state.items);
  const clearCart = useJingStore((state) => state.clearCart);

  const [method, setMethod] = useState<PaymentMethodId | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  // Per field messages, so a rejected order says what is wrong and where, and
  // says it in the page rather than in a native bubble that no screen reader
  // announces and that vanishes on the next click.
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const confirmationRef = useRef<HTMLHeadingElement>(null);

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
        <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl">Kasse</h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          Bestellung wird geladen
        </p>
      </div>
    );
  }

  const regionConfig = estimate.region;
  const currency = estimate.currency;

  if (lines.length === 0 && !session) {
    return (
      <div className={SHELL}>
        <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl">Kasse</h1>
        <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
          Der Warenkorb ist leer, deshalb gibt es hier nichts zu bezahlen. Leg zuerst etwas ab,
          danach führt der Weg zurück an diese Stelle.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={buttonClasses("solid", "md")}>
            Zu den Kollektionen
          </Link>
          <Link href="/cart" className={buttonClasses("outline", "md")}>
            Warenkorb ansehen
          </Link>
        </div>
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

    const problems: Record<string, string> = {};
    for (const field of FIELDS) {
      if (!field.required) continue;
      if (String(data.get(field.name) ?? "").trim()) continue;
      problems[field.name] = `Bitte ${field.label} ausfüllen.`;
    }
    if (!problems.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      problems.email = "Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.";
    }
    const zip = String(data.get("zip") ?? "").trim();
    const zipRule = ZIP_RULES[region];
    if (!problems.zip && zip && !new RegExp(`^[0-9]{${zipRule.digits}}$`).test(zip)) {
      problems.zip = `Die PLZ für ${regionConfig.label} hat ${zipRule.digits} Ziffern, zum Beispiel ${zipRule.example}.`;
    }
    if (!accepted) problems.agb = "Bitte bestätige zuerst die AGB.";
    if (!selected) problems.method = "Bitte wähle eine Zahlungsart.";

    setFieldErrors(problems);

    const first = Object.keys(problems)[0];
    if (first) {
      setError(
        Object.keys(problems).length === 1
          ? problems[first]
          : `Die Bestellung ist noch nicht vollständig, ${Object.keys(problems).length} Angaben fehlen oder stimmen nicht.`,
      );
      const target = form.querySelector<HTMLElement>(
        first === "agb" ? "#feld-agb" : first === "method" ? "[name='zahlungsart']" : `[name='${first}']`,
      );
      target?.focus();
      return;
    }

    if (!selected) return;

    const methodLabel = PAYMENT_METHODS[selected].label;
    const amount = formatMoney(estimate.total, currency);

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
        methodLabel,
        amount,
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
        setError(
          readString(nested, ERROR_KEYS) ??
            readString(root, ERROR_KEYS) ??
            `Die Bestellung konnte nicht angelegt werden, die Zahlungsstelle antwortete mit Status ${response.status}.`,
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
        methodLabel,
        amount,
        email,
      });
    } catch {
      setError(
        "Die Zahlungsstelle war nicht erreichbar. Bitte prüfe deine Verbindung und versuche es noch einmal.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={SHELL}>
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">Schritt 2</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">Kasse</h1>
        <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-ink-2">
          Diese Kasse ist eine Demonstration. Es wird keine Zahlung ausgelöst und keine Adresse
          gespeichert, die Bestellung legt nur eine Mock-Session an.
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
              <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
                <Check size={14} aria-hidden="true" />
                Session angelegt
              </p>
              <h2
                id="bestaetigung-titel"
                ref={confirmationRef}
                tabIndex={-1}
                className="mt-3 font-display text-3xl leading-tight text-ink focus-visible:outline-none"
              >
                Danke, die Bestellung steht bereit.
              </h2>
              <p className="mt-3 max-w-[50ch] text-[14px] leading-relaxed text-ink-2">
                Die Zahlungsstelle hat eine Mock-Session erzeugt. In einem echten Shop würde die
                Weiterleitung jetzt zum Zahlungsanbieter führen, hier bleibt alles an Ort und
                Stelle. Es wurde nichts abgebucht.
              </p>

              <dl className="mt-6 flex flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>Referenz</dt>
                  <dd className="font-mono text-[15px] tabular-nums text-ink">
                    {session.reference}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>Weiterleitung, simuliert</dt>
                  <dd className="break-all text-right font-mono text-[12px] text-ink-2">
                    {session.redirectUrl ?? "Keine Weiterleitung übermittelt"}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>Zahlungsart</dt>
                  <dd className="text-[14px] text-ink">{session.methodLabel}</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                  <dt className={FIELD_LABEL}>Betrag</dt>
                  <dd className="font-mono text-[14px] tabular-nums text-ink">{session.amount}</dd>
                </div>
                {session.status ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3">
                    <dt className={FIELD_LABEL}>Status</dt>
                    <dd className="font-mono text-[13px] text-ink-2">{session.status}</dd>
                  </div>
                ) : null}
                {session.email ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-y border-line py-3">
                    <dt className={FIELD_LABEL}>E-Mail, angegeben</dt>
                    <dd className="break-all text-right text-[14px] text-ink-2">{session.email}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/" className={buttonClasses("solid", "md")}>
                  Weiter stöbern
                </Link>
                <Link href="/cart" className={buttonClasses("outline", "md")}>
                  Warenkorb ansehen
                </Link>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <section aria-labelledby="adresse-titel">
                <h2
                  id="adresse-titel"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
                >
                  Lieferadresse
                </h2>
                <p className="mt-2 text-[12px] leading-snug text-ink-3">
                  Pflichtfelder sind mit einem Stern
                  <span aria-hidden="true"> *</span> markiert.
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
                      <div key={field.name} className={field.wide ? "sm:col-span-2" : undefined}>
                        <label htmlFor={id} className={FIELD_LABEL}>
                          {field.label}
                          {field.required ? (
                            <>
                              <span aria-hidden="true"> *</span>
                              <span className="sr-only">, Pflichtfeld</span>
                            </>
                          ) : null}
                        </label>
                        <input
                          id={id}
                          name={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          required={field.required}
                          aria-required={field.required}
                          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
                          aria-invalid={fieldError ? true : undefined}
                          inputMode={isZip ? "numeric" : undefined}
                          className={cn(FIELD_INPUT, fieldError && "border-seal")}
                        />
                        {hint ? (
                          <p id={hintId} className="mt-1 text-[11px] leading-snug text-ink-3">
                            {hint}
                          </p>
                        ) : null}
                        {fieldError ? (
                          <p id={errorId} className="mt-1 text-[11px] leading-snug text-seal">
                            {fieldError}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="sm:col-span-2">
                    <label htmlFor="feld-land" className={FIELD_LABEL}>
                      Land
                      <span aria-hidden="true"> *</span>
                      <span className="sr-only">, Pflichtfeld</span>
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
                          {REGIONS[code].label}
                        </option>
                      ))}
                    </select>
                    <p id="feld-land-hinweis" className="mt-1 text-[11px] leading-snug text-ink-3">
                      Das Land bestimmt Währung, Steuersatz, Versandkosten und Zahlungsarten. Die
                      Zusammenfassung rechnet sofort um.
                    </p>
                  </div>
                </div>
              </section>

              <section aria-labelledby="zahlung-titel" className="mt-10 border-t border-line pt-8">
                <h2
                  id="zahlung-titel"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
                >
                  Zahlungsart
                </h2>
                <p className="mt-2 text-[12px] leading-snug text-ink-3">
                  Angeboten werden nur Verfahren, die für {regionConfig.label} freigeschaltet sind.
                </p>

                {droppedMethod ? (
                  <p role="status" className="mt-2 max-w-[62ch] text-[12px] leading-snug text-seal">
                    {PAYMENT_METHODS[droppedMethod].label} wird für {regionConfig.label} nicht
                    angeboten. Wir haben {selected ? PAYMENT_METHODS[selected].label : "keine Zahlungsart"}{" "}
                    vorausgewählt, du kannst sie ändern.
                  </p>
                ) : null}

                {fieldErrors.method ? (
                  <p className="mt-2 text-[12px] leading-snug text-seal">{fieldErrors.method}</p>
                ) : null}

                <fieldset className="mt-5">
                  <legend className="sr-only">Zahlungsart wählen</legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {methods.map((entry) => {
                      const active = selected === entry.id;
                      return (
                        <label
                          key={entry.id}
                          className={cn(
                            "flex cursor-pointer flex-col gap-1 rounded-[2px] border px-4 py-3.5 transition-colors duration-300 ease-ritual",
                            "focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-surface",
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
                                active ? "border-ink" : "border-control",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  active ? "bg-ink" : "bg-transparent",
                                )}
                              />
                            </span>
                            <span
                              className={cn(
                                "font-mono text-[11px] uppercase tracking-[0.16em]",
                                active ? "text-ink" : "text-ink-2",
                              )}
                            >
                              {entry.label}
                            </span>
                          </span>
                          <span className="pl-6 text-[12px] leading-snug text-ink-3">
                            {entry.note}
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
                <h2
                  id="abschluss-titel"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
                >
                  Bestellung abschließen
                </h2>

                <p className="mt-4 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
                  Du kannst diese Bestellung innerhalb von {WITHDRAWAL_DAYS} Tagen ohne Angabe von
                  Gründen widerrufen. Ausgenommen sind versiegelte kosmetische Mittel, deren Siegel
                  du nach der Lieferung entfernt hast. Alle Einzelheiten und das
                  Muster-Widerrufsformular stehen in der{" "}
                  <Link href="/legal/widerruf" className="text-ink underline underline-offset-4">
                    Widerrufsbelehrung
                  </Link>
                  .
                </p>

                <label
                  htmlFor="feld-agb"
                  className="mt-4 flex max-w-[62ch] cursor-pointer items-start gap-3"
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
                    className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
                  />
                  <span className="text-[12px] leading-relaxed text-ink-2">
                    Ich habe die{" "}
                    <Link href="/legal/agb" className="text-ink underline underline-offset-4">
                      AGB
                    </Link>{" "}
                    gelesen und stimme ihnen zu.
                    <span aria-hidden="true"> *</span>
                  </span>
                </label>

                {fieldErrors.agb ? (
                  <p id="feld-agb-fehler" className="mt-1.5 text-[12px] leading-snug text-seal">
                    {fieldErrors.agb}
                  </p>
                ) : null}

                <p className="mt-3 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
                  Wie wir deine Daten für die Bestellung verarbeiten, steht in der{" "}
                  <Link href="/legal/datenschutz" className="text-ink underline underline-offset-4">
                    Datenschutzerklärung
                  </Link>
                  . Grundlage ist die Vertragserfüllung, eine Einwilligung brauchen wir dafür nicht.
                </p>

                <p className="mt-4 max-w-[62ch] text-[12px] leading-relaxed text-ink-2">
                  Mit dem Absenden gibst du eine verbindliche Bestellung ab und gehst eine
                  Zahlungsverpflichtung über {formatMoney(estimate.total, currency)} ein.
                </p>

                <div className="mt-5 max-w-[26rem]">
                  <Button
                    type="submit"
                    variant="solid"
                    size="lg"
                    fullWidth
                    disabled={pending || !selected || lines.length === 0}
                  >
                    {pending ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={14} aria-hidden="true" className="animate-spin" />
                        Wird übermittelt
                      </span>
                    ) : (
                      "Zahlungspflichtig bestellen"
                    )}
                  </Button>
                </div>

                <p role="status" aria-live="polite" className="mt-2 min-h-4 text-[12px] text-ink-3">
                  {pending ? "Die Bestellung wird an die Zahlungsstelle übermittelt." : ""}
                </p>

                <p
                  role="alert"
                  aria-live="assertive"
                  className="mt-1 min-h-4 max-w-[62ch] text-[12px] leading-snug text-seal"
                >
                  {error ?? ""}
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
