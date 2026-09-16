"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollText, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { buttonClasses } from "@/components/ui/button";
import type {
  AccessoryRegulatory,
  CandleRegulatory,
  CosmeticRegulatory,
  ElectricalRegulatory,
  Product,
  Regulatory,
} from "@/config/products";
import { SITE } from "@/config/site";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/* ------------------------------------------------------------------ building blocks */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DataList({ children }: { children: ReactNode }) {
  return <dl className="flex flex-col">{children}</dl>;
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-2 last:border-b-0">
      <dt className="text-[13px] leading-snug text-ink-3">{label}</dt>
      <dd className="text-right font-mono text-[13px] leading-snug text-ink">{value}</dd>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="text-[12px] leading-relaxed text-ink-3">{children}</p>;
}

function Warnings({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <Section title="Warnhinweise">
      <ul className="flex flex-col gap-2.5">
        {items.map((warning) => (
          <li key={warning} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
            <TriangleAlert size={14} aria-hidden="true" className="mt-[3px] shrink-0 text-seal" />
            <span>{warning}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** The crossed out wheeled bin of EN 50419, drawn rather than shipped as an image. */
function CrossedBinMark() {
  return (
    <svg
      viewBox="0 0 24 34"
      width="22"
      height="31"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-ink"
    >
      <path d="M3 5.5H21" />
      <path d="M9.5 5.5V3H14.5V5.5" />
      <path d="M5 5.5L6.5 27H17.5L19 5.5" />
      <circle cx="9" cy="29.6" r="1.3" />
      <circle cx="15" cy="29.6" r="1.3" />
      <path d="M5.5 8.5L18.5 24" />
      <path d="M18.5 8.5L5.5 24" />
      <path d="M2.5 32.6H21.5" strokeWidth="2" />
    </svg>
  );
}

/* --------------------------------------------------------------- panels per kind */

function CosmeticPanel({ regulatory }: { regulatory: CosmeticRegulatory }) {
  const months = regulatory.pao.replace(/[^0-9]/g, "");

  return (
    <>
      <Section title="INCI, in gedruckter Reihenfolge">
        <ol className="flex select-text flex-col gap-1.5">
          {regulatory.inci.map((ingredient, index) => (
            <li
              key={`${index}-${ingredient}`}
              className="flex gap-3 font-mono text-[12px] leading-relaxed"
            >
              <span className="w-6 shrink-0 tabular-nums text-ink-3">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-ink">{ingredient}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          Die Reihenfolge entspricht dem Aufdruck auf der Packung. Bestandteile über einem Prozent
          stehen absteigend nach Gewichtsanteil, Bestandteile unter einem Prozent danach in
          beliebiger Reihenfolge, Farbstoffe mit ihrer CI-Nummer am Ende. Der Text lässt sich
          markieren und kopieren, etwa für die Rückfrage in einer Hautarztpraxis.
        </p>
      </Section>

      <Section title="Duftstoffallergene">
        {regulatory.allergens.length > 0 ? (
          <>
            <ul className="flex select-text flex-wrap gap-2">
              {regulatory.allergens.map((allergen) => (
                <li
                  key={allergen}
                  className="border border-line-2 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink"
                >
                  {allergen}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
              Diese Stoffe müssen nach Anhang III der Verordnung (EG) Nr. 1223/2009 gesondert
              angegeben werden, sobald sie in einem Produkt zum Verbleib auf der Haut über 0,001
              Prozent liegen, bei abzuspülenden Produkten über 0,01 Prozent. Genannt werden sie
              zusätzlich in der INCI-Liste oben.
            </p>
          </>
        ) : (
          <Note>
            Dieses Produkt enthält keinen Duftstoff, der nach Anhang III der Verordnung (EG) Nr.
            1223/2009 gesondert angegeben werden muss.
          </Note>
        )}
      </Section>

      <Section title="Haltbarkeit nach dem Öffnen">
        <DataList>
          <DataRow label="Zeichen auf der Packung" value={regulatory.pao} />
        </DataList>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          {months
            ? `Der geöffnete Tiegel oder Flakon ist ${months} Monate lang zur Anwendung bestimmt. Das Zeichen ist der offene Cremetiegel auf der Packung.`
            : "Die Angabe steht als offener Cremetiegel auf der Packung."}
        </p>
      </Section>

      <Section title="Meldung im CPNP">
        <div className="border border-line-2 bg-surface-2 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            CPNP-Referenz
          </p>
          <p className="mt-1.5 select-text font-mono text-[14px] text-ink">
            {regulatory.cpnpReference}
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            Diese Referenz ist ein Demonstrationswert aus den Beispieldaten dieses Repositorys und
            steht für keine echte Meldung im Cosmetic Products Notification Portal. Vor dem
            Livegang wird sie durch die Referenz der tatsächlichen Notifizierung ersetzt.
          </p>
        </div>
      </Section>

      <Warnings items={regulatory.warnings} />
    </>
  );
}

function ElectricalPanel({ regulatory }: { regulatory: ElectricalRegulatory }) {
  return (
    <>
      <Section title="Registrierung nach ElektroG">
        <p className="select-text font-mono text-[13px] leading-relaxed text-ink">
          {regulatory.weeeNumber}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          Die Registrierung bei der Stiftung Elektro-Altgeräte Register gilt für den Vertrieb in
          Deutschland und wird vor dem ersten Verkauf eingetragen.
        </p>
      </Section>

      <Section title="Technische Angaben">
        <DataList>
          <DataRow label="Spannung" value={regulatory.voltage} />
          <DataRow label="Leistungsaufnahme" value={regulatory.power} />
          <DataRow label="Batterie oder Akku" value={regulatory.hasBattery ? "enthalten" : "keine"} />
        </DataList>
        {regulatory.hasBattery ? (
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            Das Gerät enthält eine Batterie und fällt damit zusätzlich unter das Batteriegesetz.
            Batterien gehören nicht in den Hausmüll, die Rückgabe ist im Handel und an
            kommunalen Sammelstellen kostenlos.
          </p>
        ) : null}
      </Section>

      <Section title="Getrennte Sammlung von Altgeräten">
        <div className="flex gap-4 border border-line-2 bg-surface-2 p-4">
          <CrossedBinMark />
          <p className="text-[12px] leading-relaxed text-ink-2">
            Elektroaltgeräte gehören nicht in den Hausmüll, sondern in die getrennte Sammlung,
            damit Rohstoffe zurückgewonnen und Schadstoffe aus dem Restmüll gehalten werden. Du kannst
            das Gerät kostenlos an uns zurückgeben oder es bei einer kommunalen Sammelstelle
            abgeben. Für die Rücksendung schicken wir dir auf Anfrage ein Etikett, der Weg steht
            unter Versand und Rückgabe. Vor
            der Rückgabe Altbatterien und, sofern vorhanden, Lampen entnehmen und getrennt
            entsorgen. Für das Löschen persönlicher Daten auf dem Altgerät bist du selbst
            verantwortlich.
          </p>
        </div>
      </Section>

      <Warnings items={regulatory.warnings} />
    </>
  );
}

function CandlePanel({ regulatory }: { regulatory: CandleRegulatory }) {
  return (
    <>
      <Section title="Einstufung nach CLP">
        <DataList>
          <DataRow
            label="Signalwort"
            value={regulatory.clpSignalWord.length > 0 ? regulatory.clpSignalWord : "keines"}
          />
        </DataList>
        {regulatory.clpSignalWord.length === 0 ? (
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            Kein Signalwort, weil die Kerze nach der Verordnung (EG) Nr. 1272/2008 nicht als
            gefährlich eingestuft ist. Die folgenden Sätze bleiben trotzdem verpflichtend.
          </p>
        ) : null}
        <ul className="mt-3 flex flex-col gap-2">
          {regulatory.clpStatements.map((statement) => (
            <li key={statement} className="select-text text-[13px] leading-relaxed text-ink-2">
              {statement}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Brenndauer">
        <DataList>
          <DataRow label="Brenndauer, gesamt" value={`${regulatory.burnTimeHours} Stunden`} />
        </DataList>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          Richtwert aus dem Brennversuch bei ruhiger Luft. Zugluft und häufige kurze Brennzeiten
          verkürzen ihn.
        </p>
      </Section>

      <Warnings items={regulatory.warnings} />
    </>
  );
}

function AccessoryPanel({ regulatory }: { regulatory: AccessoryRegulatory }) {
  const { cosmetic } = regulatory;

  return (
    <>
      <Section title="Material">
        <p className="select-text text-[13px] leading-relaxed text-ink-2">{regulatory.material}</p>
      </Section>

      <Section title="Pflege">
        <p className="select-text text-[13px] leading-relaxed text-ink-2">{regulatory.care}</p>
      </Section>

      <Warnings items={regulatory.warnings} />

      {cosmetic ? (
        <div className="mt-10 border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            {cosmetic.name}, {cosmetic.netQuantity.value} {cosmetic.netQuantity.unit}
          </p>
          <p className="mt-2 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
            Dem Set liegt ein kosmetisches Mittel bei. Es fällt unter die Verordnung (EG) Nr.
            1223/2009 und bekommt deshalb dieselben Angaben wie jedes einzeln verkaufte Produkt.
          </p>
          <div className="mt-6">
            <CosmeticPanel
              regulatory={{
                kind: "cosmetic",
                inci: cosmetic.inci,
                allergens: cosmetic.allergens,
                pao: cosmetic.pao,
                cpnpReference: cosmetic.cpnpReference,
                warnings: cosmetic.warnings,
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function RegulatoryBody({ regulatory }: { regulatory: Regulatory }) {
  switch (regulatory.kind) {
    case "cosmetic":
      return <CosmeticPanel regulatory={regulatory} />;
    case "electrical":
      return <ElectricalPanel regulatory={regulatory} />;
    case "candle":
      return <CandlePanel regulatory={regulatory} />;
    case "accessory":
      return <AccessoryPanel regulatory={regulatory} />;
  }
}

interface PanelMeta {
  trigger: string;
  title: string;
  description: string;
}

function panelMeta(regulatory: Regulatory): PanelMeta {
  switch (regulatory.kind) {
    case "cosmetic":
      return {
        trigger: "Inhaltsstoffe und Pflichtangaben",
        title: "Inhaltsstoffe",
        description: "INCI-Liste, Duftstoffallergene, Haltbarkeit und Warnhinweise.",
      };
    case "electrical":
      return {
        trigger: "Technische Angaben und Entsorgung",
        title: "Technische Angaben",
        description: "Registrierung, Anschlusswerte, Rücknahme und Warnhinweise.",
      };
    case "candle":
      return {
        trigger: "CLP-Angaben und Brenndauer",
        title: "CLP-Angaben",
        description: "Einstufung, Brenndauer und Warnhinweise.",
      };
    case "accessory":
      return {
        trigger: "Material und Pflege",
        title: "Material und Pflege",
        description: "Werkstoff, Pflege und Warnhinweise.",
      };
  }
}

/* -------------------------------------------------------------------- the drawer */

export function InciDrawer({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const id = useId();
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const meta = panelMeta(product.regulatory);
  const close = useCallback(() => setOpen(false), []);

  // The portal target only exists in the browser, so nothing renders before mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus moves into the panel on open and back to the trigger on close.
  useEffect(() => {
    if (!open) return;

    // Captured at open time, the trigger is rendered by this component and does not move.
    const trigger = triggerRef.current;

    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      trigger?.focus();
    };
  }, [open]);

  // Escape closes, Tab stays inside the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0,
      );
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Only the panel scrolls while it is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const duration = reduceMotion ? 0 : 0.42;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        className={buttonClasses("outline", "md", true)}
      >
        <ScrollText size={14} aria-hidden="true" />
        {meta.trigger}
      </button>

      {/*
        The panel above is a modal built in JavaScript. Ingredient lists,
        fragrance allergens and the period after opening are information a buyer
        is entitled to before ordering, so without scripting the same content is
        rendered inline instead of being unreachable.
      */}
      <noscript>
        <div className="mt-6 border border-line-2 bg-surface-2 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            {meta.title}
          </p>
          <div className="mt-4">
            <RegulatoryBody regulatory={product.regulatory} />
          </div>
        </div>
      </noscript>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div className="fixed inset-0 z-50 flex justify-end">
                  <motion.div
                    aria-hidden="true"
                    onClick={close}
                    className="absolute inset-0 bg-inverse-surface/45 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <motion.div
                    ref={panelRef}
                    id={panelId}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    tabIndex={-1}
                    className="relative flex h-full w-full max-w-full flex-col border-l border-line-2 bg-surface focus:outline-none sm:w-[420px]"
                    initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                    animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                    transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-start gap-4 border-b border-line px-5 py-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
                          {product.code}
                        </p>
                        <h2
                          id={titleId}
                          className="mt-1.5 font-display text-xl leading-tight text-ink"
                        >
                          {meta.title}
                        </h2>
                        <p
                          id={descriptionId}
                          className="mt-1 text-[12px] leading-relaxed text-ink-3"
                        >
                          {product.name}. {meta.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={close}
                        aria-label="Angaben schließen"
                        className="-mr-1 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-300 ease-ritual hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </div>

                    {/* Scrollable, so it needs to be a tab stop and to name
                        itself, otherwise a keyboard user cannot reach the text
                        below the fold. */}
                    <div
                      tabIndex={0}
                      role="group"
                      aria-labelledby={titleId}
                      className="flex flex-col gap-6 overflow-y-auto overscroll-contain px-5 py-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink sm:px-6"
                    >
                      <RegulatoryBody regulatory={product.regulatory} />

                      <p className="border-t border-line pt-5 text-[11px] leading-relaxed text-ink-3">
                        Massgeblich ist immer der Aufdruck auf der gelieferten Packung. Hersteller
                        ändern Rezepturen, ohne dass sich Name oder Aufmachung ändern. Bei Fragen
                        zu einer Zutat antworten wir unter{" "}
                        <a
                          href={`mailto:${SITE.email}`}
                          className="text-ink underline decoration-line-2 underline-offset-4 transition-colors duration-300 ease-ritual hover:decoration-ink"
                        >
                          {SITE.email}
                        </a>
                        .
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
