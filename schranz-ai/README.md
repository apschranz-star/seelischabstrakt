# SCHRANZ AI SOLUTIONS, the pitch deck as a website

German at `/`, English at `/en/`. Built from one file, `content.json`, by `build.mjs`. No dependencies, no framework, no tracking.

    content.json     every text in both languages, every number from the deck
    styles.css       the look, inlined into each page at build time
    site.js          the motion: reveals, counters, the funds bar, the live method step, the menu
    build.mjs        turns content.json into dist/ (DE, EN, imprint, privacy, 404, sitemap, robots)
    netlify.toml     Netlify settings if the site gets its own domain
    SCHRANZ_AI_Pitchdeck_EN.pptx   the original deck, offered as a download in the footer

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
