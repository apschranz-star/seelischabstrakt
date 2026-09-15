"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

import { ProductCard } from "@/components/product/product-card";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Button } from "@/components/ui/button";
import { getProductsByCollection } from "@/config/products";
import { DEFAULT_REGION, REGIONS, SITE, WITHDRAWAL_DAYS } from "@/config/site";
import type { Mode } from "@/lib/store";
import { cn, deliveryWindow } from "@/lib/utils";

/** The store opens on yang, so server markup and first client render agree on it. */
const FALLBACK_MODE: Mode = "yang";

interface RitualCopy {
  kicker: string;
  title: string;
  daypart: string;
  /** Hours of the day this collection belongs to, straight from the site config. */
  hours: string;
  lead: string;
  invite: string;
  cta: string;
}

const RITUAL: Record<Mode, RitualCopy> = {
  yang: {
    kicker: "Kollektion 01",
    title: "YANG",
    daypart: "der Tag",
    hours: SITE.ritualWindow.yang,
    lead:
      "Vier Stücke für das Licht. Texturen, die einen Arbeitstag überstehen, dazu eine Essenz, " +
      "die darunter weiterarbeitet.",
    invite: "Yang liegt gerade im Hintergrund. Ein Klick, und der Shop dreht sich auf den Tag.",
    cta: "Zu Yang wechseln",
  },
  yin: {
    kicker: "Kollektion 02",
    title: "YIN",
    daypart: "die Nacht",
    hours: SITE.ritualWindow.yin,
    lead:
      "Vier Stücke für das Halbdunkel. Öl, Stein und Duft, dazu ein Gerät, das den Raum vorbereitet.",
    invite: "Yin liegt gerade im Hintergrund. Ein Klick, und der Shop dreht sich auf die Nacht.",
    cta: "Zu Yin wechseln",
  },
};

/* --------------------------------------------------------------------- hero */

function RitualHalf({
  collection,
  active,
  onSelect,
}: {
  collection: Mode;
  active: boolean;
  onSelect: (mode: Mode) => void;
}) {
  const copy = RITUAL[collection];

  return (
    <button
      type="button"
      onClick={() => onSelect(collection)}
      aria-pressed={active}
      aria-controls={collection}
      aria-label={`${copy.title}, ${copy.daypart}, Ritualfenster ${copy.hours} Uhr, Kollektion anzeigen`}
      className={cn(
        "flex min-h-[24rem] flex-col justify-between py-12 text-left",
        "transition-opacity duration-700 ease-ritual md:min-h-[38rem] md:py-20",
        collection === "yang"
          ? "border-b border-line md:border-b-0 md:pr-14"
          : "pt-12 md:pl-14 md:pt-20",
        active ? "opacity-100" : "opacity-45 hover:opacity-80",
      )}
    >
      <span className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
          {copy.kicker}
        </span>
        <span className="mt-6 block font-display text-[clamp(3.25rem,11vw,6rem)] leading-[0.85] tracking-[0.06em] text-ink">
          {copy.title}
        </span>
        <span className="mt-4 block text-sm text-ink-2">{copy.daypart}</span>
      </span>

      <span className="mt-14 block">
        <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
          Ritualfenster
        </span>
        <span className="mt-2 block font-mono text-[13px] tabular-nums text-ink">
          {copy.hours} Uhr
        </span>
        <span
          className={cn(
            "mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]",
            active ? "text-ink" : "text-ink-3",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-px w-10 transition-colors duration-700 ease-ritual",
              active ? "bg-ink" : "bg-line-2",
            )}
          />
          {active ? "Aktive Ansicht" : "Ansicht wechseln"}
        </span>
      </span>
    </button>
  );
}

/* --------------------------------------------------------------- collections */

function CollectionSection({
  collection,
  active,
  onActivate,
}: {
  collection: Mode;
  active: boolean;
  onActivate: (mode: Mode) => void;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const copy = RITUAL[collection];
  const products = getProductsByCollection(collection);
  const headingId = `${collection}-titel`;

  // Durations are the only thing that reacts to the motion preference. Rendered styles
  // stay identical, otherwise the server markup and the first client render diverge.
  const swap = { duration: reduceMotion ? 0 : 0.28, ease: "easeOut" } as const;

  return (
    <section
      id={collection}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-b border-line py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line pb-6">
          <div>
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
          </div>
          <p className="font-mono text-[11px] tabular-nums uppercase tracking-[0.18em] text-ink-3">
            {copy.hours} Uhr
          </p>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {active ? (
            <motion.ul
              key="grid"
              role="list"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={swap}
              className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {products.map((product, index) => (
                <motion.li
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.42,
                    delay: reduceMotion ? 0 : index * 0.06,
                    ease: "easeOut",
                  }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.li>
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

  // Persisted values only after rehydration, so the first paint matches the server.
  const activeMode = hydrated ? mode : FALLBACK_MODE;
  const activeRegion = REGIONS[hydrated ? region : DEFAULT_REGION];

  // A deep link such as /#yin should open the night side, not only scroll to it.
  useEffect(() => {
    if (!hydrated) return;

    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "yin" || hash === "yang") setMode(hash);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [hydrated, setMode]);

  const facts = [
    { label: "Versand", value: `aus ${SITE.warehouse.city}, ${SITE.warehouse.country}` },
    { label: "Lieferzeit", value: `${deliveryWindow(activeRegion)} nach ${activeRegion.label}` },
    { label: "Widerruf", value: `${WITHDRAWAL_DAYS} Tage, ohne Angabe von Gründen` },
  ];

  return (
    <>
      <section className="border-b border-line">
        <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <h1
            className={cn(
              "pt-12 text-center font-display text-[clamp(2rem,9vw,2.75rem)] leading-tight tracking-[0.04em] text-ink",
              "md:pointer-events-none md:absolute md:left-1/2 md:top-1/2 md:z-10 md:whitespace-nowrap",
              "md:-translate-x-1/2 md:-translate-y-1/2 md:pt-0 md:text-[clamp(1.75rem,4vw,3.5rem)]",
            )}
          >
            {SITE.claim}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <RitualHalf collection="yang" active={activeMode === "yang"} onSelect={setMode} />
            <RitualHalf collection="yin" active={activeMode === "yin"} onSelect={setMode} />
          </div>

          <span
            aria-hidden="true"
            className="jing-spine absolute inset-y-0 left-1/2 hidden w-px md:block"
          />
        </div>
      </section>

      <section aria-label="Versand, Lieferzeit und Widerruf" className="border-b border-line">
        <ul
          role="list"
          className="mx-auto grid w-full max-w-[1240px] grid-cols-1 px-4 sm:grid-cols-3 sm:px-6"
        >
          {facts.map((fact) => (
            <li
              key={fact.label}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line py-4 last:border-b-0 sm:border-b-0 sm:py-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
                {fact.label}
              </span>
              <span className="text-sm text-ink-2">{fact.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <CollectionSection
        collection="yang"
        active={activeMode === "yang"}
        onActivate={setMode}
      />
      <CollectionSection collection="yin" active={activeMode === "yin"} onActivate={setMode} />

      <section aria-labelledby="these-titel" className="bg-inverse-surface text-inverse-ink">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inverse-ink/60">
            Die These
          </p>
          <h2
            id="these-titel"
            className="mt-5 max-w-[22ch] font-display text-3xl leading-tight tracking-[0.04em] sm:text-5xl"
          >
            Zwei Hälften, ein Regal
          </h2>

          <div className="mt-12 grid gap-8 border-t border-line-2 pt-10 md:grid-cols-3">
            <p className="max-w-[46ch] text-sm leading-relaxed text-inverse-ink/80">
              Der Tag verlangt etwas anderes als die Nacht. Am Morgen zählt, was Struktur gibt und
              bis zum letzten Termin hält. Am Abend zählt, was zurücknimmt und der Haut die Arbeit
              überlässt.
            </p>
            <p className="max-w-[46ch] text-sm leading-relaxed text-inverse-ink/80">
              Deshalb ist das Sortiment nicht nach Kategorien geordnet, sondern nach Tageszeit. Yang
              gehört zu den Stunden von {SITE.ritualWindow.yang} Uhr, Yin zu den Stunden von{" "}
              {SITE.ritualWindow.yin} Uhr. Jede Hälfte besteht aus vier Stücken, mehr braucht ein
              Ritual nicht.
            </p>
            <p className="max-w-[46ch] text-sm leading-relaxed text-inverse-ink/80">
              Was daraus entsteht, ist weniger eine Routine als eine Gewohnheit mit zwei Seiten. Du
              entscheidest, welche gerade gilt, und der Shop richtet sich danach aus, in der Ansicht
              wie im Sortiment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
