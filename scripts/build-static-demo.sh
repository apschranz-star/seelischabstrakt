#!/usr/bin/env bash
# Builds the static demo of JING into ./out.
#
# The route handlers under app/api cannot be part of a static export, so they
# are moved aside for the duration of the build and put back afterwards, also
# when the build fails. The checkout knows it is in the demo
# (NEXT_PUBLIC_JING_STATIC_DEMO) and computes its mock session in the browser.
#   scripts/build-static-demo.sh /seelischabstrakt/jing https://apschranz-star.github.io/seelischabstrakt/jing
set -euo pipefail
BASE_PATH="${1:-}"
SITE_URL="${2:-https://jing.example}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

restore() { if [ -d .api-aside ]; then rm -rf app/api; mv .api-aside app/api; fi; }
trap restore EXIT
mv app/api .api-aside

JING_STATIC_DEMO=1 \
JING_BASE_PATH="$BASE_PATH" \
NEXT_PUBLIC_JING_STATIC_DEMO=1 \
NEXT_PUBLIC_SITE_URL="$SITE_URL" \
NEXT_TELEMETRY_DISABLED=1 \
npx next build

# Next 16 writes the export into distDir itself.
rm -rf out
cp -r .next-demo out
touch out/.nojekyll
echo "static demo written to $ROOT/out (base path '${BASE_PATH:-/}')"
