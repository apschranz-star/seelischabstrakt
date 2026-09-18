"use client";

/*
 * The story of one ritual, read before the products.
 *
 * A switch lands the visitor here: the kicker, the title and the lead say what
 * this half of the day is for, the five steps follow in the order of the
 * ritual, each with the piece it uses, and the closing line hands over to the
 * grid beneath. Every step is a link to its product page and an anchor to its
 * card, so the story and the shelf are the same five things in two orders.
 *
 * After a switch the visitor made, the steps stand at once (from "none"), the
 * same rule the grid follows. On a first load they walk in.
 */

import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { RITUAL } from "@/components/home/ritual-copy";
import { Reveal, STAGGER } from "@/components/ui/reveal";
import { getProductById } from "@/config/products";
import type { Mode } from "@/lib/store";

export function RitualStory({ collection, instant }: { collection: Mode; instant: boolean }) {
  const story = RITUAL[collection].story;
  const headingId = `${collection}-ritual`;
  const side = collection === "yang" ? "left" : "right";

  return (
    <div aria-labelledby={headingId} role="region" className="mt-12 border-b border-line pb-12">
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Reveal from={instant ? "none" : side} delay={0}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">{story.kicker}</p>
          <h3
            id={headingId}
            className="mt-4 max-w-[16ch] font-display text-3xl leading-[1.05] tracking-[0.04em] text-ink sm:text-4xl md:text-5xl"
          >
            {story.title}
          </h3>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">{story.lead}</p>
        </Reveal>

        <ol role="list" className="border-t border-line">
          {story.steps.map((step, index) => {
            const product = getProductById(step.productId);
            if (!product) return null;
            return (
              <Reveal
                key={step.productId}
                as="li"
                from={instant ? "none" : "up"}
                delay={instant ? 0 : (index + 1) * STAGGER}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-5 sm:grid-cols-[2.5rem_11rem_1fr] sm:gap-x-6"
              >
                <span className="font-mono text-[11px] tabular-nums leading-6 text-ink-3">
                  0{index + 1}
                </span>
                <span className="font-mono text-[11px] uppercase leading-6 tracking-[0.18em] text-ink-3">
                  {step.cue}
                </span>
                <span className="col-span-2 mt-2 block sm:col-span-1 sm:mt-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="jing-underline font-display text-lg leading-tight tracking-[0.02em] text-ink"
                  >
                    {product.name}
                  </Link>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-2">{product.ritual}</span>
                </span>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Reveal from={instant ? "none" : "up"} delay={instant ? 0 : 6 * STAGGER}>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{story.close}</p>
          <a
            href={`#${collection}-produkte`}
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
          >
            <span aria-hidden="true" className="h-px w-10 bg-ink" />
            {story.toProducts}
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
