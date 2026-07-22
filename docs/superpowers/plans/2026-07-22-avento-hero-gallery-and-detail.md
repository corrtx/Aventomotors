# Avento Hero, Gallery, and Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved Avento visual into a usable home carousel, interactive vehicle imagery, and clearer vehicle request panels.

**Architecture:** Catalogue remains in `lib/catalog.ts`; pure helpers control carousel and photo indexes. `AventoSite.tsx` owns the home carousel and card state, `CarGallery.tsx` owns the full viewer, and `CarDetailPage.tsx` owns the vehicle-page request layout. Styles remain in `app/globals.css`.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, Node test runner.

## Global Constraints

- All new UI copy is Ukrainian; no availability labels, count bubbles, or invented slogans.
- Copy the supplied Ukrainian BMW image into `public/hero/`; generate and download no imagery.
- Photo hover never enlarges an image; preserve current two-photo and multi-photo gallery rules.
- Keep `Ціна від` and reduced-motion support.

---

### Task 1: Navigation helpers and supplied visual asset

**Files:** Create `public/hero/avento-bmw-night.png`; modify `lib/catalog.ts`, `tests/catalog.test.ts`.

**Interfaces:** Export `cycleIndex(current: number, length: number, offset: number): number` and `selectPhotoIndex(index: number, length: number): number`.

- [ ] Write failing tests for `cycleIndex(0, 2, -1) === 1`, `cycleIndex(1, 2, 1) === 0`, `selectPhotoIndex(3, 2) === 1`, and `selectPhotoIndex(-1, 2) === 0`.
- [ ] Run `node --test tests/catalog.test.ts`; expect a failure because helpers do not exist.
- [ ] Add the helpers, copy `/var/folders/3q/6lrtczld0y31y1mzhmz_12kh0000gp/T/codex-clipboard-0f3eb74d-4b20-4635-a17b-f0f00a564017.png` to the exact hero path, then rerun the test; expect all catalogue tests to pass.
- [ ] Commit `feat: add Avento visual navigation helpers`.

### Task 2: Home visual, identity, rail, and about anchor

**Files:** Modify `app/components/AventoSite.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`.

**Interfaces:** Consume `cycleIndex`; render `.hero-carousel`, `.hero-slide`, `.hero-arrow`, `.site-logo-a-shape`, and an `#about` target.

- [ ] Write rendered/source assertions for `hero-carousel`, the local hero image, left/right labels, expanded about copy, `site-logo-a-shape`, smooth scrolling, and the existing rail hover selector.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs`; expect a failure because carousel and new logo markup are absent.
- [ ] Replace the quick-search hero with a two-state, 4000 ms carousel using the local visual and manually controlled arrow buttons. Respect reduced motion. Keep copy inside the supplied visual rather than adding new overlay copy.
- [ ] Replace clipped logo styling with the complete mark plus a DOM-built crossbar-free A shape for `AVENTO`, and a lighter spaced `MOTORS`. Add smooth anchor scrolling. Expand the about section with selection, inspection, documents, financing, trade-in, reservation, and support information. Change rail hover only by animation duration.
- [ ] Re-run the build and rendered test; expect success. Commit `feat: add Avento home visual and identity`.

### Task 3: Card photo segments and action-form identity

**Files:** Modify `app/components/AventoSite.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`.

**Interfaces:** Consume `selectPhotoIndex`; render `.card-photo-segments`, `.card-photo-segment`, and `.request-car-identity`.

- [ ] Write assertions for these classes, exact text `Безкоштовний резерв до 24 годин`, and the absence of image hover scaling.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs`; expect a failure because the segment controls are absent.
- [ ] Give `CarCard` active-photo state. Render one transparent bottom segment per gallery image; hover, focus, and click select that image and blue only the active segment. The name and visible photo retain their detail links. Render a current-car thumbnail/name below each modal action heading.
- [ ] Re-run the build and rendered test; expect success. Commit `feat: add vehicle photo segments and request identity`.

### Task 4: Detail-page request panels and non-scaling gallery

**Files:** Modify `app/components/CarDetailPage.tsx`, `app/components/CarGallery.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`.

**Interfaces:** Render `.detail-request-grid`, `.detail-request-panel`, and `.detail-request-car`.

- [ ] Write assertions for the three request-panel classes, their car identity rows, the reservation line, and absence of a gallery image scale transform.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs`; expect a failure because the panel structure is absent.
- [ ] Replace vertical action buttons with three individual low-radius request panels. Every panel contains its title then the current vehicle thumbnail and name; credit/exchange/reserve open existing modal forms. Reserve repeats the exact 24-hour text. Keep specs and price in their own panel, and delete gallery hover scaling only.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs tests/catalog.test.ts && eslint . --ignore-pattern dist --ignore-pattern .next`; expect build success, passing tests, and no lint errors. Commit `feat: redesign Avento vehicle detail requests`.

## Review

- Spec coverage: Tasks 1–4 cover the asset, carousel, identity, rail, smooth About navigation, expanded About copy, card segments, reservation copy, forms, detail structure, and gallery behaviour.
- No placeholders or ambiguous names remain; all helper and CSS interface names are defined above.
