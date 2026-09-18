"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/config/products";
import { useT } from "@/lib/i18n";
import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { useJingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Mirrors MAX_PER_LINE in lib/store, which caps a single line at ten units. */
const MAX_QUANTITY = 10;

/** How long the confirmation stays on screen, in milliseconds. */
const CONFIRM_MS = 2400;

/** The check is drawn, not shown: one stroke from the left foot to the right tip. */
function DrawnCheck({ size, reduce }: { size: number; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M3 8.5 L6.5 12 L13 4.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.32, ease: EASE_RITUAL }}
      />
    </motion.svg>
  );
}

export function AddToCart({ product, size = "lg" }: { product: Product; size?: "sm" | "lg" }) {
  const t = useT();
  const addItem = useJingStore((state) => state.addItem);
  const { hydrated } = useYinYang();
  const reduce = useReducedMotion() === true;

  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  // The confirmation hides itself after a moment. The timer is started by the
  // click and restarted by the next click, and cleared if the card unmounts.
  const confirmTimer = useRef<number | undefined>(undefined);
  // What the cart actually holds after the press, read back from the store.
  // The stepper value is not the same thing: the line is capped at ten, and the
  // stepper keeps moving after the confirmation appears.
  const [confirmedLine, setConfirmedLine] = useState(0);

  useEffect(() => () => window.clearTimeout(confirmTimer.current), []);

  const compact = size === "sm";
  const stepDisabled = !hydrated;

  function handleAdd() {
    addItem(product.id, quantity);
    const line = useJingStore
      .getState()
      .items.find((item) => item.productId === product.id);
    setConfirmedLine(line?.quantity ?? quantity);
    setConfirmed(true);
    window.clearTimeout(confirmTimer.current);
    confirmTimer.current = window.setTimeout(() => setConfirmed(false), CONFIRM_MS);
  }

  const stepButton = cn(
    "inline-flex items-center justify-center text-ink-2 transition-colors duration-300 ease-ritual",
    "hover:text-ink disabled:cursor-not-allowed disabled:text-ink-3",
    compact ? "h-9 w-9" : "h-11 w-11",
  );

  const swap = { duration: reduce ? 0 : DURATION.swap, ease: EASE_RITUAL };

  const addLabel = t({ de: "In den Warenkorb", en: "Add to cart" });

  const statusLine = confirmed
    ? confirmedLine >= MAX_QUANTITY
      ? t({
          de: `${product.code}: ${confirmedLine} im Warenkorb, mehr geht pro Bestellung nicht`,
          en: `${product.code}: ${confirmedLine} in the cart, the maximum per order`,
        })
      : t({
          de: `${product.code}: ${confirmedLine} im Warenkorb`,
          en: `${product.code}: ${confirmedLine} in the cart`,
        })
    : "";

  return (
    <div className={cn("flex flex-col", compact ? "gap-1.5" : "gap-2.5")}>
      <div className="flex items-stretch gap-2">
        <div
          role="group"
          aria-label={t({ de: `Menge, ${product.name}`, en: `Quantity, ${product.name}` })}
          className="flex items-center rounded-[2px] border border-control"
        >
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={stepDisabled || quantity <= 1}
            aria-label={t({ de: "Menge verringern", en: "Decrease quantity" })}
            className={stepButton}
          >
            <Minus size={compact ? 13 : 15} aria-hidden="true" />
          </button>

          <span
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "min-w-7 text-center font-mono tabular-nums text-ink",
              compact ? "text-[12px]" : "text-[13px]",
            )}
          >
            {quantity}
            <span className="sr-only">{t({ de: " Stück", en: " units" })}</span>
          </span>

          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
            disabled={stepDisabled || quantity >= MAX_QUANTITY}
            title={
              quantity >= MAX_QUANTITY
                ? t({
                    de: `Mehr als ${MAX_QUANTITY} pro Artikel und Bestellung sind nicht möglich`,
                    en: `No more than ${MAX_QUANTITY} of one item per order`,
                  })
                : undefined
            }
            aria-label={t({ de: "Menge erhöhen", en: "Increase quantity" })}
            className={stepButton}
          >
            <Plus size={compact ? 13 : 15} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1">
          <Button
            type="button"
            variant="solid"
            size={compact ? "sm" : "lg"}
            fullWidth
            onClick={handleAdd}
            disabled={!hydrated}
          >
            {/* Both labels share one grid cell, so the button is always as wide
                as the longer one and never jumps while they crossfade. */}
            <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
              <span className="invisible inline-flex items-center gap-2 whitespace-nowrap" aria-hidden="true">
                {addLabel}
              </span>
              <AnimatePresence initial={false} mode="wait">
                {confirmed ? (
                  <motion.span
                    key="done"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={swap}
                  >
                    <DrawnCheck size={compact ? 13 : 15} reduce={reduce} />
                    {t({ de: "Hinzugefügt", en: "Added" })}
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    className="inline-flex items-center justify-center whitespace-nowrap"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={swap}
                  >
                    {addLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </Button>
        </div>
      </div>

      {/* Always rendered so the confirmation does not push the layout around.
          Keyed on the line, so a new confirmation rises once and stays. */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-4 font-mono uppercase tracking-[0.14em] text-ink-3",
          compact ? "text-[10px]" : "text-[11px]",
        )}
      >
        <span key={statusLine} className={cn("block", statusLine && "jing-rise")}>
          {statusLine}
        </span>
      </p>
    </div>
  );
}
