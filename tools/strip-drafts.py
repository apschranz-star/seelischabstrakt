#!/usr/bin/env python3
"""
Nimmt aus einer Inhaltsdatei alles heraus, was als Entwurf gekennzeichnet ist.

    python3 tools/strip-drafts.py <content.json>

Die Seite selbst zeigt einen Abschnitt mit "draft": true nicht an. Die Datei wird
aber neben der Seite ausgeliefert, und wer sie direkt aufruft, liest den Entwurf
mit. Vor dem Veroeffentlichen fliegt er deshalb heraus, nicht nur aus der
Anzeige. In der Quelle bleibt er, dort gehoert er hin.

Menuepunkte, deren Abschnitt damit weggefallen ist, fallen mit weg: ihre
Beschriftung ist der Titel des Entwurfs.

Geschrieben wird kompakt, ohne Einrueckung: die veroeffentlichte Datei wird
gelesen, nicht bearbeitet.
"""
import json
import sys
from pathlib import Path


def strip(node):
    """Entfernt rekursiv jedes Objekt mit draft = true."""
    if isinstance(node, dict):
        return {k: strip(v) for k, v in node.items() if not (isinstance(v, dict) and v.get("draft") is True)}
    if isinstance(node, list):
        return [strip(v) for v in node if not (isinstance(v, dict) and v.get("draft") is True)]
    return node


def drop_orphan_nav(data):
    """Nimmt Menuepunkte heraus, deren Abschnitt es nicht mehr gibt.

    Die Seite blendet sie ohnehin aus, aber ihre Beschriftung ist der Titel des
    Entwurfs, und der stuende sonst weiter in der ausgelieferten Datei.
    """
    nav = data.get("nav")
    if not isinstance(nav, list):
        return data
    data["nav"] = [n for n in nav if not (isinstance(n, dict) and "id" in n and n["id"] not in data)]
    return data


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    data = json.loads(path.read_text(encoding="utf8"))
    cleaned = drop_orphan_nav(strip(data))
    removed = len(json.dumps(data)) - len(json.dumps(cleaned))
    path.write_text(json.dumps(cleaned, ensure_ascii=False, separators=(",", ":")), encoding="utf8")
    print(f"{path}: {removed} Zeichen Entwurf entfernt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
