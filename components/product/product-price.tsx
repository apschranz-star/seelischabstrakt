"use client";

import Link from "next/link";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import type { Product } from "@/config/products";
import { DEFAULT_REGION } from "@/config/site";
import { formatBasePrice, formatForRegion } from "@/lib/utils";

/**
 * The price block on the product page.
 *
 * It has to be a client component for the same reason the product card is one:
 * the delivery region lives in persisted client state. A server rendered euro
 * price would tell a Swiss visitor 54,00 EUR on the product page while the card
 * for the same product, the cart and the checkout all quote CHF. Before the
 * persisted region is read the page quotes the default region, exactly like the
 * card, so the first client render matches the server markup.
 */
export function ProductPrice({ product }: { product: Product }) {
  const { region, hydrated } = useYinYang();
  const activeRegion = hydrated ? region : DEFAULT_REGION;

  const price = formatForRegion(product.priceCents, activeRegion);
  const basePriceLine = formatBasePrice(product, activeRegion);

  return (
    <>
      <p className="font-mono text-3xl tabular-nums leading-none text-ink sm:text-4xl">{price}</p>
      {basePriceLine ? (
        <p className="mt-2 font-mono text-[13px] tabular-nums text-ink-2">
          Grundpreis {basePriceLine}
        </p>
      ) : null}
      <p className="mt-2 text-[13px] leading-snug text-ink-3">
        inkl. MwSt., zzgl.{" "}
        <Link href="/legal/versand" className="text-ink underline underline-offset-4">
          Versandkosten
        </Link>
      </p>
    </>
  );
}
