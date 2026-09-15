import Link from "next/link";

import { SITE, WITHDRAWAL_DAYS } from "@/config/site";

const LEGAL = [
  { href: "/legal/impressum", label: "Impressum" },
  { href: "/legal/datenschutz", label: "Datenschutz" },
  { href: "/legal/agb", label: "AGB" },
  { href: "/legal/widerruf", label: "Widerrufsrecht" },
  { href: "/legal/versand", label: "Versand und Steuern" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl tracking-[0.18em] text-ink">JING</p>
          <p className="mt-3 max-w-[32ch] text-sm text-ink-2">{SITE.claim}</p>
          <p className="mt-4 max-w-[38ch] text-sm text-ink-3">{SITE.warehouse.note}</p>
        </div>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Rechtliches</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-2 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Service</h2>
          <p className="mt-4 text-sm text-ink-2">{SITE.email}</p>
          <p className="mt-2 text-sm text-ink-3">
            {WITHDRAWAL_DAYS} Tage Widerrufsrecht. Versand aus {SITE.warehouse.city}.
          </p>
          <p className="mt-6 text-xs text-ink-3">
            Alle Preise inkl. MwSt., zzgl.{" "}
            <Link href="/legal/versand" className="underline underline-offset-4">
              Versandkosten
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
