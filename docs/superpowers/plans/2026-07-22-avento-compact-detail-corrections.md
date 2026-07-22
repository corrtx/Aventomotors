# Avento Compact Detail Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Avento banner compact and full-width, restore the intended logo, and fit the primary vehicle-detail actions into a desktop viewport.

**Architecture:** Keep carousel timing and card image selection in `AventoSite.tsx`; simplify the detail-page top layout in `CarDetailPage.tsx` and image navigation in `CarGallery.tsx`. Use CSS for the constrained desktop composition, full-height photo-hit zones, icon-only controls, and smooth anchor scrolling.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner.

## Global Constraints

- Buttons never contain vehicle photos or vehicle names; forms do.
- All action buttons must fit beside the detail image on standard desktop screens.
- Card photo zones span the full image height while visible indicators remain thin at the bottom.
- Hero auto-transition restarts a four-second delay after manual navigation.

---

### Task 1: Banner, logo, and card photo hit zones

**Files:** Modify `app/components/AventoSite.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`.

- [ ] Add rendered/source tests for the compact hero class, icon-only arrow content, resettable `scheduleSlide` logic, restored wordmark nodes, and `card-photo-zone` controls.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs`; expect the new assertions to fail.
- [ ] Replace the fixed interval with an effect that schedules one 4000 ms timeout and resets it whenever `activeSlide` changes; manual controls call a shared slide setter. Restore the clipped A mark and custom crossbar-free Avento wordmark. Make the hero width full relative to the viewport but cap its desktop height. Render photo hit-zone buttons as full-height absolute columns and draw the small indicators separately along the photo bottom.
- [ ] Run the rendered test again; expect pass. Commit `feat: compact Avento hero and photo navigation`.

### Task 2: Compact two-column vehicle detail

**Files:** Modify `app/components/CarDetailPage.tsx`, `app/components/CarGallery.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`.

- [ ] Add failing assertions for `detail-top-layout`, normal `detail-actions` buttons, below-top `detail-specs`, icon-only gallery arrows, and backdrop click handling.
- [ ] Run the rendered test; expect the structure assertions to fail.
- [ ] Render one left gallery with in-place arrow controls, a right offer column with ordinary buttons, and specifications below. Keep the modal vehicle identity only after a button click. Remove the rounded background from the home back link. Preserve viewer outside-click close.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs tests/catalog.test.ts && eslint . --ignore-pattern dist --ignore-pattern .next`; expect no failures or lint errors. Commit `feat: compact Avento vehicle detail layout`.

## Review

- Tasks 1 and 2 cover every approved correction: full-width shorter banner, logo, icon arrows, resettable four-second transition, vertical photo zones, smooth scrolling, plain action buttons, form-only identity, outside-click close, and compact desktop detail layout.
