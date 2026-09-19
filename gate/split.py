#!/usr/bin/env python3
"""
Legt den Zugang aus gate.snippet.html als zwei eigene Dateien ab.

    python3 gate/split.py <zielordner> "<Seitenname>" "<Betreiber>" ["<Kontakt>"]

Schreibt <zielordner>/zugang.js und <zielordner>/zugang.css. Der Zugangscode
bleibt der Platzhalter __ACCESS_KEY__ und wird beim Veroeffentlichen von
gate/inject.sh eingesetzt.

WARUM ES DAS GIBT
apply.py setzt denselben Zugang als Block mit <script> und <style> in die Seite.
Das geht ueberall, wo eine Seite Inline-Code erlaubt. Anker erlaubt das nicht:
die App traegt Gesundheitsdaten und erklaert im Kopf script-src 'self' und
style-src 'self'. Ein eingesetzter Block waere dort stumm blockiert, und die
Seite stuende mit gruenem Lauf offen. Zwei Dateien von derselben Adresse
erfuellen dieselbe Regel.

Eine Quelle bleibt es trotzdem: hier wird nichts neu geschrieben, sondern aus
gate.snippet.html herausgeloest. Was an der Vorlage geaendert wird, gilt fuer
beide Wege.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    ziel, name, betreiber = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
    kontakt = sys.argv[4] if len(sys.argv) > 4 else ""

    if not ziel.is_dir():
        print(f"split: {ziel} ist kein Ordner", file=sys.stderr)
        return 1

    snippet = (HERE / "gate.snippet.html").read_text(encoding="utf8")
    snippet = snippet.replace("__SITE_NAME__", name).replace("__OPERATOR__", betreiber)
    snippet = snippet.replace(
        "__CONTACT_LINE__", f" Kontakt: {kontakt}." if kontakt else ""
    )

    js = re.search(r"<script>\n(.*?)\n</script>", snippet, re.S)
    css = re.search(r"<style>\n(.*?)\n</style>", snippet, re.S)
    if not js or not css:
        print("split: in gate.snippet.html fehlt der script- oder der style-Block", file=sys.stderr)
        return 1

    kopf = (
        "/* Aus gate/gate.snippet.html erzeugt von gate/split.py. Nicht von Hand\n"
        "   aendern: die naechste Veroeffentlichung ueberschreibt die Datei. */\n"
    )
    (ziel / "zugang.js").write_text(kopf + js.group(1) + "\n", encoding="utf8")
    (ziel / "zugang.css").write_text(kopf + css.group(1) + "\n", encoding="utf8")
    print(f"split: zugang.js und zugang.css in {ziel} abgelegt, Betreiber {betreiber}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
