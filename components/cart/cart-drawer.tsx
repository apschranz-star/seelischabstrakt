"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { PaymentBadges } from "@/components/cart/payment-badges";
import { PackagingViewer } from "@/components/product/packaging-viewer";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { localizeProduct } from "@/config/products";
import { useLang, useT } from "@/lib/i18n";
import { DURATION, EASE_RITUAL, panelTransition } from "@/lib/motion";
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
import { useMounted } from "@/lib/use-mounted";

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
  const lang = useLang();
  const t = useT();
  const isCartOpen = useJingStore((state) => state.isCartOpen);
  const items = useJingStore((state) => state.items);
  const lastAdded = useJingStore((state) => state.lastAdded);
  const setQuantity = useJingStore((state) => state.setQuantity);
  const removeItem = useJingStore((state) => state.removeItem);
  const closeCart = useJingStore((state) => state.closeCart);

  // The portal target only exists in the browser, so nothing renders before mount.
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const titleId = useId();

  // Both helpers build a fresh object on every call, so they may never be used as
  // store selectors. Memoised here they stay stable between renders.
  const lines = useMemo(() => resolveLines(items), [items]);

  /**
   * Removing a line or disabling the control that was just pressed drops focus
   * to document.body. Inside a focus trap that means the next Tab restarts at
   * the top and a screen reader loses its place, so every destructive control
   * hands focus on explicitly before the render that removes it.
   */
  const focusAfterRender = (select: () => HTMLElement | null) => {
    requestAnimationFrame(() => {
      const next = select();
      (next ?? closeRef.current)?.focus();
    });
  };

  const stepTarget = (productId: string, role: "plus" | "remove") =>
    panelRef.current?.querySelector<HTMLElement>(`[data-step="${role}:${productId}"]`) ?? null;
  const estimate = useMemo(() => selectEstimate({ items, region }), [items, region]);

  const open = hydrated && isCartOpen;

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
  const regionLabel = t({ de: regionConfig.label, en: regionConfig.labelEn });
  // The carrier is a name; only its Swiss suffix is a German word.
  const carrier = t({ de: regionConfig.carrier, en: regionConfig.carrier.replace("verzollt", "duty paid") });
  // vatLabel carries the regional name of the tax, MwSt. in Germany, USt. in Austria,
  // MWST in Switzerland. English says VAT everywhere.
  const taxNoun = t({ de: regionConfig.vatLabel.split(" ").at(-1) ?? "MwSt.", en: "VAT" });
  // The stagger index of a child, as the CSS reads it: header 0, rows from 1,
  // capped so a long list never waits, the summary right after the last row.
  const enterAt = (index: number) => ({ "--i": Math.min(index, 4) } as CSSProperties);
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
            exit={{ opacity: 0, transition: panelTransition(reduceMotion, true) }}
            transition={panelTransition(reduceMotion)}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-surface focus:outline-none"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: panelTransition(true, true) }
                : { x: "100%", transition: panelTransition(false, true) }
            }
            transition={panelTransition(reduceMotion)}
          >
            {/* The edge draws itself down from the top while the panel arrives. */}
            <span aria-hidden="true" className="jing-edge absolute inset-y-0 left-0 w-px bg-line-2" />

            <div
              className="jing-enter flex items-start gap-4 border-b border-line px-5 py-4"
              style={enterAt(0)}
            >
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-display text-xl leading-tight text-ink">
                  {t({ de: "Warenkorb", en: "Cart" })}
                </h2>
                <p className="type-nav mt-1 text-ink-3">
                  {estimate.itemCount === 1
                    ? t({ de: "1 Artikel", en: "1 item" })
                    : t({ de: `${estimate.itemCount} Artikel`, en: `${estimate.itemCount} items` })}
                  {" · "}
                  {regionLabel}
                </p>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label={t({ de: "Warenkorb schließen", en: "Close cart" })}
                className={cn(buttonClasses("control", "icon"), "-mr-1 shrink-0")}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="jing-enter flex flex-1 flex-col justify-center px-5 py-14" style={enterAt(1)}>
                <EmptyState
                  compact
                  title={t({ de: "Noch nichts gewählt", en: "Nothing chosen yet" })}
                  text={t({ de: "Der Warenkorb wartet, ohne Eile.", en: "The cart is waiting, in no hurry." })}
                  actions={
                    <Link href="/" onClick={closeCart} className={buttonClasses("outline", "md")}>
                      {t({ de: "Zur Kollektion", en: "To the collection" })}
                    </Link>
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5">
                  <ul>
                    {lines.map((line, index) => {
                      const product = localizeProduct(line.product, lang);
                      const { quantity } = line;
                      const basePrice = formatBasePrice(product, region, lang);
                      const lineTotal =
                        toRegionMinorUnits(product.priceCents, region) * quantity;
                      // The row the last add touched is keyed on the add's
                      // stamp, so it remounts on every add and its rule turns
                      // ink and settles back each time (see .jing-fresh).
                      const fresh = lastAdded?.productId === product.id;

                      return (
                        <li
                          key={fresh ? `${product.id}-${lastAdded.stamp}` : product.id}
                          className={cn(
                            "flex gap-4 border-b border-line py-4 last:border-b-0",
                            fresh ? "jing-fresh" : "jing-enter",
                          )}
                          style={fresh ? undefined : enterAt(index + 1)}
                        >
                          <div className="w-16 shrink-0">
                            <PackagingViewer product={product} variant="thumb" />
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
                                {formatForRegion(product.priceCents, region, lang)}
                                {t({ de: " je ", en: " per " })}
                                {product.unitsLabel}
                              </p>
                              <p className="font-mono text-[13px] tabular-nums text-ink">
                                {formatMoney(lineTotal, currency, lang)}
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
                                aria-label={t({
                                  de: `Menge, ${product.name}`,
                                  en: `Quantity, ${product.name}`,
                                })}
                                className="flex items-center rounded-[2px] border border-control"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuantity(product.id, quantity - 1);
                                    // At one the control disables itself.
                                    if (quantity - 1 <= 1) {
                                      focusAfterRender(() => stepTarget(product.id, "plus"));
                                    }
                                  }}
                                  disabled={quantity <= 1}
                                  aria-label={t({
                                    de: `Menge verringern, ${product.name}`,
                                    en: `Decrease quantity, ${product.name}`,
                                  })}
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
                                  <span className="sr-only">{t({ de: " Stück", en: " units" })}</span>
                                </span>

                                <button
                                  type="button"
                                  data-step={`plus:${product.id}`}
                                  onClick={() => {
                                    setQuantity(product.id, quantity + 1);
                                    if (quantity + 1 >= MAX_QUANTITY) {
                                      focusAfterRender(() => stepTarget(product.id, "remove"));
                                    }
                                  }}
                                  disabled={quantity >= MAX_QUANTITY}
                                  title={
                                    quantity >= MAX_QUANTITY
                                      ? t({
                                          de: `Mehr als ${MAX_QUANTITY} pro Artikel und Bestellung sind nicht möglich`,
                                          en: `No more than ${MAX_QUANTITY} of one item per order`,
                                        })
                                      : undefined
                                  }
                                  aria-label={t({
                                    de: `Menge erhöhen, ${product.name}`,
                                    en: `Increase quantity, ${product.name}`,
                                  })}
                                  className={stepButton}
                                >
                                  <Plus size={13} aria-hidden="true" />
                                </button>
                              </div>

                              <button
                                type="button"
                                data-step={`remove:${product.id}`}
                                onClick={() => {
                                  // Decided before the row leaves the DOM.
                                  const rest = lines.filter((entry) => entry.product.id !== product.id);
                                  const index = lines.findIndex((entry) => entry.product.id === product.id);
                                  const neighbour = rest[index] ?? rest[index - 1] ?? null;
                                  removeItem(product.id);
                                  focusAfterRender(() =>
                                    neighbour ? stepTarget(neighbour.product.id, "remove") : null,
                                  );
                                }}
                                aria-label={t({
                                  de: `${product.name} entfernen`,
                                  en: `Remove ${product.name}`,
                                })}
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-transparent px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 transition-colors duration-300 ease-ritual hover:border-line hover:text-ink"
                              >
                                <Trash2 size={13} aria-hidden="true" />
                                {t({ de: "Entfernen", en: "Remove" })}
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div
                  className="jing-enter border-t border-line px-5 py-4"
                  style={enterAt(lines.length + 1)}
                >
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress * 100)}
                    aria-label={t({
                      de: "Fortschritt bis zum kostenfreien Versand",
                      en: "Progress towards free shipping",
                    })}
                    className="h-[3px] w-full overflow-hidden bg-line"
                  >
                    <motion.div
                      className="h-full w-full origin-left bg-ink"
                      initial={false}
                      animate={{ scaleX: progress }}
                      transition={{ duration: reduceMotion ? 0 : DURATION.ritual, ease: EASE_RITUAL }}
                    />
                  </div>

                  <p aria-live="polite" className="mt-2 text-[12px] leading-snug text-ink-2">
                    {estimate.freeShippingReached
                      ? t({
                          de: `Versand frei. ${carrier}, ${deliveryWindow(regionConfig, lang)}.`,
                          en: `Free shipping. ${carrier}, ${deliveryWindow(regionConfig, lang)}.`,
                        })
                      : t({
                          de: `Noch ${formatMoney(estimate.freeShippingGap, currency, lang)} bis zum kostenfreien Versand.`,
                          en: `${formatMoney(estimate.freeShippingGap, currency, lang)} more for free shipping.`,
                        })}
                  </p>

                  <dl className="mt-4 flex flex-col gap-1.5 text-[13px]">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-2">{t({ de: "Zwischensumme", en: "Subtotal" })}</dt>
                      <dd className="font-mono tabular-nums text-ink">
                        {formatMoney(estimate.subtotal, currency, lang)}
                      </dd>
                    </div>

                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-2">{t({ de: "Versand", en: "Shipping" })}</dt>
                      <dd className="font-mono tabular-nums text-ink">
                        {estimate.shipping === 0
                          ? t({ de: "kostenfrei", en: "free" })
                          : formatMoney(estimate.shipping, currency, lang)}
                      </dd>
                    </div>

                    {estimate.clearance > 0 ? (
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-ink-2">{t({ de: "Zollabfertigung", en: "Customs clearance" })}</dt>
                        <dd className="font-mono tabular-nums text-ink">
                          {formatMoney(estimate.clearance, currency, lang)}
                        </dd>
                      </div>
                    ) : null}

                    <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
                        {t({ de: "Gesamt", en: "Total" })}
                      </dt>
                      <dd className="font-mono text-[15px] tabular-nums text-ink">
                        {formatMoney(estimate.total, currency, lang)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-1.5 text-[11px] leading-snug text-ink-3">
                    {t({
                      de: `davon ${formatMoney(estimate.vatIncluded, currency, lang)} ${taxNoun}`,
                      en: `of which ${formatMoney(estimate.vatIncluded, currency, lang)} ${taxNoun}`,
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
                    <p className="mt-2 max-w-[44ch] text-[11px] leading-snug text-ink-3">
                      {t({
                        de: regionConfig.customs.note,
                        en:
                          "Switzerland lies outside the EU customs union. We ship duty and tax paid. " +
                          "Import tax is included in the price, and customs clearance is shown above as " +
                          "a separate line. There are no further costs at the door.",
                      })}
                    </p>
                  ) : null}

                  <PaymentBadges region={region} className="mt-4" />

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className={buttonClasses("solid", "md", true)}
                    >
                      {t({ de: "Zur Kasse", en: "Checkout" })}
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className={buttonClasses("outline", "md", true)}
                    >
                      {t({ de: "Warenkorb ansehen", en: "View cart" })}
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
