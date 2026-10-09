# SCHRANZ AI SOLUTIONS, freelance AI consulting, and the raise behind it

Two riders, one site, switched at the top like tabs:

    Für Kunden / For clients     /            /en/          packages, calculator, method, proof, industries, first call
    Mitmachen / Get involved     /mitmachen/  /en/scale/    market, numbers, value, horizon, the raise, returns, the ask

German at `/`, English at `/en/`. Built from one file, `content.json`, by `build.mjs`. No dependencies, no framework, no tracking.

    content.json     every text in both languages, every number from the deck
    styles.css       the look, inlined into each page at build time
    site.js          the motion: reveals, word-by-word headings, counters, the funds bar, the method line, card rails, pointer light, scroll progress, the menu
    build.mjs        turns content.json into dist/ (DE, EN, imprint, privacy, 404, sitemap, robots)
    netlify.toml     Netlify settings if the site gets its own domain
    SCHRANZ_AI_Pitchdeck_EN.pptx   the original deck, offered as a download in the footer

## The look

Since October 2026 in the direction of Anker: headings in Bricolage Grotesque
(self-hosted, copied from `../anker/fonts` at build time), neon lime for
everything you can press or move, a segmented rider switch in the header and a
tab bar at the bottom on phones and tablets. Interactive parts: a package
switch (Audit, Build Sprint, Retainer) that lights the steps of the method each
package covers, a calculator with four sliders (hours per week, people, cost
per hour, share a system could take over; 46 working weeks a year; payback
against the Build Sprint price from the deck), and an industry switch. The
calculator runs in the browser and sends or stores nothing.

Dark first and cinematic, on top of the original: same system type, same type
scale, same blue, same sections. Added: an aurora and a receding light floor in
the hero, an orbit of the three method steps (Diagnose, Bauen, Messen) on wide
screens, a ticker of points under the hero, glass cards with light that follows
the pointer, rails of cards that slide sideways (difference, proof, fields) with
buttons, drag and a progress line, a line of light down the method steps, and a
contact card with a travelling border. Everything moving respects reduced motion,
and the page reads completely without JavaScript.

## Change something

Edit `content.json`. Every text is `{ "en": "...", "de": "..." }` and both must be filled, the build stops otherwise. Numbers, prices and dates are facts from the deck of September 2026. Change them only with a new value from Alexander. Values in square brackets are placeholders, the address in the imprint is one.

Push to `main`. The workflow `.github/workflows/schranz-ai-pages.yml` builds both languages and publishes them to the branch `gh-pages` under `schranz-ai/`. The practice site's workflow leaves that folder alone.

    Live    https://apschranz-star.github.io/seelischabstrakt/schranz-ai/
    English https://apschranz-star.github.io/seelischabstrakt/schranz-ai/en/

## Build locally

    cd schranz-ai
    node build.mjs
    npx serve dist

For the GitHub Pages path the build needs the base:

    SITE_BASE=/seelischabstrakt/schranz-ai SITE_URL=https://apschranz-star.github.io/seelischabstrakt/schranz-ai node build.mjs

## Own domain

Netlify, Add new project, Import from Git, this repository, Base directory `schranz-ai`. The rest is in `netlify.toml`. Then set the domain and replace `site.url` in `content.json` with it so canonical and hreflang links point at the domain.

## Before announcing it

The imprint carries a placeholder for the street address, and the trade register and VAT number follow after incorporation. Fill them in `content.json` under `legal.imprint`. The privacy page describes what the site does today: no cookies, no analytics, fonts from the system, hosting on GitHub Pages. If a contact form or analytics is added, that page changes with it.
