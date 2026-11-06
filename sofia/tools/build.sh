#!/bin/sh
# Build for Netlify (base directory sofia/). Every step must pass, otherwise
# the deploy fails and the version already online stays online.
set -e
cd "$(dirname "$0")/.."

echo "1/4 tests (planner limits, council, recipes, statistics, parser, plan audit)"
node --test test/*.test.mjs

echo "2/4 evidence data from docs/fonti"
node tools/genera-evidenze.mjs

echo "3/4 access gate (same template as anker, gate/gate.snippet.html)"
if [ -f app/zugang.js ] && ! grep -q "__ACCESS_KEY__" app/zugang.js; then
  echo "gate: already armed"
else
  python3 tools/gate/split.py app "Sofia" "Alexander Schranz, Wien"
  sh tools/gate/inject.sh app/zugang.js "${SOFIA_ACCESS_KEY:-${SITE_ACCESS_KEY:-}}"
fi

echo "4/4 version stamp for the service worker"
node tools/timbro.mjs
