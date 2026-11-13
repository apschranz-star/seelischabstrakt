"""
Macht aus jedem Werkfoto in works.json WebP-Fassungen (600, 1000 und 1600
Pixel breit) und setzt beim Werk "webp": true. Die Seite laedt dann die
passende Groesse; Browser ohne WebP und Werke ohne den Eintrag bekommen
weiter das JPEG. Neue Werke ueber /add haben den Eintrag nicht und laufen
einfach mit dem JPEG, bis dieses Skript wieder laeuft.

Die weiteren Fotos unter "images" bekommen dieselben Fassungen und das Werk
"webpImages": true. Die Kacheln oben auf der Startseite nehmen die kleinen
600er Dateien.

    python3 tools/bilder.py
"""
import json, os
from PIL import Image

WURZEL = os.path.join(os.path.dirname(__file__), "..")
BREITEN = (600, 1000, 1600)


def fassungen(rel):
    quelle = os.path.join(WURZEL, rel)
    if not os.path.exists(quelle) or not rel.lower().endswith((".jpg", ".jpeg", ".png")):
        return False
    bild = Image.open(quelle).convert("RGB")
    stamm = os.path.splitext(quelle)[0]
    for w in BREITEN:
        ziel = f"{stamm}-{w}.webp"
        x = bild if bild.width <= w else bild.resize((w, round(bild.height * w / bild.width)), Image.LANCZOS)
        x.save(ziel, "WEBP", quality=80, method=6)
    return True


def main():
    pfad = os.path.join(WURZEL, "works.json")
    daten = json.load(open(pfad, encoding="utf-8"))
    for werk in daten["works"]:
        if werk.get("img") and fassungen(werk["img"]):
            werk["webp"] = True
        mehr = werk.get("images") or []
        if mehr and all([fassungen(r) for r in mehr]):
            werk["webpImages"] = True
    with open(pfad, "w", encoding="utf-8") as f:
        json.dump(daten, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
