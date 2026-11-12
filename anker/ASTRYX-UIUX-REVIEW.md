# Astryx UI/UX review: Anker

Date: 2026-11-10
Scope: `anker/` in `apschranz-star/seelischabstrakt`, branch `astryx/anker-uiux-review`.

## Executive assessment

Anker already has a coherent, deliberately art-directed interface. It uses a restrained design-token system, responsive cards, a six-destination bottom navigation, explicit light/dark themes, large health sliders, diary visualisations, appointment workflows, recipe cards, and a reduced-motion rule. Replacing the interface wholesale would add risk without evidence of a better user outcome.

The most defensible first merge is a small accessibility layer. It improves keyboard focus visibility, high-contrast presentation, forced-colour focus, and anchor/scroll positioning without changing app logic, health content, stored data, or the privacy model.

## Agent council findings

### 1. Design director
- Existing visual identity is consistent: Bricolage Grotesque / IBM Plex Sans, shared spacing and radius tokens, module colour accents, and light/dark palettes.
- The app already has a clear hierarchy between the daily check-in, supporting cards, and the bottom navigation.
- Recommendation: retain the visual language. Avoid a full redesign or adding another component framework.

### 2. UX auditor
- Main journeys are separated into Heute, Journal, Termine, Essen, Wissen, and Mappe.
- The nutrition journey is already represented in the Essen section, including recipes, saved recipes, disease-related food rules, and ingredient warnings.
- Recommendation: keep nutrition guidance and recipe discovery connected to the selected health modules. Do not introduce unsupported dietary advice or unverified food claims.

### 3. Mobile specialist
- The app is built for a narrow, mobile-first content column and accounts for iOS safe-area insets.
- The fixed six-item navigation is compact. Its labels are relatively small, so it deserves real-device review at 320-375 CSS px before changing its layout.
- Recommendation: do not enlarge or restructure the tab bar without checking actual iPhone rendering and label fit.

### 4. Accessibility auditor
- Existing CSS includes focus treatment for selected control classes, but many other interactive controls are outside that selector, including calendar, week, and journal controls.
- The current styles already include a reduced-motion preference.
- Recommendation implemented: a shared `:focus-visible` treatment for interactive elements, stronger borders/text when the user requests increased contrast, and a visible system-colour focus ring in forced-colour mode.

### 5. Component architect
- Anker is intentionally plain HTML, CSS, and JavaScript. Its Content Security Policy blocks network connections and inline scripts.
- Introducing React, remote fonts, analytics, third-party widgets, or a network-backed design system would violate the existing architecture or increase the attack surface.
- Recommendation: implement design improvements as local CSS and existing DOM patterns.

### 6. Privacy and safety engineer
- The document declares `connect-src 'none'`, and the app stores diary data locally.
- No data-flow, local-storage, medical-content, translation, or content changes are part of this branch.
- Recommendation: preserve the CSP and avoid any new remote dependency.

### 7. QA reviewer
- The repository provides syntax, language structure, interface translation, German key, module/content, and deployment checks.
- The handover also describes browser text comparison and prior axe-core results. Those historical results are not treated as a fresh pass for this branch.
- Limitation: no local browser/Playwright session was available during this review. CI must run on the pull request before merge.

### 8. Product critic
- The highest-value low-risk change is to make keyboard and accessibility states predictable across all controls.
- A larger nutrition redesign should be a separate product decision, informed by the actual nutrition app/repository and its user journeys.

## Changes prepared

### `anker/app.css`
- Added a consistent visible focus ring to links, buttons, inputs, selects, textareas, summaries, and focusable elements.
- Added scroll margins to key cards and expandable content.
- Added higher-contrast borders and supporting text under `prefers-contrast: more`.
- Added system-colour focus treatment and selected-state borders under `forced-colors: active`.
- No inline styles, JavaScript, external assets, or network requests added.

## Explicitly not changed

- `app.js`, `index.html`, `sw.js`, content and translation files.
- Health claims, evidence strength, warning signs, recipes, ingredient rules, doses, or clinical recommendations.
- Local-storage schema, IDs, diary keys, or backup format.
- Content Security Policy, access gate, and publishing workflow.

## Merge recommendation

**Merge the CSS-only accessibility layer if CI passes and visual review on an iPhone and desktop shows no regressions.**

Do not merge a broad redesign at this stage. Before a second pass, review:
1. Navigation legibility and touch interaction on small iPhones.
2. Calendar and chart readability in light mode and at larger system text sizes.
3. Nutrition/recipe discovery with the real dietary workflows and the separate nutrition app, if there is one.
4. A fresh axe-core/browser pass in both themes.

## Scope note: nutrition app

The connected repository currently exposes Anker and its `Essen` nutrition/recipe section. No separate nutrition-app repository was found in the connected GitHub repositories. This branch therefore audits Anker's nutrition experience, not an independent second app.
