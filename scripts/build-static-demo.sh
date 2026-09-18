#!/usr/bin/env bash
# Builds the static demo of JING into ./out.
#
# The route handlers under app/api cannot be part of a static export, so they
# are moved aside for the duration of the build and put back afterwards, also
# when the build fails. The checkout knows it is in the demo
# (NEXT_PUBLIC_JING_STATIC_DEMO) and computes its mock session in the browser.
#   JING_ACCESS_KEY=<code> scripts/build-static-demo.sh /seelischabstrakt/jing https://apschranz-star.github.io/seelischabstrakt/jing
set -euo pipefail
BASE_PATH="${1:-}"
SITE_URL="${2:-https://jing.example}"
# The access code. With it the demo only opens through ?zugang=<code> or the code
# typed on the gate, and asks not to be indexed. Preferably in JING_ACCESS_KEY:
# a third argument stands in the process list, where every other process on the
# machine can read it. The argument stays for calls by hand.
ACCESS_KEY="${JING_ACCESS_KEY:-${3:-}}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

restore() { if [ -d .api-aside ]; then rm -rf app/api; mv .api-aside app/api; fi; }
# A run that was killed between the move and the restore leaves the routes lying
# in .api-aside. Put them back before moving again: mv into an existing directory
# nests instead of renaming, and the restore would then rebuild app/api/api.
restore
trap restore EXIT
mv app/api .api-aside
rm -rf out

JING_STATIC_DEMO=1 \
JING_BASE_PATH="$BASE_PATH" \
NEXT_PUBLIC_JING_STATIC_DEMO=1 \
NEXT_PUBLIC_SITE_URL="$SITE_URL" \
NEXT_PUBLIC_JING_ACCESS_KEY="$ACCESS_KEY" \
NEXT_TELEMETRY_DISABLED=1 \
npx next build

test -f out/index.html || { echo "export did not produce out/index.html" >&2; exit 1; }
touch out/.nojekyll
echo "static demo written to $ROOT/out (base path '${BASE_PATH:-/}')"
