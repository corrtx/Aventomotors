# Catalog Filters and Detail Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Ukrainian car picker, navigation, rating explanation, detail layout, and Avento logo while preserving the approved minimal visual system.

**Architecture:** Extend the catalog filter model with numeric ranges, render those ranges through a reusable expandable control, and derive removable selected-filter chips from the same state. Keep card and detail interactions in their existing components, fixing navigation at the photo-zone layer and enforcing gallery dimensions with CSS.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner.

## Global Constraints

- Ukrainian interface copy only.
- Price fields use `грн` on the left; mileage fields use `км` on the left.
- `Від` and `До` sit above sharp-corner input frames.
- No slogans, availability badges, or decorative bubbles.
- Work directly on the current branch as previously approved.

---

### Task 1: Range filter behavior

**Files:**
- Modify: `lib/catalog.ts`
- Modify: `tests/catalog.test.ts`

**Interfaces:**
- Produces: `CarFilters.minPrice`, `maxPrice`, `minYear`, `maxYear`, `minMileage`, `maxMileage`.

- [ ] Write a failing catalog test for lower and upper price, year, and mileage bounds.
- [ ] Run `npm test -- tests/catalog.test.ts` and confirm the range test fails.
- [ ] Add the missing fields and boundary checks to `filterCars`.
- [ ] Re-run the catalog tests and confirm they pass.

### Task 2: Picker UI and clickable cards

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: expanded `CarFilters`.
- Produces: expandable `RangeFilter`, removable selected chips, 2010–2026 year selects, rating tooltip, and photo-zone navigation.

- [ ] Add failing source/render assertions for range controls, year endpoints, selected chips, tooltip copy, and photo navigation.
- [ ] Run the rendered HTML tests and confirm the new assertions fail.
- [ ] Add additional brand choices with text fallback marks.
- [ ] Implement expandable price and mileage ranges with `Від`/`До` labels and left-side `грн`/`км` units.
- [ ] Render all selected filters as sharp-corner removable chips, quoting brand names.
- [ ] Make the full photo hover zones navigate to the detail route on click.
- [ ] Add the 38-point rating tooltip and larger filter layout.
- [ ] Re-run rendered HTML and catalog tests.

### Task 3: Detail and logo layout

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/components/CarDetailPage.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: uncropped A symbol with cropped source wordmark, matched custom A letter, fixed gallery frame, raised detail content, and separated specs.

- [ ] Add failing assertions for the absent detail eyebrow and stable gallery/logo classes.
- [ ] Run rendered HTML tests and confirm failure.
- [ ] Remove the brand eyebrow from the detail heading.
- [ ] Fix gallery dimensions independently of image aspect ratio and add spacing around characteristics.
- [ ] Rework the logo crop so the symbol remains complete and mask only the crossbar in the same-size wordmark `A`.
- [ ] Run `npm test`, `npm run lint`, and `npm run build`.
- [ ] Visually inspect home, picker, and detail pages at desktop and mobile widths.
