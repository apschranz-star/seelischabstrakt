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
#     /jing/         bleibt unberuehrt, die baut ihr eigener Workflow
#
# Dazu eine robots.txt, die Suchmaschinen von der ganzen Vorschau fernhaelt, denn
# die Vorschau ist nicht die oeffentliche Seite.
#
# Dasselbe machen die vier Workflows unter .github/workflows/ bei jedem Push,
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
sh "$here/gate/inject.sh" "$target/index.html" "$key"

# Persoenliche Seite
mkdir -p "$target/portfolio"
cp -R "$here/portfolio/." "$target/portfolio/"
rm -f "$target/portfolio/netlify.toml" "$target/portfolio/README.md"
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

printf 'User-agent: *\nDisallow: /\n' > "$target/robots.txt"
touch "$target/.nojekyll"

echo "Vorschau gebaut in $target"
grep -l "__ACCESS_KEY__" "$target/index.html" "$target/portfolio/index.html" 2>/dev/null \
  && { echo "FEHLER: Zugangscode nicht eingesetzt" >&2; exit 1; }
echo "Zugang gesetzt in Praxisseite, persoenlicher Seite und Schranz AI. Shop offen."
