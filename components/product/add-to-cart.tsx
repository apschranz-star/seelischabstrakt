"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/config/products";
import { useJingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Mirrors MAX_PER_LINE in lib/store, which caps a single line at ten units. */
const MAX_QUANTITY = 10;

/** How long the confirmation stays on screen, in milliseconds. */
const CONFIRM_MS = 2400;

export function AddToCart({ product, size = "lg" }: { product: Product; size?: "sm" | "lg" }) {
  const addItem = useJingStore((state) => state.addItem);
  const { hydrated } = useYinYang();

  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  // A counter, not a timestamp. Dates in render would desync server and client,
  // and bumping it restarts the timer when the button is pressed twice in a row.
  const [addCount, setAddCount] = useState(0);
  // What the cart actually holds after the press, read back from the store.
  // The stepper value is not the same thing: the line is capped at ten, and the
  // stepper keeps moving after the confirmation appears.
  const [confirmedLine, setConfirmedLine] = useState(0);

  useEffect(() => {
    if (addCount === 0) return;
    setConfirmed(true);
    const timer = window.setTimeout(() => setConfirmed(false), CONFIRM_MS);
    return () => window.clearTimeout(timer);
  }, [addCount]);

  const compact = size === "sm";
  const stepDisabled = !hydrated;

  function handleAdd() {
    addItem(product.id, quantity);
    const line = useJingStore
      .getState()
      .items.find((item) => item.productId === product.id);
    setConfirmedLine(line?.quantity ?? quantity);
    setAddCount((count) => count + 1);
  }

  const stepButton = cn(
    "inline-flex items-center justify-center text-ink-2 transition-colors duration-300 ease-ritual",
    "hover:text-ink disabled:cursor-not-allowed disabled:text-ink-3",
    compact ? "h-9 w-9" : "h-11 w-11",
  );

  return (
    <div className={cn("flex flex-col", compact ? "gap-1.5" : "gap-2.5")}>
      <div className="flex items-stretch gap-2">
        <div
          role="group"
          aria-label={`Menge, ${product.name}`}
          className="flex items-center rounded-[2px] border border-control"
        >
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={stepDisabled || quantity <= 1}
            aria-label="Menge verringern"
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
            <span className="sr-only"> Stück</span>
          </span>

          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
            disabled={stepDisabled || quantity >= MAX_QUANTITY}
            title={quantity >= MAX_QUANTITY ? `Mehr als ${MAX_QUANTITY} pro Artikel und Bestellung sind nicht möglich` : undefined}
            aria-label="Menge erhöhen"
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
            {confirmed ? (
              <span className="inline-flex items-center gap-2">
                <Check size={compact ? 13 : 15} aria-hidden="true" />
                Hinzugefügt
              </span>
            ) : (
              "In den Warenkorb"
            )}
          </Button>
        </div>
      </div>

      {/* Always rendered so the confirmation does not push the layout around. */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-4 font-mono uppercase tracking-[0.14em] text-ink-3",
          compact ? "text-[10px]" : "text-[11px]",
        )}
      >
        {confirmed
          ? confirmedLine >= MAX_QUANTITY
            ? `${product.code}: ${confirmedLine} im Warenkorb, mehr geht pro Bestellung nicht`
            : `${product.code}: ${confirmedLine} im Warenkorb`
          : ""}
      </p>
    </div>
  );
}
