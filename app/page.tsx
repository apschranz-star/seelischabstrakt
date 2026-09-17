"use client";

import Link from "next/link";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { RITUAL } from "@/components/home/ritual-copy";
import { RitualHero } from "@/components/home/ritual-hero";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, STAGGER } from "@/components/ui/reveal";
import { SectionHandoff } from "@/components/ui/section-handoff";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Button } from "@/components/ui/button";
import { getProductsByCollection } from "@/config/products";
import { DEFAULT_REGION, REGIONS, SITE, WITHDRAWAL_DAYS } from "@/config/site";
import { DURATION } from "@/lib/motion";
import { useJingStore, type Mode } from "@/lib/store";
import { deliveryWindow } from "@/lib/utils";

/** The store opens on yang, so server markup and first client render agree on it. */
const FALLBACK_MODE: Mode = "yang";

/* --------------------------------------------------------------- collections */

function CollectionSection({
  collection,
  active,
  onActivate,
  instant,
}: {
  collection: Mode;
  active: boolean;
  onActivate: (mode: Mode) => void;
  /** Cards appear at once instead of gliding in, after a switch the visitor made. */
  instant: boolean;
}) {
  // After a switch the visitor made, the grid that appears is what they want
  // to see. It mounts once the old one has faded out, so the scroll happens
  // here, on mount, not on the click. The first load never scrolls.
  const gridMounted = useCallback(
    (node: HTMLUListElement | null) => {
      if (!node || !instant) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [instant],
  );
  const reduceMotion = useReducedMotion() ?? false;
  const section = useRef<HTMLElement>(null);
  const copy = RITUAL[collection];
  const products = getProductsByCollection(collection);
  const headingId = `${collection}-titel`;
  const side = collection === "yang" ? "left" : "right";
  const otherSide = collection === "yang" ? "right" : "left";

  // Durations are the only thing that reacts to the motion preference. Rendered styles
  // stay identical, otherwise the server markup and the first client render diverge.
  const swap = { duration: reduceMotion ? 0 : DURATION.swift, ease: "easeOut" } as const;

  return (
    <section
      ref={section}
      id={collection}
      aria-labelledby={headingId}
      className="relative scroll-mt-24 border-b border-line py-[var(--space-section)]"
    >
      <SectionHandoff target={section} />
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        {/* The heading row closes toward the centre like the two halves of the
            hero: the heading from the collection's own side, the hours from the
            other. The rule under them belongs to a plain div and never moves. */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line pb-6">
          <Reveal from={side}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              {copy.kicker}
            </p>
            <h2
              id={headingId}
              className="mt-3 font-display text-3xl tracking-[0.06em] text-ink sm:text-4xl"
            >
              {copy.title}, {copy.daypart}
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-2">{copy.lead}</p>
          </Reveal>
          <Reveal from={otherSide} delay={STAGGER}>
            <p className="font-mono text-[11px] tabular-nums uppercase tracking-[0.18em] text-ink-3">
              {copy.hours} Uhr
            </p>
          </Reveal>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {active ? (
            <motion.ul
              key="grid"
              ref={gridMounted}
              role="list"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={swap}
              className="mt-8 scroll-mt-24 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {products.map((product, index) => (
                <Reveal
                  key={product.id}
                  as="li"
                  from={instant ? "none" : index % 2 === 0 ? "left" : "right"}
                  delay={instant ? 0 : (index % 4) * STAGGER}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="invite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={swap}
              className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5"
            >
              <p className="max-w-[48ch] text-sm leading-relaxed text-ink-3">{copy.invite}</p>
              <Button variant="outline" size="sm" onClick={() => onActivate(collection)}>
                {copy.cta}
              </Button>

              {/*
                Opening the other side is a JavaScript switch, so without it half
                the catalogue would have no link anywhere on the page. These go
                straight to the product pages, which are static.
              */}
              <noscript>
                <ul role="list" className="flex w-full flex-wrap gap-x-5 gap-y-2">
                  {products.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 underline underline-offset-4 hover:text-ink"
                      >
                        {product.code}, {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </noscript>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- page */

export default function HomePage() {
  const { mode, setMode, region, hydrated } = useYinYang();
  const modeSwitched = useJingStore((state) => state.modeSwitched);
  const thesis = useRef<HTMLElement>(null);

  // Persisted values only after rehydration, so the first paint matches the server.
  const activeMode = hydrated ? mode : FALLBACK_MODE;
  const activeRegion = REGIONS[hydrated ? region : DEFAULT_REGION];

  // A deep link such as /#yin should open the night side, not only scroll to it.
  //
  // hashchange alone is not enough. The App Router navigates with
  // history.pushState, which fires no hashchange, so clicking Yin in the header
  // while already on the home page would scroll to a section that is still
  // showing its dimmed placeholder. Listening to click in the capture phase
  // catches the in page link before the router handles it; hashchange and
  // popstate still cover the browser's own back and forward.
  useEffect(() => {
    if (!hydrated) return;

    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "yin" || hash === "yang") setMode(hash);
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      // endsWith, because a basePath (the static demo under /seelischabstrakt/jing)
      // is prepended to every href and would otherwise defeat the exact match.
      const href = anchor?.getAttribute("href") ?? "";
      if (href.endsWith("#yin")) setMode("yin");
      if (href.endsWith("#yang")) setMode("yang");
    };

    applyHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", applyHash);
    window.addEventListener("popstate", applyHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", applyHash);
      window.removeEventListener("popstate", applyHash);
    };
  }, [hydrated, setMode]);

  const facts = [
    { label: "Versand", value: `aus ${SITE.warehouse.city}, ${SITE.warehouse.country}` },
    { label: "Lieferzeit", value: `${deliveryWindow(activeRegion)} nach ${activeRegion.label}` },
    { label: "Widerruf", value: `${WITHDRAWAL_DAYS} Tage, ohne Angabe von Gründen` },
  ];

  return (
    <>
      <RitualHero activeMode={activeMode} onSelect={setMode} />

      <section aria-label="Versand, Lieferzeit und Widerruf" className="border-b border-line">
        <ul
          role="list"
          className="mx-auto grid w-full max-w-[1240px] grid-cols-1 px-4 sm:grid-cols-3 sm:px-6"
        >
          {facts.map((fact, index) => (
            <Reveal
              key={fact.label}
              as="li"
              from={index === 1 ? "up" : index === 0 ? "left" : "right"}
              delay={index * STAGGER}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line py-4 last:border-b-0 sm:border-b-0 sm:py-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
                {fact.label}
              </span>
              <span className="text-sm text-ink-2">{fact.value}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <CollectionSection
        collection="yang"
        active={activeMode === "yang"}
        onActivate={setMode}
        instant={modeSwitched}
      />
      <CollectionSection
        collection="yin"
        active={activeMode === "yin"}
        onActivate={setMode}
        instant={modeSwitched}
      />

      {/* Stays inside the active palette. An inverted band read as a white block
          slammed into the night view; the section now sits on surface-2 in both. */}
      <section
        ref={thesis}
        aria-labelledby="these-titel"
        className="relative border-t border-line bg-surface-2 text-ink"
      >
        <SectionHandoff target={thesis} />
        <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24">
          <Reveal from="left">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              Die These
            </p>
            <h2
              id="these-titel"
              className="mt-5 max-w-[22ch] font-display text-3xl leading-tight tracking-[0.04em] sm:text-5xl"
            >
              Zwei Hälften, ein Regal
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
            <Reveal from="left" delay={0}><p className="max-w-[46ch] text-sm leading-relaxed text-ink-2">
              Der Tag verlangt etwas anderes als die Nacht. Am Morgen zählt, was Struktur gibt und
              bis zum letzten Termin hält. Am Abend zählt, was zurücknimmt und der Haut die Arbeit
              überlässt.
            </p></Reveal>
            <Reveal from="up" delay={STAGGER}><p className="max-w-[46ch] text-sm leading-relaxed text-ink-2">
              Deshalb ist das Sortiment nicht nach Kategorien geordnet, sondern nach Tageszeit. Yang
              gehört zu den Stunden von {SITE.ritualWindow.yang} Uhr, Yin zu den Stunden von{" "}
              {SITE.ritualWindow.yin} Uhr. Jede Hälfte hat fünf Stücke, mehr braucht ein
              Ritual nicht.
            </p></Reveal>
            <Reveal from="right" delay={2 * STAGGER}><p className="max-w-[46ch] text-sm leading-relaxed text-ink-2">
              Was daraus entsteht, ist weniger eine Routine als eine Gewohnheit mit zwei Seiten. Du
              entscheidest, welche gerade gilt, und der Shop richtet sich danach aus, in der Ansicht
              wie im Sortiment.
            </p></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
