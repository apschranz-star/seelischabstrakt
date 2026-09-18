"use client";

import { RESPONSIBLE_PERSON } from "@/config/site";
import { hasCosmeticPart, localizeProduct, type Product } from "@/config/products";
import { useLang, useT } from "@/lib/i18n";

/**
 * The block the General Product Safety Regulation asks for on the offer itself:
 * who made it, how to reach them, what the product is, and the warnings that
 * belong to it. It is not hidden behind a drawer, because the regulation wants
 * this visible with the offer.
 */
/**
 * Everything that must by law sit on the product itself, in the order a label
 * carries it. CLP hazard statements come first because they are label elements
 * under Regulation EC 1272/2008, not house copy.
 */
function mandatoryLabelText(regulatory: Product["regulatory"]): string[] {
  const clp =
    regulatory.kind === "candle"
      ? regulatory.clpStatements
      : regulatory.kind === "accessory"
        ? (regulatory.clpStatements ?? [])
        : [];
  const enclosed = regulatory.kind === "accessory" ? (regulatory.cosmetic?.warnings ?? []) : [];
  return [...clp, ...regulatory.warnings, ...enclosed];
}

export function GpsrPanel({ product: source }: { product: Product }) {
  // The warnings and CLP statements follow the live language, the identifiers do not.
  const lang = useLang();
  const t = useT();
  const product = localizeProduct(source, lang);
  const warnings = mandatoryLabelText(product.regulatory);
  const country = t({ de: RESPONSIBLE_PERSON.country, en: "Germany" });

  return (
    <section
      aria-labelledby={`gpsr-${product.id}`}
      className="mt-12 border-t border-line pt-8 text-sm leading-relaxed text-ink-2"
    >
      <h2
        id={`gpsr-${product.id}`}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3"
      >
        {t({ de: "Sicherheits- und Herstellerangaben", en: "Product safety and manufacturer" })}
      </h2>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            {t({ de: "Verantwortliche Person", en: "Responsible person" })}
          </p>
          <address className="mt-2 not-italic">
            {RESPONSIBLE_PERSON.company}
            <br />
            {RESPONSIBLE_PERSON.street}
            <br />
            {RESPONSIBLE_PERSON.zipCity}, {country}
            <br />
            <a
              href={`mailto:${RESPONSIBLE_PERSON.email}`}
              className="text-ink underline underline-offset-4"
            >
              {RESPONSIBLE_PERSON.email}
            </a>
          </address>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            {t({ de: "Produktkennzeichnung", en: "Product identification" })}
          </p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-ink-3">{t({ de: "Artikel", en: "Item" })}</dt>
            <dd>{product.code}</dd>
            <dt className="text-ink-3">{t({ de: "Bezeichnung", en: "Name" })}</dt>
            <dd>{product.name}</dd>
            <dt className="text-ink-3">{t({ de: "Inhalt", en: "Contents" })}</dt>
            <dd>{product.unitsLabel}</dd>
            <dt className="text-ink-3">{t({ de: "Herkunft", en: "Origin" })}</dt>
            <dd>{product.origin}</dd>
          </dl>
        </div>
      </div>

      {warnings.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            {t({ de: "Warnhinweise", en: "Warnings" })}
          </p>
          <ul role="list" className="mt-2 flex flex-col gap-1">
            {warnings.map((warning) => (
              <li key={warning} className="flex gap-2">
                <span aria-hidden="true" className="text-seal">
                  ·
                </span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-ink-3">
        {hasCosmeticPart(product)
          ? t({
              de: RESPONSIBLE_PERSON.note,
              en: "For cosmetic products the same entity is the responsible person under Article 4 of Regulation (EC) No 1223/2009. The product information file is kept there for ten years and is available to the market surveillance authorities on request.",
            })
          : t({
              de: RESPONSIBLE_PERSON.role,
              en: "Responsible person and manufacturer within the meaning of the EU General Product Safety Regulation",
            })}
      </p>
    </section>
  );
}
