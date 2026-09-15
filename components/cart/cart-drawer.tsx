"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { PaymentBadges } from "@/components/cart/payment-badges";
import { PackagingViewer } from "@/components/product/packaging-viewer";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { buttonClasses } from "@/components/ui/button";
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

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function CartDrawer() {
  const { region, hydrated } = useYinYang();
  const isCartOpen = useJingStore((state) => state.isCartOpen);
  const items = useJingStore((state) => state.items);
  const setQuantity = useJingStore((state) => state.setQuantity);
  const removeItem = useJingStore((state) => state.removeItem);
  const closeCart = useJingStore((state) => state.closeCart);

  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const titleId = useId();

  // Both helpers build a fresh object on every call, so they may never be used as
  // store selectors. Memoised here they stay stable between renders.
  const lines = useMemo(() => resolveLines(items), [items]);
  const estimate = useMemo(() => selectEstimate({ items, region }), [items, region]);

  const open = hydrated && isCartOpen;

  // The portal target only exists in the browser, so nothing renders until after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Remember the trigger, move focus into the drawer, hand focus back on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    triggerRef.current = previous instanceof HTMLElement ? previous : null;

    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      triggerRef.current?.focus();
    };
  }, [open]);

  // Escape closes, Tab stays inside the drawer.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeCart]);

  // Lock the page behind the drawer so only the panel scrolls.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Stored values may not reach the first client render, otherwise the markup differs.
  if (!mounted || !hydrated) return null;

  const regionConfig = estimate.region;
  const currency = estimate.currency;
  const progress = freeShippingProgress(estimate.subtotal, regionConfig);
  // vatLabel carries the regional name of the tax, MwSt. in Germany, USt. in Austria,
  // MWST in Switzerland.
  const taxNoun = regionConfig.vatLabel.split(" ").at(-1) ?? "MwSt.";
  const duration = reduceMotion ? 0 : 0.36;
  const stepButton = cn(
    "inline-flex h-9 w-9 items-center justify-center text-ink-2",
    "transition-colors duration-300 ease-ritual hover:text-ink",
    "disabled:cursor-not-allowed disabled:text-ink-3",
  );

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            aria-hidden="true"
            onClick={closeCart}
            className="absolute inset-0 bg-inverse-surface/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col border-l border-line-2 bg-surface focus:outline-none"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-display text-xl leading-tight text-ink">
                  Warenkorb
                </h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
                  {estimate.itemCount === 1 ? "1 Artikel" : `${estimate.itemCount} Artikel`}
                  {" · "}
                  {regionConfig.label}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Warenkorb schließen"
                className="-mr-1 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-300 ease-ritual hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-5 px-5 py-14">
                <p className="max-w-[30ch] text-sm leading-relaxed text-ink-2">
                  Noch nichts gewählt. Der Warenkorb wartet, ohne Eile.
                </p>
                <Link
                  href="/#yang"
                  onClick={closeCart}
                  className={buttonClasses("outline", "md")}
                >
                  Zu den Kollektionen
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5">
                  <ul>
                    {lines.map((line) => {
                      const { product, quantity } = line;
                      const basePrice = formatBasePrice(product, region);
                      const lineTotal =
                        toRegionMinorUnits(product.priceCents, region) * quantity;

                      return (
                        <li
                          key={product.id}
                          className="flex gap-4 border-b border-line py-4 last:border-b-0"
                        >
                          <div className="w-16 shrink-0">
                            <PackagingViewer product={product} compact />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                              {product.code}
                            </p>
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeCart}
                              className="mt-1 block font-display text-lg leading-tight text-ink transition-opacity duration-300 ease-ritual hover:opacity-70"
                            >
                              {product.name}
                            </Link>

                            <div className="mt-1.5 flex items-baseline justify-between gap-3">
                              <p className="font-mono text-[12px] tabular-nums text-ink-3">
                                {formatForRegion(product.priceCents, region)}
                                {" je "}
                                {product.unitsLabel}
                              </p>
                              <p className="font-mono text-[13px] tabular-nums text-ink">
                                {formatMoney(lineTotal, currency)}
                              </p>
                            </div>

                            {basePrice ? (
                              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-ink-3">
                                {basePrice}
                              </p>
                            ) : null}

                            <div className="mt-3 flex items-center justify-between gap-3">
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
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="border-t border-line px-5 py-4">
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
                      ? `Versand frei. ${regionConfig.carrier}, ${deliveryWindow(regionConfig)}.`
                      : `Noch ${formatMoney(estimate.freeShippingGap, currency)} bis zum kostenfreien Versand.`}
                  </p>

                  <dl className="mt-4 flex flex-col gap-1.5 text-[13px]">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-2">Zwischensumme</dt>
                      <dd className="font-mono tabular-nums text-ink">
                        {formatMoney(estimate.subtotal, currency)}
                      </dd>
                    </div>

                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-2">Versand</dt>
                      <dd className="font-mono tabular-nums text-ink">
                        {estimate.shipping === 0
                          ? "kostenfrei"
                          : formatMoney(estimate.shipping, currency)}
                      </dd>
                    </div>

                    {estimate.clearance > 0 ? (
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-ink-2">Zollabfertigung</dt>
                        <dd className="font-mono tabular-nums text-ink">
                          {formatMoney(estimate.clearance, currency)}
                        </dd>
                      </div>
                    ) : null}

                    <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
                        Gesamt
                      </dt>
                      <dd className="font-mono text-[15px] tabular-nums text-ink">
                        {formatMoney(estimate.total, currency)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-1.5 text-[11px] leading-snug text-ink-3">
                    davon {formatMoney(estimate.vatIncluded, currency)} {taxNoun}
                  </p>
                  <p className="text-[11px] leading-snug text-ink-3">
                    inkl. MwSt., zzgl. Versandkosten
                  </p>
                  {regionConfig.customs ? (
                    <p className="mt-2 max-w-[44ch] text-[11px] leading-snug text-ink-3">
                      {regionConfig.customs.note}
                    </p>
                  ) : null}

                  <PaymentBadges region={region} className="mt-4" />

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className={buttonClasses("solid", "md", true)}
                    >
                      Zur Kasse
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className={buttonClasses("outline", "md", true)}
                    >
                      Warenkorb ansehen
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
