import type { Metadata } from "next";

import { LegalShell, Section } from "@/app/legal/_template-notice";
import { REGIONS, REGION_ORDER, SITE, WITHDRAWAL_DAYS } from "@/config/site";
import { deliveryWindow, formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Versand und Steuern",
  description: "Versandkosten, Lieferzeiten, Zoll und Umsatzsteuer für Deutschland, Österreich und die Schweiz.",
};

export default function VersandPage() {
  return (
    <LegalShell title="Versand, Zoll und Steuern" updated="September 2026">
      <Section no="1" title="Woher wir liefern">
        <p>
          Alle Sendungen verlassen unser Lager in {SITE.warehouse.city}, {SITE.warehouse.country}.{" "}
          {SITE.warehouse.note}
        </p>
      </Section>

      <Section no="2" title="Kosten und Zeiten">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line-2">
                <th scope="col" className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  Land
                </th>
                <th scope="col" className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  Versand
                </th>
                <th scope="col" className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  Frei ab
                </th>
                <th scope="col" className="py-2 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  Dauer
                </th>
                <th scope="col" className="py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  Steuer
                </th>
              </tr>
            </thead>
            <tbody>
              {REGION_ORDER.map((code) => {
                const region = REGIONS[code];
                return (
                  <tr key={code} className="border-b border-line">
                    <td className="py-3 pr-4">{region.label}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatMoney(region.shippingCents, region.currency)}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatMoney(region.freeShippingCents, region.currency)}
                    </td>
                    <td className="py-3 pr-4">{deliveryWindow(region)}</td>
                    <td className="py-3">{region.vatLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-ink-3">
          Alle Preise im Shop sind Endpreise und enthalten die Umsatzsteuer des Lieferlandes. Die
          Versandkosten kommen hinzu und stehen vor dem Absenden der Bestellung im Warenkorb.
        </p>
      </Section>

      <Section no="3" title="Schweiz">
        <p>{REGIONS.CH.customs?.note}</p>
        <p>
          Für die Abfertigung berechnen wir{" "}
          {formatMoney(REGIONS.CH.customs?.clearanceCents ?? 0, "CHF")} je Sendung. Der Betrag steht
          im Warenkorb als eigene Zeile, damit an der Haustür nichts nachgefordert wird.
        </p>
      </Section>

      <Section no="4" title="Rückgabe">
        <p>
          {WITHDRAWAL_DAYS} Tage Widerrufsrecht. Geöffnete kosmetische Mittel sind aus
          Hygienegründen ausgenommen, Einzelheiten stehen auf der Seite Widerrufsrecht. Die
          unmittelbaren Kosten der Rücksendung trägst du.
        </p>
      </Section>
    </LegalShell>
  );
}
