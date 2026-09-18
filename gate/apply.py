#!/usr/bin/env python3
"""
Setzt den Zugang aus gate.snippet.html in eine Seite, mit Betreiber und Kontakt.

    python3 gate/apply.py <seite.html> "<Seitenname>" "<Betreiber>" ["<Kontakt>"]

Gibt es in der Datei schon einen Block zwischen <!-- gate:start --> und
<!-- gate:end -->, wird er ersetzt, sonst wird der Block nach dem viewport-Tag
eingefuegt. Der Zugangscode bleibt dabei der Platzhalter __ACCESS_KEY__ und wird
erst beim Veroeffentlichen von gate/inject.sh eingesetzt, damit er nicht im
Repository steht.

Der Kontakt ist freiwillig. Fehlt er, faellt die Zeile weg, statt eine leere
Klammer stehen zu lassen.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
START, END = "<!-- gate:start -->", "<!-- gate:end -->"


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    page, name, operator = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
    contact = sys.argv[4] if len(sys.argv) > 4 else ""

    snippet = (HERE / "gate.snippet.html").read_text(encoding="utf8").rstrip("\n")
    snippet = snippet.replace("__SITE_NAME__", name).replace("__OPERATOR__", operator)
    snippet = snippet.replace(
        "__CONTACT_LINE__", f" Kontakt: {contact}." if contact else ""
    )

    html = page.read_text(encoding="utf8")
    if START in html and END in html:
        head, rest = html.split(START, 1)
        _, tail = rest.split(END, 1)
        html = head + snippet + tail
    else:
        anchor = '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        if anchor not in html:
            print(f"{page}: kein viewport-Tag gefunden, nichts eingefuegt", file=sys.stderr)
            return 1
        html = html.replace(anchor, anchor + snippet + "\n", 1)
    page.write_text(html, encoding="utf8")
    print(f"{page}: Zugang gesetzt, Betreiber {operator}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
