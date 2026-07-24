# Buyout and Navigation Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the vehicle buyout page, navigation, filter inputs, and rating tooltip to match the supplied assets and interaction requirements.

**Architecture:** Keep page content in the current React components and use static assets under `public/`. CSS owns layout and interaction presentation; existing rendered HTML tests validate the public page structure.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner.

## Global Constraints

- Ukrainian copy only.
- Do not generate vehicle imagery.
- Use locally stored stable assets for Genesis and the supplied process images.
- Keep existing catalogue card and detail data flows unchanged.

---

### Task 1: Buyout process assets and layout

**Files:**
- Create: `public/buyout/step-keys.png`, `public/buyout/step-inspection.png`, `public/buyout/step-price.png`, `public/buyout/step-contract.png`
- Modify: `app/components/SellCarPage.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`

- [ ] Add failing assertions that the buyout HTML renders the four local process images and blue document state hooks.
- [ ] Run `pnpm test` and verify the assertions fail before the markup exists.
- [ ] Render each supplied image above its matching step and adjust the grid to remain proportionate at desktop and mobile widths.
- [ ] Remove the documents-table blue top rule and make required plus signs blue.
- [ ] Run `pnpm test` and `pnpm lint`.

### Task 2: Shared navigation and input behavior

**Files:**
- Modify: `app/components/AventoSite.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`

- [ ] Add failing assertions for a local Genesis mark, the sticky navigation class, and the in-field mileage placeholders.
- [ ] Run `pnpm test` and verify the expected new assertions fail.
- [ ] Replace the Genesis external image with a local SVG, make the two navigation bars sticky, and move `Мін.` / `Макс.` into the input placeholders.
- [ ] Keep units aligned and ensure values replace placeholders normally.
- [ ] Run `pnpm test` and `pnpm lint`.

### Task 3: Detail and home polish

**Files:**
- Modify: `app/globals.css`, `tests/rendered-html.test.mjs`

- [ ] Add a failing source assertion that the detail tooltip has no rotation.
- [ ] Run `pnpm test` and verify failure.
- [ ] Remove detail-tooltip rotation and ensure hero controls/dots are positioned inside the hero viewport.
- [ ] Run `pnpm test`, `pnpm lint`, and `pnpm run build`.
- [ ] Commit the complete change with a focused message.
