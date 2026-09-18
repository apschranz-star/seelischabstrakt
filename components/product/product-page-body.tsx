"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { AddToCart } from "@/components/product/add-to-cart";
import { InciDrawer } from "@/components/product/inci-drawer";
import { GpsrPanel } from "@/components/product/gpsr-panel";
import { PackagingViewer } from "@/components/product/packaging-viewer";
import { ProductPrice } from "@/components/product/product-price";
import { hasCosmeticPart, localizeProduct, type Product } from "@/config/products";
import { DEFAULT_REGION, REGIONS, SITE, WITHDRAWAL_DAYS } from "@/config/site";
import { useLang, useT } from "@/lib/i18n";
import { deliveryWindow, formatMoney } from "@/lib/utils";

/**
 * The visible body of a product page.
 *
 * The page itself stays a server component, so generateStaticParams and the
 * German metadata keep working in the static export. Everything a visitor
 * reads lives here instead, because the words follow the language in the
 * persisted client state. The tree is the same in both languages, only the
 * strings change, so the server markup and the first client render agree.
 *
 * The shop follows the piece, and then the piece follows the shop.
 *
 * Opening a piece of the night while the shop stood in the day put both times on
 * one screen: the palette and the switch said one thing, the collection line on
 * this page said the other. So arriving here sets the ritual to the one this
 * piece belongs to. Plainly, without the eclipse: nobody pressed anything, the
 * visitor followed a link, and a disc growing out of nowhere would be an answer
 * to a question they did not ask.
 *
 * Pressing the switch afterwards means the visitor wants the other time of day.
 * There is none of it on this page, so the page steps aside and the start page
 * of that ritual takes over. The switch keeps one meaning everywhere: it moves
 * the shop from one time of day to the other, and nothing is ever left standing
 * that belongs to the time the shop just left.
 */
export function ProductPageBody({ product: source }: { product: Product }) {
  const lang = useLang();
  const t = useT();
  const product = localizeProduct(source, lang);
  const { mode, setMode, hydrated } = useYinYang();
  const router = useRouter();
  /** False until the ritual of this piece has been taken on once. */
  const angekommen = useRef(false);

  // After rehydration, so the palette the bootstrap script stamped before the
  // first paint is not written over and then written back.
  useEffect(() => {
    if (!hydrated) return;
    if (!angekommen.current) {
      angekommen.current = true;
      if (mode !== source.collection) setMode(source.collection, { instant: true });
      return;
    }
    if (mode !== source.collection) router.push("/");
  }, [hydrated, mode, setMode, source.collection, router]);

  const home = REGIONS[DEFAULT_REGION];
  const homeLabel = lang === "en" ? home.labelEn : home.label;
  const isYin = product.collection === "yin";
  // The window is written in German in config/site.ts, "06:00 bis 18:00".
  const ritualWindow = (isYin ? SITE.ritualWindow.yin : SITE.ritualWindow.yang).replace(
    " bis ",
    t({ de: " bis ", en: " to " }),
  );
  const collectionLabel = `${isYin ? "YIN" : "YANG"}, ${ritualWindow}${t({ de: " Uhr", en: "" })}`;

  const facts = [
    { label: t({ de: "Kollektion", en: "Collection" }), value: collectionLabel },
    { label: t({ de: "Kategorie", en: "Category" }), value: product.category },
    { label: t({ de: "Inhalt", en: "Contents" }), value: product.unitsLabel },
    { label: t({ de: "Herkunft", en: "Origin" }), value: product.origin },
  ];

  return (
    <article className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <nav aria-label={t({ de: "Pfad", en: "Breadcrumb" })} className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              {t({ de: "Start", en: "Home" })}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={isYin ? "/#yin" : "/#yang"} className="transition-colors hover:text-ink">
              {isYin ? "Yin" : "Yang"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-2">{product.code}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="jing-stage border border-line p-4 sm:p-8">
            <PackagingViewer product={product} variant="page" className="h-[380px] w-full sm:h-[520px]" />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
            {product.code}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-2">{product.tagline}</p>

          {/* PAngV: selling price first, base price directly underneath, then the tax line. */}
          <section aria-labelledby="preis-titel" className="mt-8 border-y border-line py-6">
            <h2 id="preis-titel" className="sr-only">
              {t({ de: "Preis", en: "Price" })}
            </h2>
            <ProductPrice product={product} />
            <p className="mt-3 max-w-[46ch] text-[12px] leading-relaxed text-ink-3">
              {t({
                de: "Der Preis richtet sich nach dem Lieferland oben im Kopf der Seite. Für die Schweiz liefern wir verzollt und versteuert.",
                en: "The price follows the delivery country chosen in the header. For Switzerland we deliver with duties and taxes paid.",
              })}
            </p>
          </section>

          <div className="mt-8">
            <AddToCart product={product} size="lg" />
          </div>

          <p className="mt-8 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            {product.description}
          </p>

          <section aria-labelledby="ritual-titel" className="mt-8 border-l border-line-2 pl-5">
            <h2
              id="ritual-titel"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
            >
              {t({ de: "Ritual", en: "Ritual" })}
            </h2>
            <p className="mt-2 max-w-[48ch] font-display text-xl leading-snug text-ink">
              {product.ritual}
            </p>
          </section>

          <section aria-labelledby="fakten-titel" className="mt-10">
            <h2 id="fakten-titel" className="sr-only">
              {t({ de: "Produktdaten", en: "Product details" })}
            </h2>
            <dl className="flex flex-col">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-3 first:border-t first:border-line"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
                    {fact.label}
                  </dt>
                  <dd className="text-right text-[14px] leading-snug text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-8">
            <InciDrawer product={product} />
          </div>

          <section aria-labelledby="lieferung-titel" className="mt-10 border-t border-line pt-6">
            <h2
              id="lieferung-titel"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
            >
              {t({ de: "Lieferung", en: "Delivery" })}
            </h2>
            <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-ink-2">
              {t({
                de: `Versand aus ${SITE.warehouse.city} mit ${home.carrier}, Lieferung nach ${homeLabel} in ${deliveryWindow(home, lang)}. Versandkosten ${formatMoney(home.shippingCents, "EUR", lang)}, ab ${formatMoney(home.freeShippingCents, "EUR", lang)} versandkostenfrei. Für Österreich und die Schweiz gelten eigene Sätze, der Warenkorb rechnet sie nach deinem Lieferland.`,
                en: `Shipped from ${SITE.warehouse.city} with ${home.carrier}, delivery to ${homeLabel} in ${deliveryWindow(home, lang)}. Shipping costs ${formatMoney(home.shippingCents, "EUR", lang)}, free from ${formatMoney(home.freeShippingCents, "EUR", lang)}. Austria and Switzerland have their own rates, the cart applies them for your delivery country.`,
              })}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
              {t({
                de: `${WITHDRAWAL_DAYS} Tage Widerrufsrecht.`,
                en: `${WITHDRAWAL_DAYS} day right of withdrawal.`,
              })}{" "}
              {hasCosmeticPart(product)
                ? t({
                    de: "Ausgenommen sind versiegelte kosmetische Mittel, deren Siegel du nach der Lieferung entfernt hast. ",
                    en: "Sealed cosmetic products are excluded once you have removed the seal after delivery. ",
                  })
                : ""}
              <Link href="/legal/widerruf" className="text-ink underline underline-offset-4">
                {t({ de: "Widerrufsbelehrung", en: "Withdrawal notice" })}
              </Link>{" "}
              {t({ de: "und", en: "and" })}{" "}
              <Link href="/legal/versand" className="text-ink underline underline-offset-4">
                {t({ de: "Versandkosten", en: "Shipping costs" })}
              </Link>
              .
            </p>
          </section>

          <GpsrPanel product={product} />
        </div>
      </div>
    </article>
  );
}
