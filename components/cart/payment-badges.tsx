import { PAYMENT_METHODS, REGIONS, type RegionCode } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The wordmarks are set in type, never as logo files. Payment brands are third party
 * trademarks and this repository ships none of their assets, so the badge is a
 * hairline frame with the name and the one line a customer actually needs.
 */
export function PaymentBadges({ region, className }: { region: RegionCode; className?: string }) {
  const regionConfig = REGIONS[region];

  // The region lists the order in which the methods appear, the method itself stays
  // authoritative about where it may be offered.
  const methods = regionConfig.paymentMethods
    .map((id) => PAYMENT_METHODS[id])
    .filter((method) => method.regions.includes(region));

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <ul
        aria-label={`Zahlungsarten für ${regionConfig.label}`}
        className="flex flex-wrap gap-1.5"
      >
        {methods.map((method) => (
          <li
            key={method.id}
            className="rounded-[2px] border border-line px-2.5 py-1.5 transition-colors duration-500 ease-ritual"
          >
            <span className="block font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-ink">
              {method.label}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-ink-3">{method.note}</span>
          </li>
        ))}
      </ul>

      <p className="text-[11px] leading-snug text-ink-3">
        Klarna gibt es in Deutschland und Österreich, EPS in Österreich, TWINT in der Schweiz.
      </p>
    </div>
  );
}
