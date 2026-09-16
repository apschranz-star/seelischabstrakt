"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { PaymentBadges } from "@/components/cart/payment-badges";
import { PackagingViewer } from "@/components/product/packaging-viewer";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { buttonClasses } from "@/components/ui/button";
import { REGIONS, REGION_ORDER } from "@/config/site";
import { resolveLines, selectEstimate, useJingStore } from "@/lib/store";
import {
  cn,
  deliveryWindow,
  formatBasePrice,
  formatForRegion,
  formatMoney,
  freeShippingProgress,
  toRegionMinorUnits,
} from "@/lib/utils";

/** Mirrors MAX_PER_LINE in lib/store, which caps a single line at ten units. */
const MAX_QUANTITY = 10;

const SHELL = "mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 sm:px-6 sm:pt-12";

/*
 * One template for the header row and for every line, so the columns line up.
 * Below the sm breakpoint the row folds into two columns, the packaging on the
 * left and everything else stacked in the second column.
 */
const GRID_COLUMNS = "sm:grid-cols-[5rem_minmax(0,1fr)_7.5rem_8.5rem_6.5rem]";
const ROW = `grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 ${GRID_COLUMNS} sm:items-start sm:gap-y-0`;

const MOBILE_LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:hidden";
const STACKED_CELL = "col-start-2 sm:col-start-auto";

export default function CartPage() {
  const { region, setRegion, hydrated } = useYinYang();
  const items = useJingStore((state) => state.items);
  const setQuantity = useJingStore((state) => state.setQuantity);
  const removeItem = useJingStore((state) => state.removeItem);
  const clearCart = useJingStore((state) => state.clearCart);
  const reduceMotion = useReducedMotion() ?? false;

  // Both helpers build a fresh object on every call, so they may never be used as
  // store selectors. Memoised here they stay stable between renders.
  const lines = useMemo(() => resolveLines(items), [items]);
  const estimate = useMemo(() => selectEstimate({ items, region }), [items, region]);

  // Stored values may not reach the first client render, otherwise the markup differs.
  if (!hydrated) {
    return (
      <div className={SHELL} aria-busy="true">
        <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl">Warenkorb</h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          Warenkorb wird geladen
        </p>
      </div>
    );
  }

  const regionConfig = estimate.region;
  const currency = estimate.currency;
  const progress = freeShippingProgress(estimate.subtotal, regionConfig);
  const stepButton = cn(
    "inline-flex h-9 w-9 items-center justify-center text-ink-2",
    "transition-colors duration-300 ease-ritual hover:text-ink",
    "disabled:cursor-not-allowed disabled:text-ink-3",
  );

  if (lines.length === 0) {
    return (
      <div className={SHELL}>
        <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl">Warenkorb</h1>
        <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
          Noch nichts gewählt. Der Warenkorb wartet, ohne Eile. Beide Kollektionen liegen einen
          Klick entfernt, YANG für den Tag und YIN für die Nacht.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#yang" className={buttonClasses("solid", "md")}>
            Yang ansehen
          </Link>
          <Link href="/#yin" className={buttonClasses("outline", "md")}>
            Yin ansehen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={SHELL}>
      <header>
        <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl">Warenkorb</h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          {estimate.itemCount === 1 ? "1 Artikel" : `${estimate.itemCount} Artikel`}
          {" · Lieferung nach "}
          {regionConfig.label}
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <section aria-labelledby="positionen-titel">
          <h2 id="positionen-titel" className="sr-only">
            Positionen
          </h2>

          {/* The visible column titles only exist on wide screens, each line repeats
              them for small screens, so the header stays out of the accessibility tree. */}
          <div
            aria-hidden="true"
            className={cn(
              "hidden gap-4 border-b border-line pb-3",
              "font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:grid",
              GRID_COLUMNS,
            )}
          >
            <span />
            <span>Artikel</span>
            <span className="text-right">Einzelpreis</span>
            <span className="text-center">Menge</span>
            <span className="text-right">Summe</span>
          </div>

          <ul className="border-t border-line sm:border-t-0">
            {lines.map(({ product, quantity }) => {
              const basePrice = formatBasePrice(product, region);
              const lineTotal = toRegionMinorUnits(product.priceCents, region) * quantity;

              return (
                <li key={product.id} className={cn(ROW, "border-b border-line py-5")}>
                  <div className="w-full">
                    <PackagingViewer product={product} compact />
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                      {product.code}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-1 block font-display text-xl leading-tight text-ink transition-opacity duration-300 ease-ritual hover:opacity-70"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-[13px] leading-snug text-ink-3">
                      {product.unitsLabel}
                      {" · "}
                      {product.category}
                    </p>
                  </div>

                  <div className={cn(STACKED_CELL, "sm:text-right")}>
                    <p className="font-mono text-[13px] tabular-nums text-ink">
                      <span className={MOBILE_LABEL}>Einzelpreis </span>
                      {formatForRegion(product.priceCents, region)}
                    </p>
                    {basePrice ? (
                      <p className="mt-1 font-mono text-[11px] tabular-nums text-ink-3">
                        Grundpreis {basePrice}
                      </p>
                    ) : null}
                  </div>

                  <div className={cn(STACKED_CELL, "flex flex-col items-start gap-2 sm:items-center")}>
                    <div
                      role="group"
                      aria-label={`Menge, ${product.name}`}
                      className="flex items-center rounded-[2px] border border-line"
                    >
                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label={`Menge verringern, ${product.name}`}
                        className={stepButton}
                      >
                        <Minus size={13} aria-hidden="true" />
                      </button>

                      <span
                        aria-live="polite"
                        aria-atomic="true"
                        className="min-w-7 text-center font-mono text-[12px] tabular-nums text-ink"
                      >
                        {quantity}
                        <span className="sr-only"> Stück</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        disabled={quantity >= MAX_QUANTITY}
                        aria-label={`Menge erhöhen, ${product.name}`}
                        className={stepButton}
                      >
                        <Plus size={13} aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`${product.name} entfernen`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-transparent px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 transition-colors duration-300 ease-ritual hover:border-line hover:text-ink"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                      Entfernen
                    </button>
                  </div>

                  <p
                    className={cn(
                      STACKED_CELL,
                      "font-mono text-[15px] tabular-nums text-ink sm:text-right",
                    )}
                  >
                    <span className={MOBILE_LABEL}>Summe </span>
                    {formatMoney(lineTotal, currency)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/#yang"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Weiter stöbern
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Warenkorb leeren
            </button>
          </div>
        </section>

        <aside aria-labelledby="summe-titel" className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line bg-surface-2 p-5 sm:p-6">
            <h2
              id="summe-titel"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
            >
              Kostenübersicht
            </h2>

            <fieldset className="mt-5">
              <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                Lieferland
              </legend>
              <div className="mt-2 flex gap-2">
                {REGION_ORDER.map((code) => {
                  const option = REGIONS[code];
                  const active = code === region;
                  return (
                    <label
                      key={code}
                      className={cn(
                        "flex flex-1 cursor-pointer flex-col gap-0.5 rounded-[2px] border px-2.5 py-2 transition-colors duration-300 ease-ritual",
                        "focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-surface-2",
                        active
                          ? "border-ink bg-surface text-ink"
                          : "border-line text-ink-3 hover:border-line-2 hover:text-ink-2",
                      )}
                    >
                      <input
                        type="radio"
                        name="lieferland"
                        value={code}
                        checked={active}
                        onChange={() => setRegion(code)}
                        className="sr-only"
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                        {code}
                      </span>
                      <span className="text-[11px] leading-snug">{option.currency}</span>
                      <span className="sr-only">{option.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-ink-3">
                Das Lieferland entscheidet über Währung, Steuersatz und Versand.
              </p>
            </fieldset>

            <dl className="mt-6 flex flex-col gap-2 text-[13px]">
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

            <div className="mt-5">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                aria-label="Fortschritt bis zum kostenfreien Versand"
                className="h-[3px] w-full overflow-hidden bg-line"
              >
                <motion.div
                  className="h-full w-full origin-left bg-ink"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p aria-live="polite" className="mt-2 text-[12px] leading-snug text-ink-2">
                {estimate.freeShippingReached
                  ? `Versand frei. ${regionConfig.carrier} liefert in ${deliveryWindow(regionConfig)}.`
                  : `Noch ${formatMoney(estimate.freeShippingGap, currency)} bis zum kostenfreien Versand, ab ${formatMoney(regionConfig.freeShippingCents, currency)}.`}
              </p>
            </div>

            <PaymentBadges region={region} className="mt-5" />

            <Link href="/checkout" className={cn(buttonClasses("solid", "lg", true), "mt-5")}>
              Zur Kasse
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <p className="mt-3 text-[11px] leading-snug text-ink-3">
              Im nächsten Schritt wählst du Lieferadresse und Zahlungsart. Erst danach wird die
              Bestellung verbindlich.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
