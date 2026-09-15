import type { Metadata } from "next";

import { LegalShell, Section } from "@/app/legal/_template-notice";
import { SITE, WITHDRAWAL_DAYS } from "@/config/site";

export const metadata: Metadata = {
  title: "Widerrufsrecht",
  description: `Widerrufsbelehrung und Muster-Widerrufsformular, ${WITHDRAWAL_DAYS} Tage.`,
  robots: { index: false, follow: true },
};

const L = SITE.legalEntity;
const ADDRESS = `${L.company}, ${L.street}, ${L.zipCity}, ${L.country}, ${SITE.email}`;

export default function WiderrufPage() {
  return (
    <LegalShell title="Widerrufsrecht" updated="September 2026">
      <Section no="1" title="Widerrufsbelehrung">
        <p>
          Du hast das Recht, binnen {WITHDRAWAL_DAYS} Tagen ohne Angabe von Gründen diesen Vertrag zu
          widerrufen. Die Frist beträgt {WITHDRAWAL_DAYS} Tage ab dem Tag, an dem du oder eine von
          dir benannte dritte Person, die nicht der Beförderer ist, die letzte Ware in Besitz genommen
          hat.
        </p>
        <p>
          Um dein Widerrufsrecht auszuüben, musst du uns ({ADDRESS}) mittels einer eindeutigen
          Erklärung, etwa per E-Mail, über deinen Entschluss informieren. Du kannst dafür das
          Muster-Widerrufsformular verwenden, das ist aber nicht vorgeschrieben. Zur Wahrung der
          Frist reicht es, die Mitteilung vor Ablauf der Frist abzusenden.
        </p>
      </Section>

      <Section no="2" title="Folgen des Widerrufs">
        <p>
          Wenn du diesen Vertrag widerrufst, erstatten wir alle Zahlungen, die wir von dir erhalten
          haben, einschließlich der Lieferkosten, unverzüglich und spätestens binnen vierzehn Tagen
          ab dem Tag, an dem die Mitteilung über den Widerruf bei uns eingegangen ist. Die
          Lieferkosten erstatten wir in Höhe der günstigsten von uns angebotenen Standardlieferung.
        </p>
        <p>
          Wir können die Rückzahlung verweigern, bis wir die Ware zurückerhalten haben oder bis du
          den Nachweis erbracht hast, dass du sie zurückgesandt hast, je nachdem, was früher ist.
        </p>
        <p>
          Du trägst die unmittelbaren Kosten der Rücksendung. Für einen Wertverlust musst du nur
          aufkommen, wenn er auf einen Umgang zurückzuführen ist, der zur Prüfung der Beschaffenheit
          nicht notwendig war.
        </p>
      </Section>

      <Section no="3" title="Ausnahme für geöffnete Kosmetik">
        <p>
          Das Widerrufsrecht besteht nicht bei versiegelten Waren, die aus Gründen des
          Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre
          Versiegelung nach der Lieferung entfernt wurde. Kosmetische Mittel, die geöffnet oder
          benutzt wurden, fallen darunter.
        </p>
        <p>
          Ungeöffnete Ware kannst du innerhalb der Frist zurücksenden. Wir kennzeichnen jede
          betroffene Packung mit einem Siegel, damit dieser Punkt vor dem Öffnen erkennbar ist.
        </p>
      </Section>

      <Section no="4" title="Muster-Widerrufsformular">
        <p>
          Wenn du den Vertrag widerrufen willst, fülle dieses Formular aus und sende es zurück.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap border border-line bg-surface-2 p-5 font-mono text-[13px] leading-relaxed text-ink-2">
{`An ${ADDRESS}

Hiermit widerrufe ich den von mir abgeschlossenen Vertrag
über den Kauf der folgenden Waren:

  Artikel, Menge  ______________________________
  Bestellnummer   ______________________________
  Bestellt am     ____________  Erhalten am ____________

  Name            ______________________________
  Anschrift       ______________________________
  Datum           ____________

  Unterschrift    ______________________________
  (nur bei Mitteilung auf Papier)`}
        </pre>
      </Section>
    </LegalShell>
  );
}
