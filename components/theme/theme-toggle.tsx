"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { originFromEvent } from "@/lib/switch-origin";
import { cn } from "@/lib/utils";

/**
 * The mode switch. The mark is a Yin Yang that rotates a half turn on every press,
 * which lands the opposite half on top. The surface behind it does the rest: the
 * provider grows the new palette as an eclipse from the pressed point, and this
 * button is the one element in the tree carrying data-switch-mark, which lifts
 * it onto its own layer above the eclipse so the half turn is seen live.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useYinYang();
  const reduceMotion = useReducedMotion();
  const isYin = mode === "yin";
  const word = isYin ? "Yin" : "Yang";

  return (
    <button
      type="button"
      data-switch-mark=""
      onClick={(event) => toggleMode({ origin: originFromEvent(event) })}
      // A toggle button keeps one name for the thing it controls and lets
      // aria-pressed carry the state. Naming the action instead would say
      // "switch to Yang" while the button reports itself as pressed, and would
      // contradict the visible word next to it.
      aria-pressed={isYin}
      aria-label="Nachtansicht Yin"
      title={isYin ? "Yin, die Nacht. Klicken für Yang." : "Yang, der Tag. Klicken für Yin."}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-control px-2.5 py-1.5",
        "transition-colors duration-[var(--duration-state)] ease-ritual hover:border-ink",
        className,
      )}
    >
      <motion.svg
        viewBox="0 0 40 40"
        width="22"
        height="22"
        aria-hidden="true"
        animate={{ rotate: isYin ? 180 : 0 }}
        // Tuned to settle with the eclipse: the half turn comes to rest in
        // about the 620 ms the disc takes to reach the far corner.
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 170, damping: 22, mass: 0.8 }
        }
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 1a19 19 0 0 1 0 38 9.5 9.5 0 0 1 0-19 9.5 9.5 0 0 0 0-19z"
          fill="currentColor"
        />
        <circle cx="20" cy="10.5" r="2.6" fill="var(--jing-surface)" />
        <circle cx="20" cy="29.5" r="2.6" fill="var(--jing-ink)" />
      </motion.svg>
      {/* The word shows the state to the eye. The button's own name already
          carries it for assistive technology, so it is not announced twice.
          The wrapper clips to one line and reserves the width of the longer
          word, so the header never shifts while one word slides out and the
          other slides in. */}
      <span
        aria-hidden="true"
        className="relative hidden h-[1em] overflow-hidden font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-ink-2 sm:inline-grid"
      >
        <span className="invisible col-start-1 row-start-1">Yang</span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={word}
            className="col-start-1 row-start-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : DURATION.swap, ease: EASE_RITUAL }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
