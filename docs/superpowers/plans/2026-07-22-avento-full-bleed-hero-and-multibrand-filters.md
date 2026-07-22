# Avento Full-Bleed Hero and Multi-Brand Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero slideshow assets and make the picker support multiple selected brands.

**Architecture:** Local hero assets live under `public/hero/`; `AventoSite.tsx` owns hero and picker selection state. `lib/catalog.ts` accepts a `brands` array in filtering. CSS controls full-bleed hero geometry and compact picker spacing.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node tests.

## Global Constraints

- Use only the three user-provided hero images; never use `/cars/bmw-x5-front.png` as a hero slide.
- Hero spans viewport width with square corners and the prior taller height.
- Multiple selected brands match with OR semantics.

---

### Task 1: Hero assets and full-bleed call to action

**Files:** Create `public/hero/avento-audi-night.png`, `public/hero/avento-range-rover-sunset.png`; modify `app/components/AventoSite.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`.

- [ ] Add failing source assertions for the two new hero paths, `hero-more-link`, and absence of `/cars/bmw-x5-front.png` inside `heroSlides`.
- [ ] Run `vinext build && node --test tests/rendered-html.test.mjs`; expect failure.
- [ ] Copy both supplied images, use them in `heroSlides`, change the hero wrapper to full viewport width and square corners, restore its former taller height, and render a centred `/cars` `Дивитися більше` link above the lower edge.
- [ ] Re-run the rendered test; expect pass. Commit `feat: update Avento full-bleed hero`.

### Task 2: Multi-brand picker and above-fold results

**Files:** Modify `lib/catalog.ts`, `app/components/AventoSite.tsx`, `app/globals.css`, `tests/catalog.test.ts`, `tests/rendered-html.test.mjs`.

- [ ] Add a failing test that filters an array by `{ brands: ["Kia", "Lexus"] }` and returns both brands.
- [ ] Run `node --test tests/catalog.test.ts`; expect failure.
- [ ] Add `brands?: string[]` to `CarFilters`; apply OR matching before the other filters. Change picker state to an array and toggle chips independently. Raise the title/filter block and reduce its margins so cards begin in the first desktop viewport.
- [ ] Run build, both test files, and lint; expect no failures. Commit `feat: add Avento multi-brand picker`.
