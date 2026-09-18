"use client";


import { useEffect, useRef, useState } from "react";

import { RITUAL } from "@/components/home/ritual-copy";
import { RitualHero } from "@/components/home/ritual-hero";
import { RitualStory } from "@/components/home/ritual-story";
import { ProductCard } from "@/components/product/product-card";
import { RitualMark } from "@/components/ui/celestial";
import { Reveal, STAGGER } from "@/components/ui/reveal";
import { SectionHandoff } from "@/components/ui/section-handoff";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { getProductsByCollection } from "@/config/products";
import { DEFAULT_REGION, REGIONS, SITE, WITHDRAWAL_DAYS } from "@/config/site";
import { useLang, useT } from "@/lib/i18n";
import { useJingStore, type Mode } from "@/lib/store";
import { originFromEvent } from "@/lib/switch-origin";
import { deliveryWindow } from "@/lib/utils";

/** The store opens on yang, so server markup and first client render agree on it. */
const FALLBACK_MODE: Mode = "yang";

/* --------------------------------------------------------------- collections */

function CollectionSection({
  collection,
  instant,
}: {
  collection: Mode;
  /** Cards appear at once instead of gliding in, after a switch the visitor made. */
  instant: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  // After a switch the visitor made, the story of the ritual they chose is what
  // they want to read, with the five pieces beneath it. Story and grid mount
  // together once the old side has faded out, so the scroll happens on mount and
  // lands on the top of the section. The first load never scrolls.
  //
  // In an effect, not in a ref callback: React attaches refs from the inside out,
  // so a callback on a child still sees section.current as null and the jump was
  // silently skipped every single time.
  //
  // The flag is read once, at mount, and cleared right afterwards. Left standing
  // it would scroll the visitor past the hero on every later return to the start
  // page, and the cards would keep appearing without their choreography.
  const clearSwitch = useJingStore((state) => state.clearModeSwitch);
  // A snapshot, taken once when this section mounts. Clearing the flag makes the
  // parent hand down instant={false} on the next render, and a live read would
  // restart the reveal choreography under the visitor's eyes.
  const [jump] = useState(instant);
  useEffect(() => {
    if (!jump) return;
    clearSwitch();
    const node = section.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [jump, clearSwitch]);
  const t = useT();
  const copy = RITUAL[collection];
  const title = t(copy.title);
  const products = getProductsByCollection(collection);
  const headingId = `${collection}-titel`;
  const side = collection === "yang" ? "left" : "right";
  const otherSide = collection === "yang" ? "right" : "left";

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
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              <RitualMark mode={collection} size={13} />
              {t(copy.kicker)}
            </p>
            <h2
              id={headingId}
              className="mt-3 font-display text-3xl tracking-[0.06em] text-ink sm:text-4xl"
            >
              {title}, {t(copy.daypart)}
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-2">{t(copy.lead)}</p>
          </Reveal>
          <Reveal from={otherSide} delay={STAGGER}>
            <p className="font-mono text-[11px] tabular-nums uppercase tracking-[0.18em] text-ink-3">
              {t({ de: `${copy.hours.de} Uhr`, en: copy.hours.en })}
            </p>
          </Reveal>
        </div>

        <div>
          <RitualStory collection={collection} instant={jump} />
          <ul
            id={`${collection}-produkte`}
            role="list"
            aria-label={t({
              de: `Die fünf Stücke von ${title}`,
              en: `The five pieces of ${title}`,
            })}
            className="mt-10 scroll-mt-24 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {products.map((product, index) => (
              <Reveal
                key={product.id}
                as="li"
                from={jump ? "none" : index % 2 === 0 ? "left" : "right"}
                delay={jump ? 0 : (index % 4) * STAGGER}
                className="h-full"
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- page */

export default function HomePage() {
  const { mode, setMode, region, hydrated } = useYinYang();
  const modeSwitched = useJingStore((state) => state.modeSwitched);
  const lang = useLang();
  const t = useT();
  const thesis = useRef<HTMLElement>(null);

  // Persisted values only after rehydration, so the first paint matches the server.
  const activeMode = hydrated ? mode : FALLBACK_MODE;
  const activeRegion = REGIONS[hydrated ? region : DEFAULT_REGION];

  // A deep link such as /#yin should open the night side, not only scroll to it.
  //
  // hashchange alone is not enough. The App Router navigates with
  // history.pushState, which fires no hashchange, so clicking Yin in the header
  // while already on the home page would reach nothing at all: only one ritual
  // is in the document, and the other has no anchor to land on. Listening to
  // click in the capture phase catches the in page link before the router
  // handles it; hashchange and popstate still cover the browser's own back and
  // forward.
  //
  // Only the click is a moment, so only the click grows the eclipse from the
  // pointer. A deep link on load or a history step switches instantly with the
  // token crossfade.
  useEffect(() => {
    if (!hydrated) return;

    // The section of the ritual that is not showing is not in the document, so
    // the browser has no anchor to jump to. Asking for the ritual that is
    // already open therefore has to do the jump itself, otherwise Yang in the
    // header does nothing at all for a visitor who is already in the day.
    const scrollToRitual = (target: Mode) => {
      const node = document.getElementById(target);
      if (!node) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash !== "yin" && hash !== "yang") return;
      if (useJingStore.getState().mode === hash) scrollToRitual(hash);
      else setMode(hash, { instant: true });
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      // endsWith, because a basePath (the static demo under /seelischabstrakt/jing)
      // is prepended to every href and would otherwise defeat the exact match.
      const href = anchor.getAttribute("href") ?? "";
      const target: Mode | null = href.endsWith("#yin")
        ? "yin"
        : href.endsWith("#yang")
          ? "yang"
          : null;
      if (!target) return;
      if (useJingStore.getState().mode === target) {
        scrollToRitual(target);
        return;
      }
      // originFromEvent, not the raw coordinates: a link reached with the
      // keyboard reports 0/0, and the eclipse would grow from the top left
      // corner instead of from the control that was pressed.
      setMode(target, {
        origin: originFromEvent({
          clientX: event.clientX,
          clientY: event.clientY,
          currentTarget: anchor,
        }),
      });
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

  const regionLabel = lang === "en" ? activeRegion.labelEn : activeRegion.label;
  const facts = [
    {
      label: t({ de: "Versand", en: "Shipping" }),
      value: t({
        de: `aus ${SITE.warehouse.city}, ${SITE.warehouse.country}`,
        en: `from ${SITE.warehouse.city}, the Netherlands`,
      }),
    },
    {
      label: t({ de: "Lieferzeit", en: "Delivery" }),
      value: t({
        de: `${deliveryWindow(activeRegion, lang)} nach ${regionLabel}`,
        en: `${deliveryWindow(activeRegion, lang)} to ${regionLabel}`,
      }),
    },
    {
      label: t({ de: "Widerruf", en: "Withdrawal" }),
      value: t({
        de: `${WITHDRAWAL_DAYS} Tage, ohne Angabe von Gründen`,
        en: `${WITHDRAWAL_DAYS} days, no reasons required`,
      }),
    },
  ];

  return (
    <>
      <RitualHero activeMode={activeMode} />

      <section
        aria-label={t({
          de: "Versand, Lieferzeit und Widerruf",
          en: "Shipping, delivery and withdrawal",
        })}
        className="border-b border-line"
      >
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

      {/*
        One ritual at a time. Yang shows the five pieces of the day, Yin the five
        of the night, and the switch is the only way between them. Showing both
        at once made the shop a catalogue with two halves; showing one makes it a
        shop that is in a time of day.

        The swap has no animation of its own, on purpose. The palette changes in
        a single frame, inside the eclipse the provider runs, and a crossfade on
        the content would run on a second, slower clock: for its whole length the
        pieces of the day would stand in the colours of the night. One clock, so
        colour and content are never out of step. The eclipse is the transition.

        The element tree follows activeMode, which is the fallback yang until the
        store has rehydrated, so the server markup and the first client render
        agree and a stored Yin arrives as an ordinary update afterwards. For the
        few milliseconds until then, globals.css keeps the collection that does
        not match the stamped mode out of sight.
      */}
      <div key={activeMode} data-collection={activeMode}>
        <CollectionSection collection={activeMode} instant={modeSwitched} />
      </div>

      {/*
        There used to be a noscript block here listing the pieces of the other
        ritual, so a browser without scripting had a way to them at all. It is
        gone: it put both collections into the same document, which is the one
        thing this shop does not do. Without scripting the shop is the ritual the
        markup carries, and that is the whole of it.
      */}

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
              {t({ de: "Die These", en: "The thesis" })}
            </p>
            <h2
              id="these-titel"
              className="mt-5 max-w-[22ch] font-display text-3xl leading-tight tracking-[0.04em] sm:text-5xl"
            >
              {t({ de: "Ein Regal, das der Stunde folgt", en: "One shelf that follows the hour" })}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
            {/* Der Absatz spricht nur von der Stunde, in der der Shop steht.
                Vorher stellte er Morgen und Abend als Paar gegeneinander, und
                damit standen beide Tageszeiten in einem Satz. */}
            <Reveal from="left" delay={0}><p className="max-w-[46ch] text-sm leading-relaxed text-ink-2">
              {t(
                activeMode === "yang"
                  ? {
                      de:
                        "Jede Stunde verlangt etwas anderes. Am Morgen zählt, was Struktur gibt, was " +
                        "sich nicht verschiebt und was bis zum letzten Termin hält.",
                      en:
                        "Every hour asks for something different. In the morning, what counts is what " +
                        "gives structure, what does not move and what holds until the last appointment.",
                    }
                  : {
                      de:
                        "Jede Stunde verlangt etwas anderes. Am Abend zählt, was zurücknimmt, was den " +
                        "Raum vorbereitet und was der Haut die Arbeit überlässt.",
                      en:
                        "Every hour asks for something different. In the evening, what counts is what " +
                        "takes back, what prepares the room and what leaves the work to the skin.",
                    },
              )}
            </p></Reveal>
            {/* Der Satz nennt die Stunden, in denen der Shop gerade steht, und
                nicht die der anderen Tageszeit. Vorher standen beide Rituale mit
                Namen und Uhrzeit in einem Satz. */}
            <Reveal from="up" delay={STAGGER}><p className="max-w-[46ch] text-sm leading-relaxed text-ink-2">
              {t({
                de:
                  "Deshalb ist das Sortiment nicht nach Kategorien geordnet, sondern nach Tageszeit. " +
                  `${t(RITUAL[activeMode].title)} gehört zu den Stunden von ${RITUAL[activeMode].hours.de} Uhr ` +
                  "und hat fünf Stücke, mehr braucht ein Ritual nicht.",
                en:
                  "That is why the range is not ordered by category but by time of day. " +
                  `${t(RITUAL[activeMode].title)} belongs to the hours from ${RITUAL[activeMode].hours.en} ` +
                  "and has five pieces, a ritual needs no more.",
              })}
            </p></Reveal>
            <Reveal from="right" delay={2 * STAGGER}><p className="max-w-[46ch] text-sm leading-relaxed text-ink-2">
              {t({
                de:
                  "Was daraus entsteht, ist weniger eine Routine als eine Gewohnheit, die sich mit der " +
                  "Stunde dreht. Du entscheidest mit dem Schalter im Kopf der Seite, welche gerade gilt, " +
                  "und der Shop richtet sich danach aus, in der Ansicht wie im Sortiment.",
                en:
                  "What comes of it is less a routine than a habit that turns with the hour. The switch " +
                  "at the top of the page decides which one applies right now, and the shop follows, in " +
                  "the view as in the range.",
              })}
            </p></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
