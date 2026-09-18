"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollText, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { buttonClasses } from "@/components/ui/button";
import {
  localizeProduct,
  type AccessoryRegulatory,
  type CandleRegulatory,
  type CosmeticRegulatory,
  type ElectricalRegulatory,
  type Product,
  type Regulatory,
} from "@/config/products";
import { SITE } from "@/config/site";
import { useLang, useT, type Text } from "@/lib/i18n";
import { panelTransition } from "@/lib/motion";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

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
  const t = useT();
  if (items.length === 0) return null;

  return (
    <Section title={t({ de: "Warnhinweise", en: "Warnings" })}>
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
  const t = useT();
  const months = regulatory.pao.replace(/[^0-9]/g, "");

  return (
    <>
      <Section title={t({ de: "INCI, in gedruckter Reihenfolge", en: "INCI, in printed order" })}>
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
          {t({
            de: "Die Reihenfolge entspricht dem Aufdruck auf der Packung. Bestandteile über einem Prozent stehen absteigend nach Gewichtsanteil, Bestandteile unter einem Prozent danach in beliebiger Reihenfolge, Farbstoffe mit ihrer CI-Nummer am Ende. Der Text lässt sich markieren und kopieren, etwa für die Rückfrage in einer Hautarztpraxis.",
            en: "The order matches the print on the pack. Ingredients above one percent are listed in descending order of weight, ingredients below one percent follow in any order, colourants with their CI number at the end. The text can be selected and copied, for example for a question to a dermatologist.",
          })}
        </p>
      </Section>

      <Section title={t({ de: "Duftstoffallergene", en: "Fragrance allergens" })}>
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
              {t({
                de: "Diese Stoffe müssen nach Anhang III der Verordnung (EG) Nr. 1223/2009 gesondert angegeben werden, sobald sie in einem Produkt zum Verbleib auf der Haut über 0,001 Prozent liegen, bei abzuspülenden Produkten über 0,01 Prozent. Genannt werden sie zusätzlich in der INCI-Liste oben.",
                en: "Under Annex III of Regulation (EC) No 1223/2009 these substances must be declared separately once they exceed 0.001 percent in a leave-on product or 0.01 percent in a rinse-off product. They also appear in the INCI list above.",
              })}
            </p>
          </>
        ) : (
          <Note>
            {t({
              de: "Dieses Produkt enthält keinen Duftstoff, der nach Anhang III der Verordnung (EG) Nr. 1223/2009 gesondert angegeben werden muss.",
              en: "This product contains no fragrance substance that must be declared separately under Annex III of Regulation (EC) No 1223/2009.",
            })}
          </Note>
        )}
      </Section>

      <Section title={t({ de: "Haltbarkeit nach dem Öffnen", en: "Period after opening" })}>
        <DataList>
          <DataRow label={t({ de: "Zeichen auf der Packung", en: "Symbol on the pack" })} value={regulatory.pao} />
        </DataList>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          {months
            ? t({
                de: `Der geöffnete Tiegel oder Flakon ist ${months} Monate lang zur Anwendung bestimmt. Das Zeichen ist der offene Cremetiegel auf der Packung.`,
                en: `Once opened, the jar or bottle is intended for use for ${months} months. The symbol is the open cream jar on the pack.`,
              })
            : t({
                de: "Die Angabe steht als offener Cremetiegel auf der Packung.",
                en: "The period is shown as an open cream jar on the pack.",
              })}
        </p>
      </Section>

      <Section title={t({ de: "Meldung im CPNP", en: "CPNP notification" })}>
        <div className="border border-line-2 bg-surface-2 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            {t({ de: "CPNP-Referenz", en: "CPNP reference" })}
          </p>
          <p className="mt-1.5 select-text font-mono text-[14px] text-ink">
            {regulatory.cpnpReference}
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            {t({
              de: "Diese Referenz ist ein Demonstrationswert aus den Beispieldaten dieses Repositorys und steht für keine echte Meldung im Cosmetic Products Notification Portal. Vor dem Livegang wird sie durch die Referenz der tatsächlichen Notifizierung ersetzt.",
              en: "This reference is a demonstration value from the sample data of this repository and does not stand for a real notification in the Cosmetic Products Notification Portal. Before launch it will be replaced by the reference of the actual notification.",
            })}
          </p>
        </div>
      </Section>

      <Warnings items={regulatory.warnings} />
    </>
  );
}

function ElectricalPanel({ regulatory }: { regulatory: ElectricalRegulatory }) {
  const t = useT();

  return (
    <>
      <Section title={t({ de: "Registrierung nach ElektroG", en: "WEEE registration (ElektroG)" })}>
        <p className="select-text font-mono text-[13px] leading-relaxed text-ink">
          {regulatory.weeeNumber}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          {t({
            de: "Die Registrierung bei der Stiftung Elektro-Altgeräte Register gilt für den Vertrieb in Deutschland und wird vor dem ersten Verkauf eingetragen.",
            en: "The registration with Stiftung Elektro-Altgeräte Register covers sales in Germany and is entered before the first sale.",
          })}
        </p>
      </Section>

      <Section title={t({ de: "Technische Angaben", en: "Technical details" })}>
        <DataList>
          <DataRow label={t({ de: "Spannung", en: "Voltage" })} value={regulatory.voltage} />
          <DataRow label={t({ de: "Leistungsaufnahme", en: "Power consumption" })} value={regulatory.power} />
          <DataRow
            label={t({ de: "Batterie oder Akku", en: "Battery" })}
            value={
              regulatory.hasBattery
                ? t({ de: "enthalten", en: "included" })
                : t({ de: "keine", en: "none" })
            }
          />
        </DataList>
        {regulatory.hasBattery ? (
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            {t({
              de: "Das Gerät enthält eine Batterie und fällt damit zusätzlich unter das Batteriegesetz. Batterien gehören nicht in den Hausmüll, die Rückgabe ist im Handel und an kommunalen Sammelstellen kostenlos.",
              en: "The device contains a battery and therefore also falls under the German Battery Act. Batteries do not belong in household waste. They can be returned free of charge to retailers and municipal collection points.",
            })}
          </p>
        ) : null}
      </Section>

      <Section title={t({ de: "Getrennte Sammlung von Altgeräten", en: "Separate collection of old appliances" })}>
        <div className="flex gap-4 border border-line-2 bg-surface-2 p-4">
          <CrossedBinMark />
          <p className="text-[12px] leading-relaxed text-ink-2">
            {t({
              de: "Elektroaltgeräte gehören nicht in den Hausmüll, sondern in die getrennte Sammlung, damit Rohstoffe zurückgewonnen und Schadstoffe aus dem Restmüll gehalten werden. Du kannst das Gerät kostenlos an uns zurückgeben oder es bei einer kommunalen Sammelstelle abgeben. Für die Rücksendung schicken wir dir auf Anfrage ein Etikett, der Weg steht unter Versand und Rückgabe. Vor der Rückgabe Altbatterien und, sofern vorhanden, Lampen entnehmen und getrennt entsorgen. Für das Löschen persönlicher Daten auf dem Altgerät bist du selbst verantwortlich.",
              en: "Waste electrical equipment does not belong in household waste but in separate collection, so that raw materials are recovered and pollutants are kept out of residual waste. You can return the device to us free of charge or hand it in at a municipal collection point. On request we send you a return label, the procedure is described under Shipping and returns. Before returning it, remove old batteries and, where present, lamps and dispose of them separately. You are responsible for deleting personal data on the old device.",
            })}
          </p>
        </div>
      </Section>

      <Warnings items={regulatory.warnings} />
    </>
  );
}

function CandlePanel({ regulatory }: { regulatory: CandleRegulatory }) {
  const t = useT();

  return (
    <>
      <Section title={t({ de: "Einstufung nach CLP", en: "CLP classification" })}>
        <DataList>
          <DataRow
            label={t({ de: "Signalwort", en: "Signal word" })}
            value={
              regulatory.clpSignalWord.length > 0
                ? regulatory.clpSignalWord
                : t({ de: "keines", en: "none" })
            }
          />
        </DataList>
        {regulatory.clpSignalWord.length === 0 ? (
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            {t({
              de: "Kein Signalwort, weil die Kerze nach der Verordnung (EG) Nr. 1272/2008 nicht als gefährlich eingestuft ist. Die folgenden Sätze bleiben trotzdem verpflichtend.",
              en: "No signal word, because the candle is not classified as hazardous under Regulation (EC) No 1272/2008. The following statements remain mandatory.",
            })}
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

      <Section title={t({ de: "Brenndauer", en: "Burn time" })}>
        <DataList>
          <DataRow
            label={t({ de: "Brenndauer, gesamt", en: "Burn time, total" })}
            value={`${regulatory.burnTimeHours} ${t({ de: "Stunden", en: "hours" })}`}
          />
        </DataList>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          {t({
            de: "Richtwert aus dem Brennversuch bei ruhiger Luft. Zugluft und häufige kurze Brennzeiten verkürzen ihn.",
            en: "Guide value from the burn test in still air. Draughts and frequent short burns shorten it.",
          })}
        </p>
      </Section>

      <Warnings items={regulatory.warnings} />
    </>
  );
}

function AccessoryPanel({ regulatory }: { regulatory: AccessoryRegulatory }) {
  const t = useT();
  const { cosmetic } = regulatory;

  return (
    <>
      <Section title={t({ de: "Material", en: "Material" })}>
        <p className="select-text text-[13px] leading-relaxed text-ink-2">{regulatory.material}</p>
      </Section>

      <Section title={t({ de: "Pflege", en: "Care" })}>
        <p className="select-text text-[13px] leading-relaxed text-ink-2">{regulatory.care}</p>
      </Section>

      {regulatory.ingredients?.length ? (
        <Section title={t({ de: "Zusammensetzung", en: "Composition" })}>
          <ol className="flex select-text flex-col gap-1.5">
            {regulatory.ingredients.map((item, index) => (
              <li key={`${index}-${item}`} className="flex gap-3 font-mono text-[12px] leading-relaxed">
                <span className="w-6 shrink-0 tabular-nums text-ink-3">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            {t({
              de: "Der eingeatmete Teil ist kein kosmetisches Mittel, er wird nicht auf den Körper aufgetragen. Er trägt deshalb eine Zusammensetzung nach Gewichtsanteil und, wo die Mischung eingestuft ist, die Kennzeichnung nach CLP.",
              en: "The inhaled part is not a cosmetic product, it is not applied to the body. It therefore carries a composition by weight and, where the mixture is classified, the CLP labelling.",
            })}
          </p>
        </Section>
      ) : null}

      {regulatory.clpStatements?.length ? (
        <Section title={t({ de: "Einstufung nach CLP", en: "CLP classification" })}>
          {regulatory.clpSignalWord ? (
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-seal">
              {regulatory.clpSignalWord}
            </p>
          ) : null}
          <ul className="mt-2 flex select-text flex-col gap-1.5 text-[13px] leading-relaxed text-ink-2">
            {regulatory.clpStatements.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Warnings items={regulatory.warnings} />

      {cosmetic ? (
        <div className="mt-10 border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            {cosmetic.name}, {cosmetic.netQuantity.value} {cosmetic.netQuantity.unit}
          </p>
          <p className="mt-2 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
            {t({
              de: "Dem Set liegt ein kosmetisches Mittel bei. Es fällt unter die Verordnung (EG) Nr. 1223/2009 und bekommt deshalb dieselben Angaben wie jedes einzeln verkaufte Produkt.",
              en: "The set includes a cosmetic product. It falls under Regulation (EC) No 1223/2009 and therefore carries the same information as any product sold on its own.",
            })}
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
  trigger: Text;
  title: Text;
  description: Text;
}

function panelMeta(regulatory: Regulatory): PanelMeta {
  switch (regulatory.kind) {
    case "cosmetic":
      return {
        trigger: { de: "Inhaltsstoffe und Pflichtangaben", en: "Ingredients and mandatory information" },
        title: { de: "Inhaltsstoffe", en: "Ingredients" },
        description: {
          de: "INCI-Liste, Duftstoffallergene, Haltbarkeit und Warnhinweise.",
          en: "INCI list, fragrance allergens, period after opening and warnings.",
        },
      };
    case "electrical":
      return {
        trigger: { de: "Technische Angaben und Entsorgung", en: "Technical details and disposal" },
        title: { de: "Technische Angaben", en: "Technical details" },
        description: {
          de: "Registrierung, Anschlusswerte, Rücknahme und Warnhinweise.",
          en: "Registration, ratings, take-back and warnings.",
        },
      };
    case "candle":
      return {
        trigger: { de: "CLP-Angaben und Brenndauer", en: "CLP information and burn time" },
        title: { de: "CLP-Angaben", en: "CLP information" },
        description: {
          de: "Einstufung, Brenndauer und Warnhinweise.",
          en: "Classification, burn time and warnings.",
        },
      };
    case "accessory":
      return {
        trigger: { de: "Material und Pflege", en: "Material and care" },
        title: { de: "Material und Pflege", en: "Material and care" },
        description: {
          de: "Werkstoff, Pflege und Warnhinweise.",
          en: "Material, care and warnings.",
        },
      };
  }
}

/* -------------------------------------------------------------------- the drawer */

export function InciDrawer({ product: source }: { product: Product }) {
  // Warnings and CLP statements come out in the live language. INCI names, the
  // CPNP reference and the numbers are not language and stay as they are.
  const lang = useLang();
  const t = useT();
  const product = localizeProduct(source, lang);
  const [open, setOpen] = useState(false);
  // True once the body has scrolled, so the header's rule firms up. Written by
  // the body's scroll handler, an event, never by an effect.
  const [scrolled, setScrolled] = useState(false);
  // The portal target only exists in the browser, so nothing renders before mount.
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion() === true;

  const id = useId();
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const meta = panelMeta(product.regulatory);
  const close = useCallback(() => {
    setOpen(false);
    setScrolled(false);
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
        {t(meta.trigger)}
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
            {t(meta.title)}
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
                    exit={{ opacity: 0, transition: panelTransition(reduceMotion, true) }}
                    transition={panelTransition(reduceMotion)}
                  />

                  <motion.div
                    ref={panelRef}
                    id={panelId}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    tabIndex={-1}
                    className="relative flex h-full w-full max-w-full flex-col bg-surface focus:outline-none sm:w-[420px]"
                    initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                    animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0, transition: panelTransition(true, true) }
                        : { x: "100%", transition: panelTransition(false, true) }
                    }
                    transition={panelTransition(reduceMotion)}
                  >
                    {/* The edge draws itself down from the top while the panel arrives. */}
                    <span
                      aria-hidden="true"
                      className="jing-edge absolute inset-y-0 left-0 z-10 w-px bg-line-2"
                    />

                    <div
                      data-panel-head=""
                      data-scrolled={scrolled ? "" : undefined}
                      className="jing-enter flex items-start gap-4 border-b border-line bg-surface px-5 py-4 sm:px-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="type-kicker text-ink-3">{product.code}</p>
                        <h2
                          id={titleId}
                          className="mt-1.5 font-display text-xl leading-tight text-ink"
                        >
                          {t(meta.title)}
                        </h2>
                        <p id={descriptionId} className="type-meta mt-1 text-ink-3">
                          {product.name}. {t(meta.description)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={close}
                        aria-label={t({ de: "Angaben schließen", en: "Close details" })}
                        className={cn(buttonClasses("control", "icon"), "-mr-1 shrink-0")}
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
                      data-focus-inset=""
                      data-panel-body=""
                      onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 4)}
                      className="flex flex-col gap-6 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6"
                    >
                      <RegulatoryBody regulatory={product.regulatory} />

                      <p className="border-t border-line pt-5 text-[11px] leading-relaxed text-ink-3">
                        {t({
                          de: "Massgeblich ist immer der Aufdruck auf der gelieferten Packung. Hersteller ändern Rezepturen, ohne dass sich Name oder Aufmachung ändern. Bei Fragen zu einer Zutat antworten wir unter",
                          en: "The print on the delivered pack is always the binding one. Manufacturers change formulas without changing the name or the packaging. For questions about an ingredient, write to",
                        })}{" "}
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
