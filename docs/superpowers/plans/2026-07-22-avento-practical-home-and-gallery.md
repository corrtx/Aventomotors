# Avento Motors Practical Home and Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Avento Motors easier to use on the first screen, remove decorative bubbles, improve request forms, and support the approved responsive photo-gallery states.

**Architecture:** Keep catalogue data in `lib/catalog.ts`; use the existing client components for modal interactions. Extract the gallery into a focused client component so thumbnail arrangement and full-screen photo browsing do not enlarge the detail page further. CSS remains in the existing global visual system and uses named layout classes for each gallery state.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Node test runner, ESLint, vinext.

## Global Constraints

- All visible interface copy remains Ukrainian.
- Do not add slogans, `У наявності`, `Каталог`, counters, badges, or pill-shaped decorative UI.
- Keep ratings blue.
- Use the user-supplied car photographs as-is; do not generate or edit vehicle photos.
- Brand rail cards stay white; hover slows the rail and does not alter their border or background.
- Use plain local `<img>` elements because vinext rendering already uses them reliably.
- Gallery rules: 2 photos are equal; 3–4 photos use one large left tile, one upper-right tile, then equal small tiles beneath; 5+ displays `+N` on tile four and opens the full viewer.

---

### Task 1: Define rendered-output regressions

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/catalog.test.ts`

**Interfaces:**
- Consumes: existing `render(path)` test helper and `cars` catalogue records.
- Produces: tests that constrain the new request-form markup, bubble removal, centered brands link, cropped logo wrapper, and gallery states.

- [ ] **Step 1: Add failing HTML assertions for the request form and cleaned catalogue page**

Add to the existing `renders a detailed car page` test:

```js
assert.match(html, /<option value="6">6 місяців<\/option>/);
assert.match(html, /<option value="12">12 місяців<\/option>/);
assert.match(html, /<option value="24">24 місяців<\/option>/);
assert.match(html, /Ваш автомобіль/);
```

Add to the home-page test:

```js
assert.match(html, /class="all-brands-row"/);
assert.match(html, /class="site-logo-mark"/);
assert.doesNotMatch(html, /results-heading[^>]*>.*<span>2<\/span>/s);
```

- [ ] **Step 2: Add a gallery-state assertion from local data**

Add a helper test using a three-image clone of `cars[0]` and assert that `getGalleryLayout()` returns `"three"`; repeat for four and five images returning `"four"` and `"many"`.

```ts
assert.equal(getGalleryLayout([...cars[0].gallery, "/cars/third.png"]), "three");
assert.equal(getGalleryLayout([...cars[0].gallery, "/cars/third.png", "/cars/fourth.png"]), "four");
assert.equal(getGalleryLayout([...cars[0].gallery, "/cars/third.png", "/cars/fourth.png", "/cars/fifth.png"]), "many");
```

- [ ] **Step 3: Run targeted tests and verify RED**

Run:

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/catalog.test.ts
```

Expected: FAIL because `getGalleryLayout` is not exported; rendered-output checks fail after the next build until the UI work exists.

- [ ] **Step 4: Commit the red tests**

```bash
git add tests/catalog.test.ts tests/rendered-html.test.mjs
git commit -m "test: define practical Avento interface behavior"
```

### Task 2: Add gallery layout selection and a full photo viewer

**Files:**
- Create: `app/components/CarGallery.tsx`
- Modify: `lib/catalog.ts`
- Modify: `app/components/CarDetailPage.tsx`
- Modify: `app/globals.css`
- Test: `tests/catalog.test.ts`

**Interfaces:**
- Consumes: `Car.gallery: readonly string[]`.
- Produces: `getGalleryLayout(images: readonly string[]): "two" | "three" | "four" | "many"` and `<CarGallery car={car} />`.

- [ ] **Step 1: Export the deterministic layout helper**

Add below `getCarById` in `lib/catalog.ts`:

```ts
export type GalleryLayout = "two" | "three" | "four" | "many";

export function getGalleryLayout(images: readonly string[]): GalleryLayout {
  if (images.length <= 2) return "two";
  if (images.length === 3) return "three";
  if (images.length === 4) return "four";
  return "many";
}
```

- [ ] **Step 2: Implement `CarGallery` with the four visible layout states**

Create `app/components/CarGallery.tsx`. It holds `activeImage: number | null`, assigns `detail-gallery detail-gallery-${getGalleryLayout(car.gallery)}`, renders at most four buttons/figures, and renders a viewer dialog when `activeImage !== null`.

```tsx
const shownImages = car.gallery.slice(0, 4);
const remaining = car.gallery.length - 4;

{shownImages.map((image, index) => (
  <button className={`gallery-tile gallery-tile-${index + 1}`} key={image} onClick={() => setActiveImage(index)}>
    <img src={image} alt={`${car.brand} ${car.model}, фото ${index + 1}`} />
    {index === 3 && remaining > 0 && <span className="gallery-more">+{remaining}</span>}
  </button>
))}
```

The dialog must use `role="dialog"`, `aria-modal="true"`, a labelled close button, Escape handling, and previous/next buttons that wrap inside `car.gallery`.

- [ ] **Step 3: Replace inline gallery markup on the detail page**

Replace the `<section className="detail-gallery">...</section>` in `app/components/CarDetailPage.tsx` with:

```tsx
<CarGallery car={car} />
```

Import `CarGallery` from `./CarGallery`.

- [ ] **Step 4: Add layout CSS**

Replace the existing two-column gallery rule with explicit grids:

```css
.detail-gallery-two { grid-template-columns: 1fr 1fr; }
.detail-gallery-three,
.detail-gallery-four,
.detail-gallery-many { grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.9fr); grid-template-rows: 1fr 0.5fr; }
.gallery-tile-1 { grid-row: 1 / -1; }
.gallery-tile-2 { grid-column: 2; grid-row: 1; }
.gallery-tile-3 { grid-column: 2; grid-row: 2; }
.gallery-tile-4 { grid-column: 2; grid-row: 2; }
.detail-gallery-four .gallery-tile-3,
.detail-gallery-many .gallery-tile-3 { grid-column: 2; grid-row: 2; width: calc(50% - 6px); }
.detail-gallery-four .gallery-tile-4,
.detail-gallery-many .gallery-tile-4 { grid-column: 2; grid-row: 2; width: calc(50% - 6px); justify-self: end; }
```

Use a second nested `.gallery-lower-row` wrapper instead if the two lower items cannot be made equal cleanly with the existing grid. On screens under `640px`, use one column in source order.

- [ ] **Step 5: Run layout-helper tests and verify GREEN**

Run:

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/catalog.test.ts
```

Expected: all catalogue tests pass.

- [ ] **Step 6: Commit gallery functionality**

```bash
git add lib/catalog.ts app/components/CarGallery.tsx app/components/CarDetailPage.tsx app/globals.css tests/catalog.test.ts
git commit -m "feat: add responsive Avento vehicle gallery"
```

### Task 3: Improve request forms and remove decorative UI

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `RequestModal` action union `"credit" | "exchange" | "reserve"`.
- Produces: correct credit terms, exchange-description field, and no numerical result bubble.

- [ ] **Step 1: Extend the credit term select and exchange form**

Replace the credit options with:

```tsx
<select name="term" defaultValue="60">
  <option value="6">6 місяців</option>
  <option value="12">12 місяців</option>
  <option value="24">24 місяців</option>
  <option value="36">36 місяців</option>
  <option value="48">48 місяців</option>
  <option value="60">60 місяців</option>
</select>
```

Immediately after the credit conditional add:

```tsx
{action === "exchange" && (
  <label>
    Ваш автомобіль
    <input name="trade-in-car" placeholder="Марка, модель, рік" required />
  </label>
)}
```

- [ ] **Step 2: Remove all remaining bubbles**

In `CarsPage`, replace:

```tsx
<div className="results-heading"><h2>Автомобілі</h2><span>{filteredCars.length}</span></div>
```

with:

```tsx
<div className="results-heading"><h2>Автомобілі</h2></div>
```

Remove `.results-heading span` CSS. Replace rounded action buttons with a shared low-radius rectangular treatment only where the CSS currently uses `border-radius: 999px`; preserve necessary circular close controls and the non-decorative star rating.

- [ ] **Step 3: Run the full rendered HTML checks**

Run:

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH CI=true pnpm run build
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/rendered-html.test.mjs
```

Expected: all rendered-page checks pass, including the new terms and exchange field.

- [ ] **Step 4: Commit request and bubble changes**

```bash
git add app/components/AventoSite.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: refine Avento requests and interface"
```

### Task 4: Rework the homepage header, rail, link, and footer

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: current local asset `/avento-logo.png` and existing brand rail structure.
- Produces: a clipped `.site-logo-mark`, stable white `.brand-chip`, centered all-brands link, centered footer, and a compact practical hero.

- [ ] **Step 1: Use a clipped mark container in the header**

Replace the current header logo content with:

```tsx
<Link className="site-logo" href="/" aria-label="Avento Motors — головна">
  <span className="site-logo-mark" aria-hidden="true"><img src="/avento-logo.png" alt="" /></span>
  <span>Avento Motors</span>
</Link>
```

Use `.site-logo-mark { width: 54px; height: 48px; overflow: hidden; }` and an oversized, vertically translated image so the A symbol is visible while the lower original wordmark is clipped. Increase the mark size without adding a second image asset.

- [ ] **Step 2: Make the hero intentionally compact and practical**

Keep only the existing heading and two filter controls. Set desktop hero padding to place the title/form slightly above center, keep the first screen at `calc(100svh - header-height)`, and do not add explanatory cards or summary pills.

- [ ] **Step 3: Change rail and footer alignment**

Use:

```css
.brand-reel:hover .brand-track,
.brand-reel:focus-within .brand-track { animation-duration: 80s; }
.brand-chip:hover { border-color: #e5e7eb; background: #fff; color: #16181d; }
.all-brands-row { justify-content: center; }
footer { align-items: center; text-align: center; }
```

Do not use `animation-play-state: paused` on hover.

- [ ] **Step 4: Run visual-system and rendered-page tests**

Run:

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH CI=true pnpm test
```

Expected: build succeeds; all Node tests pass.

- [ ] **Step 5: Commit homepage polish**

```bash
git add app/components/AventoSite.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: polish Avento home and brand rail"
```

### Task 5: Browser verification and publication

**Files:**
- Modify: no source files unless visual verification finds a defect.

**Interfaces:**
- Consumes: successful production build and existing `.openai/hosting.json` project identifier.
- Produces: a verified private deployment of the exact validated commit.

- [ ] **Step 1: Run lint on the final tree**

Run:

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH CI=true pnpm run lint
```

Expected: exit code 0.

- [ ] **Step 2: Verify desktop and mobile in a browser**

At 1440px and 390px widths, verify: first viewport has no clipped next section; rail slows without recolouring; all-brands link is centered; footer is centered; credit and exchange forms show their new fields; 2-image detail gallery has equal tiles. Use a temporary five-image record only in a test/fixture to inspect the `+1` overlay and viewer controls.

- [ ] **Step 3: Commit any browser-found correction and rerun tests**

If CSS or markup changes, run `CI=true pnpm test` and `CI=true pnpm run lint` again before committing. If nothing changes, do not create an empty commit.

- [ ] **Step 4: Publish the validated commit privately**

Use the existing Sites project ID from `.openai/hosting.json`: obtain a short-lived write credential, push the current main commit, package with `scripts/package-site.sh`, save a version, deploy privately, and poll until status is `succeeded`.
