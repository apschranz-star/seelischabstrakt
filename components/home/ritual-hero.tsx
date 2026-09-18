"use client";

/*
 * The hero, drawn in three planes.
 *
 * Plane 0, deep: the kicker, the giant word and the daypart of each half. They
 * lag behind the page by DISTANCE.depth over the height of the hero, so the
 * words seem to sit further back than the paper they are printed on.
 * Plane 1, mid: the Ritualfenster block. It scrolls with the page, untouched.
 * Plane 2, near: the claim. It leaves first, 48 px ahead of the page, and only
 * starts to fade once more than half the hero has gone by. The spine dims to
 * a third of its strength on the way, so the line hands over to the sections.
 *
 * Everything is driven by one scroll progress from the top of the hero to the
 * point where its bottom edge meets the top of the viewport. At progress 0
 * every value is its identity, y 0, opacity 1, which is exactly what the server
 * renders, so hydration matches without a branch. Under reduced motion every
 * value stays at that identity for the whole visit.
 *
 * One frame is accepted on a reload with browser scroll restoration: the
 * browser puts the viewport back first, framer measures in the effect that
 * follows, and the planes move to their positions on the next frame. Only
 * transforms and opacity change in that frame, never layout, so it costs
 * nothing in cumulative layout shift.
 *
 * The section clips its overflow, so the deep plane can never cross the
 * hairline into the facts band beneath it.
 */

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { RITUAL } from "@/components/home/ritual-copy";
import { useT } from "@/lib/i18n";
import { DISTANCE, useReduceRef, useScrollDrive } from "@/lib/motion";
import type { Mode } from "@/lib/store";
import { originFromEvent, type SwitchOptions } from "@/lib/switch-origin";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * A half was chosen. The point the visitor touched travels along, and the
 * provider grows the new palette as an eclipse from there.
 */
export type RitualSelect = (mode: Mode, options?: SwitchOptions) => void;

/** How far the claim runs ahead of the page. */
const CLAIM_LEAD = -48;

function RitualHalf({
  collection,
  active,
  onSelect,
  depth,
}: {
  collection: Mode;
  active: boolean;
  onSelect: RitualSelect;
  /** The shared lag of plane 0, in pixels. */
  depth: MotionValue<number>;
}) {
  const t = useT();
  const copy = RITUAL[collection];
  const hours = t({ de: `${copy.hours.de} Uhr`, en: copy.hours.en });
  const state = active
    ? t({ de: "Aktive Ansicht", en: "Active view" })
    : t({ de: "Ansicht wechseln", en: "Switch view" });

  return (
    <button
      type="button"
      onClick={(event) => onSelect(collection, { origin: originFromEvent(event) })}
      aria-pressed={active}
      /*
        Kein aria-controls und kein eigenes aria-label.
        aria-controls zeigte auf den Abschnitt der Kollektion, und seit die Seite
        nur noch eine Kollektion zeigt, gibt es den anderen im Baum gar nicht: ein
        Verweis ins Leere, den die Pruefung zu Recht beanstandet.
        Ein eigenes Label wiederum muss den sichtbaren Text enthalten, sonst
        spricht die Vorlesehilfe etwas anderes vor, als dasteht. Der Knopf traegt
        seinen Text ohnehin: Kollektion, Name, Tageszeit, Ritualfenster und den
        Zustand. Das ist sein Name, vollstaendig und ohne zweite Fassung, die
        auseinanderlaufen kann.
      */
      className={cn(
        "flex min-h-[24rem] flex-col justify-between py-12 text-left",
        "transition-opacity duration-[var(--duration-ritual)] ease-ritual md:min-h-[38rem] md:py-20",
        collection === "yang"
          ? "border-b border-line md:border-b-0 md:pr-14"
          : "pt-12 md:pl-14 md:pt-20",
        // The inactive half is dimmed, not hidden. At opacity 0.45 its small
        // type fell to 1.86:1, well under the 4.5:1 of Erfolgskriterium 1.4.3.
        // 0.75 with ink-2 instead of ink-3 keeps the recessed look and lands at
        // 4.98:1 on the day surface and 6.91:1 on the night surface.
        active ? "opacity-100" : "opacity-75 hover:opacity-90",
      )}
    >
      {/* Plane 0. The only will-change in the hero, one per half. */}
      <motion.span className="block" style={{ y: depth, willChange: "transform" }}>
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.22em]",
            active ? "text-ink-3" : "text-ink-2",
          )}
        >
          {t(copy.kicker)}
        </span>
        <span className="mt-6 block font-display text-[clamp(3.25rem,11vw,6rem)] leading-[0.85] tracking-[0.06em] text-ink">
          {t(copy.title)}
        </span>
        <span className="mt-4 block text-sm text-ink-2">{t(copy.daypart)}</span>
      </motion.span>

      {/* Plane 1. Scrolls with the page. */}
      <span className="mt-14 block">
        <span
          className={cn(
            "block font-mono text-[10px] uppercase tracking-[0.22em]",
            active ? "text-ink-3" : "text-ink-2",
          )}
        >
          {t({ de: "Ritualfenster", en: "Ritual window" })}
        </span>
        <span className="mt-2 block font-mono text-[13px] tabular-nums text-ink">{hours}</span>
        <span
          className={cn(
            "mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]",
            active ? "text-ink" : "text-ink-2",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-px w-10 transition-colors duration-[var(--duration-ritual)] ease-ritual",
              active ? "bg-ink" : "bg-line-2",
            )}
          />
          {state}
        </span>
      </span>
    </button>
  );
}

export function RitualHero({
  activeMode,
  onSelect,
}: {
  activeMode: Mode;
  onSelect: RitualSelect;
}) {
  const section = useRef<HTMLElement>(null);
  const reduce = useReduceRef();
  const { scrollYProgress: progress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  const depth = useScrollDrive(progress, 0, DISTANCE.depth, reduce);
  const claimY = useScrollDrive(progress, 0, CLAIM_LEAD, reduce);
  // Fully visible until 55 percent of the hero has passed, gone at 95 percent.
  const claimOpacity = useTransform(progress, (v) =>
    reduce.current ? 1 : v < 0.55 ? 1 : Math.max(0, 1 - (v - 0.55) / 0.4),
  );
  const spineOpacity = useScrollDrive(progress, 1, 0.35, reduce);

  return (
    <section ref={section} className="jing-hero border-b border-line">
      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        {/* Plane 2. The Tailwind centring uses the translate property, framer
            writes transform, so the two never fight over one declaration. */}
        <motion.h1
          style={{ y: claimY, opacity: claimOpacity }}
          className={cn(
            "pt-12 text-center font-display text-[clamp(2rem,9vw,2.75rem)] leading-tight tracking-[0.04em] text-ink",
            "md:pointer-events-none md:absolute md:left-1/2 md:top-1/2 md:z-10 md:whitespace-nowrap",
            "md:-translate-x-1/2 md:-translate-y-1/2 md:pt-0 md:text-[clamp(1.75rem,4vw,3.5rem)]",
          )}
        >
          {SITE.claim}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <RitualHalf
            collection="yang"
            active={activeMode === "yang"}
            onSelect={onSelect}
            depth={depth}
          />
          <RitualHalf
            collection="yin"
            active={activeMode === "yin"}
            onSelect={onSelect}
            depth={depth}
          />
        </div>

        <motion.span
          aria-hidden="true"
          style={{ opacity: spineOpacity }}
          className="jing-spine absolute inset-y-0 left-1/2 hidden w-px md:block"
        />
      </div>
    </section>
  );
}
