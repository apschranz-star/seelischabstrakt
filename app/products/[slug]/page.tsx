import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageBody } from "@/components/product/product-page-body";
import { PRODUCTS, getProductBySlug, type MeasureUnit } from "@/config/products";
import { SITE } from "@/config/site";

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

  // The visible body is a client component: the delivery region and the
  // language live in persisted client state. The structured data below stays
  // German and in euro, which is the offer as filed, and the metadata above
  // stays German because a static export cannot follow a client language.

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
    <>
      <ProductPageBody product={product} />
      <script
        type="application/ld+json"
        // JSON.stringify produces the payload, the escape keeps a stray tag out of the document.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
