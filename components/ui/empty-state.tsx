"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { RitualMark } from "@/components/ui/celestial";
import { useT } from "@/lib/i18n";
import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * One empty state for the drawer, the cart page and the checkout.
 *
 * The mark is the sun or the moon, whichever time of day the shop is in, drawn
 * as a ring that closes once on mount. It used to be the taiji, circle and seam
 * in one figure, which is the picture of both rituals at once: the one thing
 * this shop never shows. The ring is the hour the visitor is in, and it carries
 * the same sign as the switch and the hero.
 *
 * The element tree never depends on the motion preference. useReducedMotion is
 * null on the server and a boolean on the client, and only the duration reads
 * it, so the server markup and the first client render carry the same nodes.
 * The mode does not branch the tree either: before rehydration it is yang,
 * exactly what the server rendered.
 */
export function EmptyState({
  kicker,
  title,
  text,
  actions,
  compact = false,
  className,
}: {
  kicker?: string;
  title: string;
  text: string;
  actions: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const t = useT();
  const { mode, hydrated } = useYinYang();
  const reduce = useReducedMotion() === true;
  const draw = {
    duration: reduce ? 0 : DURATION.slow,
    ease: EASE_RITUAL,
  };

  return (
    <div className={cn("flex flex-col items-start", className)}>
      {/* Der Ring schliesst sich einmal beim Mounten, danach tritt das Zeichen
          der Tageszeit in seine Mitte. Zwei Elemente uebereinander statt eines
          verschachtelten SVG: die Groesse des Zeichens haengt dann an nichts als
          an sich selbst. */}
      <span
        aria-hidden="true"
        className="relative inline-flex h-12 w-12 items-center justify-center text-ink-3"
      >
        <motion.svg
          viewBox="0 0 40 40"
          className="absolute inset-0 h-12 w-12"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          initial="hidden"
          animate="drawn"
        >
          <motion.circle
            cx="20"
            cy="20"
            r="19"
            variants={{ hidden: { pathLength: 0 }, drawn: { pathLength: 1 } }}
            transition={draw}
          />
        </motion.svg>
        <motion.span
          className="relative flex"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...draw, delay: reduce ? 0 : DURATION.state }}
        >
          <RitualMark mode={hydrated ? mode : "yang"} size={18} />
        </motion.span>
      </span>

      <p className={cn("type-kicker text-ink-3", compact ? "mt-5" : "mt-7")}>
        {kicker ?? t({ de: "Leer", en: "Empty" })}
      </p>
      <h2
        className={cn(
          "mt-3 font-display leading-tight text-ink",
          compact ? "text-xl" : "text-2xl",
        )}
      >
        {title}
      </h2>
      <p className="type-body mt-3 max-w-[42ch] text-ink-2">{text}</p>
      <div className={cn("flex flex-wrap gap-3", compact ? "mt-6" : "mt-8")}>{actions}</div>
    </div>
  );
}
