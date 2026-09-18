#!/usr/bin/env python3
"""
Holt die Schriften von Google einmal her und legt sie neben die Seite.

    python3 tools/selfhost-fonts.py <seite.html> <schriftordner> [--subsets latin,latin-ext]

Warum: Ein <link> auf fonts.googleapis.com laedt die Schrift beim Besucher aus
den USA nach und uebertraegt dabei seine IP-Adresse an Google. Das ist ohne
Einwilligung nicht zulaessig (LG Muenchen I, 3 O 17493/20; Art. 6 DSGVO). Wer
die Dateien selbst ausliefert, hat das Problem nicht: es geht keine Anfrage mehr
an einen Dritten.

Was das Skript macht:
  1. sucht im HTML die Stylesheet-Links auf fonts.googleapis.com,
  2. holt deren CSS mit einer Browser-Kennung, damit Google woff2 liefert,
  3. behaelt die Zeichensaetze, die die Seite braucht (Standard latin, latin-ext),
  4. laedt die woff2-Dateien in den Schriftordner,
  5. schreibt dort fonts.css mit relativen Pfaden,
  6. ersetzt im HTML die preconnect-Zeilen und den Google-Link durch diese Datei.

Das Skript aendert nichts, wenn es keinen Google-Link findet, und laesst das HTML
unangetastet, solange nicht jede Datei geladen werden konnte.
"""
import argparse
import re
import sys
import urllib.request
from pathlib import Path

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
LINK = re.compile(
    r'[ \t]*<link[^>]*href="(https://fonts\.googleapis\.com/css2\?[^"]+)"[^>]*>\n?'
)
PRECONNECT = re.compile(
    r'[ \t]*<link[^>]*rel="preconnect"[^>]*href="https://fonts\.g(?:oogleapis|static)\.com"[^>]*>\n?'
)
FACE = re.compile(r"(/\*\s*([a-z0-9-]+)\s*\*/\s*)?@font-face\s*\{(.*?)\}", re.S)
SRC = re.compile(r"url\((https://fonts\.gstatic\.com/[^)]+)\)")
FAMILY = re.compile(r"font-family:\s*'([^']+)'")
STYLE = re.compile(r"font-style:\s*([a-z]+)")
WEIGHT = re.compile(r"font-weight:\s*([0-9 ]+)")


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("html")
    parser.add_argument("outdir")
    parser.add_argument("--subsets", default="latin,latin-ext")
    args = parser.parse_args()

    html_path = Path(args.html)
    outdir = Path(args.outdir)
    wanted = {s.strip() for s in args.subsets.split(",") if s.strip()}
    html = html_path.read_text(encoding="utf8")

    urls = LINK.findall(html)
    if not urls:
        print(f"{html_path}: kein Google-Link gefunden, nichts zu tun")
        return 0

    outdir.mkdir(parents=True, exist_ok=True)
    blocks, files = [], 0
    for url in urls:
        css = get(url).decode("utf8")
        for _, subset, body in FACE.findall(css):
            if subset and subset not in wanted:
                continue
            match = SRC.search(body)
            family = FAMILY.search(body)
            if not match or not family:
                continue
            style = (STYLE.search(body) or [None, "normal"])[1]
            weight = (WEIGHT.search(body) or [None, "400"])[1].replace(" ", "-")
            name = f"{slug(family.group(1))}-{subset or 'all'}-{style}-{weight}.woff2"
            (outdir / name).write_bytes(get(match.group(1)))
            files += 1
            blocks.append(
                "@font-face {\n  "
                + body.strip().replace(match.group(0), f"url({name})").replace("\n  ", "\n  ")
                + "\n}"
            )

    if not files:
        print(f"{html_path}: keine Schriftdatei geladen, HTML bleibt unveraendert", file=sys.stderr)
        return 1

    header = (
        "/* Selbst ausgelieferte Schriften. Erzeugt von tools/selfhost-fonts.py,\n"
        "   nicht von Hand aendern. Es geht keine Anfrage mehr an Google. */\n"
    )
    (outdir / "fonts.css").write_text(header + "\n".join(blocks) + "\n", encoding="utf8")

    rel = Path(outdir.name if outdir.parent == html_path.parent else outdir) / "fonts.css"
    html = PRECONNECT.sub("", html)
    html = LINK.sub("", html, count=len(urls))
    tag = f'<link rel="stylesheet" href="{rel.as_posix()}">\n'
    anchor = "</title>\n"
    html = html.replace(anchor, anchor + tag, 1) if anchor in html else tag + html
    html_path.write_text(html, encoding="utf8")
    print(f"{html_path}: {files} Schriftdateien in {outdir}, Link ersetzt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
