"use client";

import Link from "next/link";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";
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
      aria-label={`${copy.title}, ${copy.daypart}, Ritualfenster ${copy.hours} Uhr, ${
        active ? "Aktive Ansicht" : "Ansicht wechseln"
      }`}
      className={cn(
        "flex min-h-[24rem] flex-col justify-between py-12 text-left",
        "transition-opacity duration-700 ease-ritual md:min-h-[38rem] md:py-20",
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
      <span className="block">
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.22em]",
            active ? "text-ink-3" : "text-ink-2",
          )}
        >
          {copy.kicker}
        </span>
        <span className="mt-6 block font-display text-[clamp(3.25rem,11vw,6rem)] leading-[0.85] tracking-[0.06em] text-ink">
          {copy.title}
        </span>
        <span className="mt-4 block text-sm text-ink-2">{copy.daypart}</span>
      </span>

      <span className="mt-14 block">
        <span
          className={cn(
            "block font-mono text-[10px] uppercase tracking-[0.22em]",
            active ? "text-ink-3" : "text-ink-2",
          )}
        >
          Ritualfenster
        </span>
        <span className="mt-2 block font-mono text-[13px] tabular-nums text-ink">
          {copy.hours} Uhr
        </span>
        <span
          className={cn(
            "mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]",
            active ? "text-ink" : "text-ink-2",
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
        <Reveal from={collection === "yang" ? "left" : "right"}>
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
        </Reveal>

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
                <Reveal
                  key={product.id}
                  as="li"
                  from={index % 2 === 0 ? "left" : "right"}
                  delay={(index % 4) * 0.07}
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
          {facts.map((fact, index) => (
            <Reveal
              key={fact.label}
              as="li"
              from={index === 1 ? "up" : index === 0 ? "left" : "right"}
              delay={index * 0.06}
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
      />
      <CollectionSection collection="yin" active={activeMode === "yin"} onActivate={setMode} />

      <section aria-labelledby="these-titel" className="bg-inverse-surface text-inverse-ink">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24">
          <Reveal from="left">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inverse-ink/60">
              Die These
            </p>
            <h2
              id="these-titel"
              className="mt-5 max-w-[22ch] font-display text-3xl leading-tight tracking-[0.04em] sm:text-5xl"
            >
              Zwei Hälften, ein Regal
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 border-t border-line-2 pt-10 md:grid-cols-3">
            <Reveal from="left" delay={0.05}><p className="max-w-[46ch] text-sm leading-relaxed text-inverse-ink/80">
              Der Tag verlangt etwas anderes als die Nacht. Am Morgen zählt, was Struktur gibt und
              bis zum letzten Termin hält. Am Abend zählt, was zurücknimmt und der Haut die Arbeit
              überlässt.
            </p></Reveal>
            <Reveal from="up" delay={0.12}><p className="max-w-[46ch] text-sm leading-relaxed text-inverse-ink/80">
              Deshalb ist das Sortiment nicht nach Kategorien geordnet, sondern nach Tageszeit. Yang
              gehört zu den Stunden von {SITE.ritualWindow.yang} Uhr, Yin zu den Stunden von{" "}
              {SITE.ritualWindow.yin} Uhr. Jede Hälfte besteht aus vier Stücken, mehr braucht ein
              Ritual nicht.
            </p></Reveal>
            <Reveal from="right" delay={0.19}><p className="max-w-[46ch] text-sm leading-relaxed text-inverse-ink/80">
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
