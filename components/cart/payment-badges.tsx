"use client";

import { PAYMENT_METHODS, REGIONS, type RegionCode } from "@/config/site";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The wordmarks are set in type, never as logo files. Payment brands are third party
 * trademarks and this repository ships none of their assets, so the badge is a
 * hairline frame with the name and the one line a customer actually needs.
 */
export function PaymentBadges({ region, className }: { region: RegionCode; className?: string }) {
  const t = useT();
  const regionConfig = REGIONS[region];
  const regionLabel = t({ de: regionConfig.label, en: regionConfig.labelEn });

  // The region lists the order in which the methods appear, the method itself stays
  // authoritative about where it may be offered.
  const methods = regionConfig.paymentMethods
    .map((id) => PAYMENT_METHODS[id])
    .filter((method) => method.regions.includes(region));

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <ul
        aria-label={t({
          de: `Zahlungsarten für ${regionLabel}`,
          en: `Payment methods for ${regionLabel}`,
        })}
        className="flex flex-wrap gap-1.5"
      >
        {methods.map((method) => (
          <li
            key={method.id}
            className="rounded-[2px] border border-line px-2.5 py-1.5 transition-colors duration-500 ease-ritual"
          >
            <span className="block font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-ink">
              {t({ de: method.label, en: method.labelEn })}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-ink-3">
              {t({ de: method.note, en: method.noteEn })}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-[11px] leading-snug text-ink-3">
        {t({
          de: "Klarna gibt es in Deutschland und Österreich, EPS in Österreich, TWINT in der Schweiz.",
          en: "Klarna is available in Germany and Austria, EPS in Austria, TWINT in Switzerland.",
        })}
      </p>
    </div>
  );
}
