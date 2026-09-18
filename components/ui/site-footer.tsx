"use client";

import Link from "next/link";

import { SITE, WITHDRAWAL_DAYS } from "@/config/site";
import { useT, type Text } from "@/lib/i18n";

const LEGAL: readonly { href: string; label: Text }[] = [
  { href: "/legal/impressum", label: { de: "Impressum", en: "Legal notice" } },
  { href: "/legal/datenschutz", label: { de: "Datenschutz", en: "Privacy" } },
  { href: "/legal/agb", label: { de: "AGB", en: "Terms and conditions" } },
  { href: "/legal/widerruf", label: { de: "Widerrufsrecht", en: "Right of withdrawal" } },
  { href: "/legal/versand", label: { de: "Versand und Steuern", en: "Shipping and taxes" } },
];

export function SiteFooter() {
  const t = useT();

  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl tracking-[0.18em] text-ink">JING</p>
          <p className="mt-3 max-w-[32ch] text-sm text-ink-2">{SITE.claim}</p>
          <p className="mt-4 max-w-[38ch] text-sm text-ink-3">
            {t({
              de: SITE.warehouse.note,
              en:
                "Central warehouse on the German-Dutch border. From there we reach Germany in " +
                "1 to 2 and Austria in 2 to 3 working days.",
            })}
          </p>
        </div>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            {t({ de: "Rechtliches", en: "Legal" })}
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-2 underline-offset-4 hover:underline">
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            {t({ de: "Service", en: "Service" })}
          </h2>
          <p className="mt-4 text-sm text-ink-2">{SITE.email}</p>
          <p className="mt-2 text-sm text-ink-3">
            {t({
              de: `${WITHDRAWAL_DAYS} Tage Widerrufsrecht. Versand aus ${SITE.warehouse.city}.`,
              en: `${WITHDRAWAL_DAYS} days right of withdrawal. Shipping from ${SITE.warehouse.city}.`,
            })}
          </p>
          <p className="mt-6 text-xs text-ink-3">
            {t({ de: "Alle Produktpreise inkl. MwSt., zzgl.", en: "All product prices include VAT, plus" })}{" "}
            <Link href="/legal/versand" className="underline underline-offset-4">
              {t({ de: "Versandkosten", en: "shipping costs" })}
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
