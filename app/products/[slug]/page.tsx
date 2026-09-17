import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/product/add-to-cart";
import { InciDrawer } from "@/components/product/inci-drawer";
import { GpsrPanel } from "@/components/product/gpsr-panel";
import { PackagingViewer } from "@/components/product/packaging-viewer";
import { ProductPrice } from "@/components/product/product-price";
import { PRODUCTS, getProductBySlug, hasCosmeticPart, type MeasureUnit } from "@/config/products";
import { DEFAULT_REGION, REGIONS, SITE, WITHDRAWAL_DAYS } from "@/config/site";
import { deliveryWindow, formatMoney } from "@/lib/utils";

// Every slug is known at build time, so an unknown one is a 404 and never a render.
export const dynamicParams = false;

/** UN/ECE codes for the net quantity in the structured data. */
const UNIT_CODES: Record<MeasureUnit, string> = { ml: "MLT", g: "GRM" };

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // notFound() is not allowed in metadata, so an unknown slug falls back to the site defaults.
  if (!product) {
    return {
      title: { absolute: `${SITE.name}, ${SITE.claim}` },
      description: SITE.description,
    };
  }

  const description = `${product.tagline}. ${product.unitsLabel}, ${product.origin}.`;
  const path = `/products/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: path,
      siteName: SITE.name,
      title: `${product.name}, ${product.code}`,
      description,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  // The visible price block is a client component, because the delivery region
  // lives in persisted client state. The structured data below stays in euro,
  // which is the currency of the offer as filed.

  const home = REGIONS[DEFAULT_REGION];
  const isYin = product.collection === "yin";
  const collectionLabel = isYin
    ? `YIN, ${SITE.ritualWindow.yin} Uhr`
    : `YANG, ${SITE.ritualWindow.yang} Uhr`;

  const facts = [
    { label: "Kollektion", value: collectionLabel },
    { label: "Kategorie", value: product.category },
    { label: "Inhalt", value: product.unitsLabel },
    { label: "Herkunft", value: product.origin },
  ];

  const canonical = `${SITE.url}/products/${product.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    productID: product.id,
    category: product.category,
    description: product.description,
    url: canonical,
    brand: { "@type": "Brand", name: SITE.name },
    ...(product.netQuantity
      ? {
          hasMeasurement: {
            "@type": "QuantitativeValue",
            value: product.netQuantity.value,
            unitCode: UNIT_CODES[product.netQuantity.unit],
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: canonical,
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.legalEntity.company },
    },
  };

  return (
    <article className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <nav aria-label="Pfad" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              Start
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
              Preis
            </h2>
            <ProductPrice product={product} />
            <p className="mt-3 max-w-[46ch] text-[12px] leading-relaxed text-ink-3">
              Der Preis richtet sich nach dem Lieferland oben im Kopf der Seite. Für die Schweiz
              liefern wir verzollt und versteuert.
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
              Ritual
            </h2>
            <p className="mt-2 max-w-[48ch] font-display text-xl leading-snug text-ink">
              {product.ritual}
            </p>
          </section>

          <section aria-labelledby="fakten-titel" className="mt-10">
            <h2 id="fakten-titel" className="sr-only">
              Produktdaten
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
              Lieferung
            </h2>
            <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-ink-2">
              Versand aus {SITE.warehouse.city} mit {home.carrier}, Lieferung nach {home.label} in{" "}
              {deliveryWindow(home)}. Versandkosten {formatMoney(home.shippingCents, "EUR")}, ab{" "}
              {formatMoney(home.freeShippingCents, "EUR")} versandkostenfrei. Für Österreich und die
              Schweiz gelten eigene Sätze, der Warenkorb rechnet sie nach deinem Lieferland.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
              {WITHDRAWAL_DAYS} Tage Widerrufsrecht.{" "}
              {hasCosmeticPart(product)
                ? "Ausgenommen sind versiegelte kosmetische Mittel, deren Siegel du nach der Lieferung entfernt hast. "
                : ""}
              <Link href="/legal/widerruf" className="text-ink underline underline-offset-4">
                Widerrufsbelehrung
              </Link>{" "}
              und{" "}
              <Link href="/legal/versand" className="text-ink underline underline-offset-4">
                Versandkosten
              </Link>
              .
            </p>
          </section>

          <GpsrPanel product={product} />
        </div>
      </div>

      <script
        type="application/ld+json"
        // JSON.stringify produces the payload, the escape keeps a stray tag out of the document.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
