#!/bin/sh
# Build for Netlify (base directory sofia/). Every step must pass, otherwise
# the deploy fails and the version already online stays online.
set -e
cd "$(dirname "$0")/.."

echo "1/4 tests (planner limits, council, recipes, statistics, parser, plan audit)"
node --test test/*.test.mjs

echo "2/4 evidence data from docs/fonti"
node tools/genera-evidenze.mjs

echo "3/4 access gate (tools/gate-sofia.mjs: only a hash of the code goes into the page)"
if [ -f app/zugang.js ] && grep -q 'var HASH = "[0-9a-f]\{64\}"' app/zugang.js; then
  echo "gate: already armed"
else
  node tools/gate-sofia.mjs
fi
# A production build never ships an open gate: no code means no deploy.
if [ "$CONTEXT" = "production" ] && ! grep -q 'var HASH = "[0-9a-f]\{64\}"' app/zugang.js 2>/dev/null; then
  echo "gate: no access code for a production build (set SOFIA_ACCESS_KEY or upload an armed gate)" >&2
  exit 1
fi

echo "4/4 version stamp for the service worker"
node tools/timbro.mjs
