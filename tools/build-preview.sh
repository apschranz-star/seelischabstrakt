#!/bin/sh
# Baut die komplette Vorschau, wie sie auf dem Branch gh-pages liegt.
#
#     tools/build-preview.sh <zielordner> <zugangscode>
#
# Der Zielordner wird gefuellt mit:
#     /              die Praxisseite Farida, hinter dem Zugangscode
#     /portfolio/    die persoenliche Seite, hinter dem Zugangscode
#     /schranz-ai/   Schranz AI in Deutsch und Englisch, hinter dem Zugangscode
#     /shop/         der Kunst-Shop, offen
#     /anker/        die App Anker, hinter dem Zugangscode
#     /jing/         bleibt unberuehrt, die baut ihr eigener Workflow
#
# Dazu eine robots.txt, die Suchmaschinen von der ganzen Vorschau fernhaelt, denn
# die Vorschau ist nicht die oeffentliche Seite.
#
# Dasselbe machen die Workflows unter .github/workflows/ bei jedem Push,
# sobald das Repository-Secret SITE_ACCESS_KEY gesetzt ist. Dieses Skript ist der
# Weg von Hand, solange es fehlt.
set -e
target="$1"
key="$2"
here=$(cd "$(dirname "$0")/.." && pwd)

if [ -z "$target" ] || [ -z "$key" ]; then
  echo "Aufruf: tools/build-preview.sh <zielordner> <zugangscode>" >&2
  exit 2
fi
mkdir -p "$target"

# Alles ausser jing und .git wird neu geschrieben.
find "$target" -mindepth 1 -maxdepth 1 ! -name .git ! -name jing -exec rm -rf {} +

# Praxisseite an die Wurzel
cp -R "$here/farida/." "$target/"
rm -f "$target/netlify.toml" "$target/README.md" "$target/sitemap.xml"
# Abschnitte mit draft stehen nicht auf der Seite, wohl aber in der Datei daneben.
python3 "$here/tools/strip-drafts.py" "$target/content.json"
# Beide Seiten des Ordners hinter den Code, nicht nur die Startseite.
for f in index.html modulo.html; do
  if [ -f "$target/$f" ]; then sh "$here/gate/inject.sh" "$target/$f" "$key"; fi
done

# Persoenliche Seite
mkdir -p "$target/portfolio"
cp -R "$here/portfolio/." "$target/portfolio/"
rm -f "$target/portfolio/netlify.toml" "$target/portfolio/README.md"
rm -f "$target/portfolio/robots.txt" "$target/portfolio/sitemap.xml"
sh "$here/gate/inject.sh" "$target/portfolio/index.html" "$key"

# Schranz AI, beim Bauen kommt der Code hinein
(
  cd "$here/schranz-ai"
  SITE_ACCESS_KEY="$key" \
  SITE_BASE=/seelischabstrakt/schranz-ai \
  SITE_URL=https://apschranz-star.github.io/seelischabstrakt/schranz-ai \
  node build.mjs >/dev/null
)
mkdir -p "$target/schranz-ai"
cp -R "$here/schranz-ai/dist/." "$target/schranz-ai/"
rm -rf "$here/schranz-ai/dist"

# Kunst-Shop, offen, ohne Zugangscode
mkdir -p "$target/shop"
cp "$here/index.html" "$here/404.html" "$here/site.json" "$here/works.json" "$target/shop/"
cp -R "$here/img" "$target/shop/img"
cp -R "$here/fonts" "$target/shop/fonts"

# Anker, die App bei SLE und Zoeliakie
mkdir -p "$target/anker"
cp "$here/anker/index.html" "$here/anker/app.css" "$here/anker/app.js" \
   "$here/anker/content.js" "$here/anker/sw.js" "$here/anker/manifest.webmanifest" \
   "$here/anker/icon.svg" "$here/anker/icon-180.png" "$here/anker/icon-192.png" \
   "$here/anker/icon-512.png" "$here/anker/icon-512-maskable.png" "$target/anker/"
cp -R "$here/anker/fonts" "$target/anker/fonts"
# Die App verbietet in ihrem Kopf Inline-Code, deshalb kommt das Tor dort als
# zwei eigene Dateien statt als eingesetzter Block. Siehe gate/split.py.
python3 "$here/gate/split.py" "$target/anker" "Anker" "Alexander Schranz"
sh "$here/gate/inject.sh" "$target/anker/zugang.js" "$key"

printf 'User-agent: *\nDisallow: /\n' > "$target/robots.txt"
touch "$target/.nojekyll"

echo "Vorschau gebaut in $target"

# Nachsehen statt behaupten. Jede Seite, die hinter den Code gehoert, muss ihn
# tragen; steht irgendwo noch der Platzhalter, ist etwas schiefgegangen und die
# Seite laege offen im Netz.
fehler=0
for f in "$target/index.html" "$target/modulo.html" "$target/portfolio/index.html" \
         "$target/schranz-ai/index.html" "$target/schranz-ai/en/index.html" \
         "$target/anker/zugang.js"; do
  [ -f "$f" ] || continue
  if grep -q "__ACCESS_KEY__" "$f"; then echo "FEHLER: kein Zugangscode in $f" >&2; fehler=1; fi
  if ! grep -q "$key" "$f"; then echo "FEHLER: der Code steht nicht in $f" >&2; fehler=1; fi
done
[ "$fehler" = 0 ] || exit 1
echo "Zugang gesetzt in Praxisseite, Formular, persoenlicher Seite, Schranz AI und Anker. Shop offen."
