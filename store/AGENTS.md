# AGENTS

Project-specific guidance for AI coding agents.

## The storefront of seelischabstrakt

- Source lives in `store/` (React 19, TypeScript, Vite, Astryx 0.7.15). The shop is served from the repository root: `index.html` and `app/` are the BUILT output and are committed, because Netlify has no build step (`netlify.toml`: `command = ""`). After any change in `store/`: `cd store && npm run build`, then commit `index.html` and `app/`. The workflow `store-check.yml` fails when they are stale.
- Content is never in the code. `site.json` and `works.json` in the repository root are fetched at run time and edited in the studio desk (`admin.html`); `src/lib/types.ts` describes them. Every field is optional in practice, the page has to keep rendering when one is missing.
- Texts: UI strings in `src/lib/strings.ts` (EN and DE); `site.json` `texts.ui` can replace single keys. Legal texts in `src/legal/LegalText.tsx` (EN and DE). The withdrawal notice follows the model of Annex I FAGG, the notice on the legal guarantee is the EU's own graphic in `legal/`. Change legal wording only with a source, and keep both languages equal.
- Theme: `src/theme/seelischTheme.ts`; `npm run theme` writes `seelisch.css/.js/.d.ts`. Colours point at CSS custom properties that `src/lib/theme.ts` sets from site.json (`--ground`, `--paper`, `--frame`, `--ink`, ...), so the studio desk's presets keep working. No hard-coded hex in components. Theme mode `dark` is the carpet (the page), mode `light` is paper (labels, cards, sheets), see `components/Paper.tsx`.
- Browser floor: Astryx needs `light-dark()` and `@scope` (Safari 17.5, Chrome 123, Firefox 128). Older browsers get the plain page of `src/lib/legacy.ts`. Do not use components that need anchor positioning (Selector, Tooltip, DropdownMenu, Carousel): Safari before 26 lacks it. Use the native select, `components/NativeSelect.tsx`.
- No outside requests: the CSP is `default-src 'self'` (netlify.toml), fonts are self-hosted, no CDN, no analytics, no cookies.
- Checking a change: there is no test suite. Build, serve the repository root (`python3 -m http.server`), and click through on a phone width and a desktop width: the sheets (`#work/<id>`, `#imprint`, `#privacy`, `#terms`, `#withdrawal`, `#shipping`, `#guarantee`, `#us`, `#access`, `#widerruf`, `#message`), the order flow in three steps, the language switch, and the studio desk preview (`postMessage` with type `sa-preview`). `npx astryx doctor --built .` must report no failure.
- The generic rules below ask for Astryx components everywhere. This shop keeps native elements on purpose for the gallery layout (frames, mosaic, carpet) and for the grid wrappers; controls, overlays, forms, feedback and the text of the legal pages use Astryx components.

<!-- ASTRYX:START -->
Astryx v0.7.15 · 174 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.
Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then tokens (var(--color-*|--spacing-*|--radius-*)). No raw hex/px. No StyleX/Tailwind compiler here — don't use xstyle/utility classes directly. Some templates use StyleX and need a compiler plugin; see `astryx docs styling-overview`.
- Palettes and custom colors go through the theme, never :root overrides. Run `astryx theme add <slug>` to import; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any raw <div>/<span>, imported .css/@apply, or hardcoded #hex/px with the component or a token.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands and API reference
  docs authoring     build an integration package, and every field it holds
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->
