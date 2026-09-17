"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

import { AddToCart } from "@/components/product/add-to-cart";
import { PackagingViewer } from "@/components/product/packaging-viewer";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import type { Product } from "@/config/products";
import { DEFAULT_REGION } from "@/config/site";
import { formatBasePrice, formatForRegion } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { region, hydrated } = useYinYang();

  // The pointer arriving on the card lifts the object off its stage. The state
  // starts false on the server and on the client and only ever changes through
  // pointer events after mount, so the markup never depends on it at first render.
  const [hovered, setHovered] = useState(false);

  // Before the persisted region is read, the card quotes euro for Germany,
  // which is exactly what the server rendered.
  const activeRegion = hydrated ? region : DEFAULT_REGION;
  const basePrice = formatBasePrice(product, activeRegion);

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex h-full flex-col border border-line bg-surface p-4 transition-colors duration-500 ease-ritual hover:border-line-2 sm:p-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">{product.code}</p>

      <Link
        href={`/products/${product.slug}`}
        className="group mt-3 block rounded-[2px]"
        aria-label={`${product.name}, Produktdetails`}
      >
        <div className="jing-stage relative aspect-square w-full overflow-hidden p-3">
          <PackagingViewer product={product} variant="card" lifted={hovered} />
        </div>
        <h3 className="jing-underline mt-4 pb-1 font-display text-xl leading-tight text-ink">
          {product.name}
        </h3>
      </Link>

      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{product.tagline}</p>

      {/* Pushed to the bottom so cards in a grid keep one baseline for price and button. */}
      <div className="mt-auto pt-4">
        <div className="flex flex-col gap-0.5 border-t border-line pt-3">
          <p className="font-mono text-[15px] tabular-nums text-ink">
            {formatForRegion(product.priceCents, activeRegion)}
          </p>
          {basePrice ? (
            <p className="font-mono text-[11px] tabular-nums text-ink-3">{basePrice}</p>
          ) : null}
          <p className="text-[11px] leading-snug text-ink-3">
            inkl. MwSt., zzgl.{" "}
            <Link
              href="/legal/versand"
              className="text-ink-2 underline underline-offset-2 transition-colors hover:text-ink"
            >
              Versandkosten
            </Link>
          </p>
        </div>

        <div className="mt-4">
          <AddToCart product={product} size="sm" />
        </div>
      </div>
    </motion.article>
  );
}
