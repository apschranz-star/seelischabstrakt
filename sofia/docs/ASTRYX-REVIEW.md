# Astryx review: Sofia nutrition and health app

Date: 2026-11-10
Review branch: `astryx/sofia-refinement`
Source branch: `sofia-app-clean`
Target integration branch: `main`

## Scope and operating constraints

Reviewed Sofia as a separate product in `sofia/`, not Anker's Essen section.
The trial-week operating rule remains in force: no live deploy, no live data
mutation, no access-code rotation, no plan-text re-encryption, and no
production configuration changes as part of this review.

The access code itself is not present in this branch, in the audit, or in
the CI workflow. The encrypted plan payload is unchanged.

## Council findings

### Product and UX
- The app already has a coherent mobile-first design system, five primary
  bottom-navigation destinations, a dedicated settings route, safe-area
  spacing, and clear home-to-meal-log pathways.
- The home screen and food log already expose confirmation and daily meal
  entries; the weekly view has the six planned nutrient/food-group rows and
  ingredient-removal workflow.
- The 3D journey includes captions and a step-forward control. The text
  journey information remains available in the surrounding UI.

### Accessibility
- The app already had a main landmark, visible keyboard focus, 44px-class
  primary controls, and reduced-motion handling.
- It lacked a direct keyboard skip link. Added a translated skip-to-content
  link and made the main landmark a programmatic focus target.
- Added stronger system contrast handling for users requesting increased
  contrast, plus a system-colour focus indicator in forced-colour modes.

### Interaction and 3D
- A cancelled pointer gesture was handled like a completed tap. This could
  select an organ after an interrupted touch or browser gesture.
- A second touch could overwrite the first touch's tap state during pinch
  interaction. Updated pointer bookkeeping so multi-touch gestures cannot
  be mistaken for taps, zero-distance pinch updates are ignored, and
  `pointercancel` only cleans up gesture state.

### Privacy and release safety
- Profile, diary, medicines, weight, lab results and preferences are stored
  in the browser, not sent to the app server. The food name is sent to the
  app's lookup endpoint only when the online lookup is requested.
- The Netlify site currently reports no server-side visitor password or SSO
  requirement. The project privacy note correctly explains that the
  JavaScript gate is not server-side access control. This remains a
  documented deployment-level risk, not changed here because changing
  access controls could interrupt Sofia's trial.
- The access-code hash, encrypted plan payload, and deployment configuration
  were not edited.

## Changes in this review

1. `sofia/app/js/main.js`: keyboard skip link; main landmark accepts focus.
2. `sofia/app/css/app.css`: skip-link styling, increased-contrast tokens,
   and forced-colour focus treatment.
3. `sofia/app/js/three/corpo3d.js`: correct cancellation and multi-touch
   handling for the interactive 3D body.
4. `.github/workflows/sofia-check.yml`: repeatable Node 22 test, syntax,
   and JSON validation on the review branch and future PRs to main.

## Explicitly unchanged

- Access code and gate hash.
- Encrypted plan text.
- Sofia's trial data and any browser/local-storage data.
- Food plan, nutrient values, recipe rules, medical claims, and clinical
  evidence.
- Netlify project settings and production deploy.

## Verification boundary

The repository's test suite is run by the new GitHub Actions workflow.
This review does not claim a fresh authenticated browser session on
Sofia's phone. The live interaction checks previously recorded by the
project owner remain the latest live-device evidence. No production deploy
was started by this review.
