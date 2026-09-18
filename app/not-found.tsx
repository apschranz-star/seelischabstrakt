"use client";

import Link from "next/link";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RITUAL } from "@/components/home/ritual-copy";
import { useT } from "@/lib/i18n";

/**
 * Die Seite fuer eine Adresse, die es nicht gibt.
 *
 * Ohne diese Datei rendert Next seine eingebaute Fehlseite, und die bringt ein
 * eigenes style-Element mit: weisse Flaeche, schwarze Schrift, im dunklen
 * Systemschema umgekehrt. Sie folgt also dem Betriebssystem und nicht der
 * Tageszeit, in der der Shop steht. Wer im Nachtritual auf eine tote Adresse
 * kam, bekam einen weissen Block mitten in die Nacht gesetzt.
 *
 * Diese hier steht in der Palette des Rituals, wie jede andere Seite, und
 * schickt in dieselbe Kollektion zurueck, in der der Besucher war.
 */
export default function NotFound() {
  const t = useT();
  const { mode, hydrated } = useYinYang();
  const activeMode = hydrated ? mode : "yang";
  const ritual = t(RITUAL[activeMode].title);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1240px] flex-col justify-center px-4 py-24 sm:px-6">
      <EmptyState
        kicker="404"
        title={t({ de: "Diese Seite gibt es nicht.", en: "This page does not exist." })}
        text={t({
          de:
            "Die Adresse führt ins Leere. Vielleicht ist das Stück aus dem Sortiment genommen worden, " +
            "vielleicht hat sich ein Zeichen verirrt.",
          en:
            "The address leads nowhere. The piece may have left the range, or a character may have " +
            "gone astray.",
        })}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link href="/" className={buttonClasses("solid", "md")}>
              {t({ de: `${ritual} ansehen`, en: `View ${ritual}` })}
            </Link>
            <Link href="/cart" className={buttonClasses("outline", "md")}>
              {t({ de: "Warenkorb", en: "Cart" })}
            </Link>
          </div>
        }
      />
    </div>
  );
}
