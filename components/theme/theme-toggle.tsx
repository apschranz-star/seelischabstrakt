"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { useT } from "@/lib/i18n";
import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { originFromEvent } from "@/lib/switch-origin";
import { cn } from "@/lib/utils";

/**
 * The switch between the two rituals.
 *
 * It is a switch, not a single mark: a track with the sun on one side and the
 * moon on the other, and a disc that rests over the half that is live. Both
 * halves stay visible, so a visitor sees at a glance that there are two of them
 * and which one is on, instead of having to decode one symbol that means the
 * day in one mode and the night in the other.
 *
 * The surface behind it does the rest: the provider grows the new palette as an
 * eclipse from the pressed point, and this button is the one element in the tree
 * carrying data-switch-mark, which lifts it above the eclipse so the disc is
 * seen sliding while the page turns.
 *
 * Hydration: the element tree never depends on the mode. Only the disc's target
 * position and two text colours do, and before rehydration the mode is yang,
 * which is what the server rendered.
 */

/** Track geometry in px. The disc is the track height minus the padding. */
const TRACK_W = 58;
const TRACK_H = 28;
const PAD = 3;
const DISC = TRACK_H - PAD * 2;

function Sun() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="2.2"
          x2="12"
          y2="4.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      {/* One path, a disc with a bite taken out of it, so the crescent keeps a
          clean edge at any size and needs no mask. */}
      <path d="M20.2 14.6A9 9 0 0 1 9.4 3.8a9 9 0 1 0 10.8 10.8z" fill="currentColor" />
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useYinYang();
  const t = useT();
  const reduceMotion = useReducedMotion();
  const isYin = mode === "yin";
  const word = isYin ? "Yin" : "Yang";

  const slide = reduceMotion
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 420, damping: 34, mass: 0.7 } as const);

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
      aria-label={t({ de: "Nachtansicht Yin", en: "Night view Yin" })}
      title={
        isYin
          ? t({ de: "Yin, die Nacht. Klicken für Yang.", en: "Yin, the night. Click for Yang." })
          : t({ de: "Yang, der Tag. Klicken für Yin.", en: "Yang, the day. Click for Yin." })
      }
      className={cn("group inline-flex min-h-11 items-center gap-2.5 px-1", className)}
    >
      <span
        aria-hidden="true"
        style={{ width: TRACK_W, height: TRACK_H, padding: PAD }}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-between rounded-full",
          "border border-control transition-colors duration-[var(--duration-state)] ease-ritual",
          "group-hover:border-ink",
        )}
      >
        {/* The disc rests over the live half and slides to the other one. */}
        <motion.span
          className="absolute rounded-full bg-inverse-surface"
          style={{ width: DISC, height: DISC, left: PAD, top: PAD }}
          animate={{ x: isYin ? TRACK_W - DISC - PAD * 2 : 0 }}
          transition={slide}
        />
        {/* Both marks stay where they are. The one under the disc is drawn in the
            inverse ink so it reads on it, the other one recedes. */}
        <span
          className={cn(
            "relative z-10 flex w-[22px] items-center justify-center",
            "transition-colors duration-[var(--duration-swap)] ease-ritual",
            isYin ? "text-ink-3" : "text-inverse-ink",
          )}
        >
          <Sun />
        </span>
        <span
          className={cn(
            "relative z-10 flex w-[22px] items-center justify-center",
            "transition-colors duration-[var(--duration-swap)] ease-ritual",
            isYin ? "text-inverse-ink" : "text-ink-3",
          )}
        >
          <Moon />
        </span>
      </span>

      {/* The word names the ritual the shop is in. The button's own name already
          carries the state for assistive technology, so it is not announced
          twice. The wrapper clips to one line and reserves the width of the
          longer word, so the header never shifts while the words change. */}
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
