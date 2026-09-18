"use client";

/*
 * The hero, drawn in three planes.
 *
 * One ritual, and only one. The shop stands in a time of day, and the hero is
 * the portrait of that time. It used to be two halves side by side, the live one
 * bright and the other dimmed, which put Yang and Yin on the screen together and
 * turned the shop into a menu of two. The other ritual is not here: not dimmed,
 * not small, not in the document at all. The switch in the header is the only
 * way to it.
 *
 * Plane 0, deep: the kicker, the giant word and the daypart. They lag behind the
 * page by DISTANCE.depth over the height of the hero, so the words seem to sit
 * further back than the paper they are printed on.
 * Plane 1, mid: the ritual window and the lead. They scroll with the page.
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

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { RITUAL } from "@/components/home/ritual-copy";
import { RitualMark } from "@/components/ui/celestial";
import { useT } from "@/lib/i18n";
import { DISTANCE, useReduceRef, useScrollDrive } from "@/lib/motion";
import type { Mode } from "@/lib/store";
import { SITE } from "@/config/site";

/** How far the claim runs ahead of the page. */
const CLAIM_LEAD = -48;

export function RitualHero({ activeMode }: { activeMode: Mode }) {
  const section = useRef<HTMLElement>(null);
  const reduce = useReduceRef();
  const t = useT();
  const copy = RITUAL[activeMode];
  const title = t(copy.title);
  const daypart = t(copy.daypart);
  const hours = t({ de: `${copy.hours.de} Uhr`, en: copy.hours.en });

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
    <section
      ref={section}
      // The name is the ritual, in the words that stand in it.
      aria-label={`${title}, ${daypart}`}
      className="jing-hero border-b border-line"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        {/* Plane 2. The claim used to hang in the middle of the hero, centred
            over the gutter between the two halves. There is no gutter any more,
            so it would lie across the word and the lead. It stands at the top
            now, which is also where it belongs: first the house, then the hour.
            The Tailwind centring uses the translate property, framer writes
            transform, so the two never fight over one declaration. */}
        <motion.h1
          style={{ y: claimY, opacity: claimOpacity }}
          className="py-12 text-center font-display text-[clamp(2rem,7vw,3.25rem)] leading-tight tracking-[0.04em] text-ink md:py-16"
        >
          {SITE.claim}
        </motion.h1>

        {/* One ritual across the full width. The word stands on the left, the
            hours and the lead on the right, and the rule between them is the
            same line that used to separate the two halves: the composition keeps
            its spine, it just no longer divides two things. */}
        <div className="relative grid grid-cols-1 border-t border-line md:grid-cols-2">
          <div className="flex min-h-[16rem] flex-col justify-center py-12 md:min-h-[26rem] md:py-16 md:pr-14">
            {/* Plane 0. The only will-change in the hero. */}
            <motion.div style={{ y: depth, willChange: "transform" }}>
              {/* The same mark as the switch: a sun for the day, a moon for the
                  night. Whoever has seen the switch once knows at a glance what
                  time of day the shop is in, without reading a word. */}
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
                <RitualMark mode={activeMode} size={13} />
                {t(copy.kicker)}
              </p>
              <p className="mt-6 font-display text-[clamp(3.5rem,12vw,7rem)] leading-[0.85] tracking-[0.06em] text-ink">
                {title}
              </p>
              <p className="mt-4 text-sm text-ink-2">{daypart}</p>
            </motion.div>
          </div>

          {/* Plane 1. Scrolls with the page. */}
          <div className="flex flex-col justify-center border-t border-line py-10 md:border-t-0 md:py-16 md:pl-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
              {t({ de: "Ritualfenster", en: "Ritual window" })}
            </p>
            <p className="mt-2 font-mono text-[13px] tabular-nums text-ink">{hours}</p>
            <span aria-hidden="true" className="mt-6 block h-px w-10 bg-line-2" />
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-ink-2">{t(copy.lead)}</p>
          </div>

          <motion.span
            aria-hidden="true"
            style={{ opacity: spineOpacity }}
            className="jing-spine absolute inset-y-0 left-1/2 hidden w-px md:block"
          />
        </div>
      </div>
    </section>
  );
}
