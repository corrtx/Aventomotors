# Catalog Sales and Buyout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sale-ready car data, catalogue filtering/navigation improvements, a sale rail, and a complete Ukrainian vehicle-buyout page.

**Architecture:** Keep catalogue facts and filtering in `lib/catalog.ts`. Reuse the existing `Header`, `CarCard`, footer, and visual tokens for routes; add one thin `/sell` page backed by a focused client component for its local form state. Extend the current client-side catalogue component rather than introducing a second filter system.

**Tech Stack:** Next.js App Router, React client components, TypeScript, CSS, Node test runner, ESLint, vinext.

## Global Constraints

- Keep all user-facing copy Ukrainian.
- Do not add photo generation or third-party dependencies.
- Keep existing white Avento mark and current dark minimal visual system.
- Use sharp corners for filter sub-controls; do not introduce bubbles.
- The buyout form is local-only and must not persist submitted personal data.
- Preserve existing card/detail interactions and all current tests.

---

### Task 1: Extend catalogue facts and offer filtering

**Files:**
- Modify: `lib/catalog.ts:1-106`
- Modify: `tests/catalog.test.ts:1-64`

**Interfaces:**
- Produces `Car.topSpeed: number`, `Car.zeroToHundred: number`, `Car.isSpecialOffer: boolean`, `Car.discount?: number`.
- Produces `CarFilters.specialOffer?: boolean` consumed by `filterCars`.

- [ ] **Step 1: Write the failing catalogue tests**

```ts
test("filters only special offers", () => {
  assert.deepEqual(filterCars(cars, { specialOffer: true }).map((car) => car.id), ["bmw-x5", "porsche-911"]);
});

test("ships performance facts for every catalogue car", () => {
  for (const car of cars) {
    assert.ok(car.topSpeed > 0);
    assert.ok(car.zeroToHundred > 0);
  }
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/catalog.test.ts`

Expected: FAIL because `specialOffer`, `topSpeed`, and `zeroToHundred` are not defined.

- [ ] **Step 3: Write minimal implementation**

```ts
export type Car = {
  // existing fields
  topSpeed: number;
  zeroToHundred: number;
  isSpecialOffer: boolean;
  discount?: number;
};

export type CarFilters = {
  // existing fields
  specialOffer?: boolean;
};

if (filters.specialOffer && !car.isSpecialOffer) return false;
```

Give both existing cars realistic positive performance values, mark them as special offers, and supply a non-zero discount.

- [ ] **Step 4: Run focused test to verify it passes**

Run: `node --test tests/catalog.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/catalog.ts tests/catalog.test.ts
git commit -m "feat: add performance and special offer data"
```

### Task 2: Make filter criteria clearable and place value prefixes correctly

**Files:**
- Modify: `app/components/AventoSite.tsx:259-329,379-429`
- Modify: `app/globals.css:768-970`
- Modify: `tests/rendered-html.test.mjs:50-76,116-150`

**Interfaces:**
- `RangeFilter` renders the unit first, then `Мін.` or `Макс.`, then the numeric input.
- `BrandFilter` continues accepting `values?: string[]` and reports a new selected array through `onChange(values: string[])`.
- `CarsPage` renders selected filter chips as buttons that call their stored `remove` callback.

- [ ] **Step 1: Write failing source-level assertions**

```js
assert.match(site, /<span className="range-unit">\{unit\}<\/span><span className="range-bound">Мін\.<\/span>/);
assert.match(site, /onClick=\{filter\.remove\}/);
assert.match(css, /\.selected-filter-chip:hover/);
```

- [ ] **Step 2: Run the rendered HTML test to verify failure**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because the prefixes are in the wrong order and chip hover/clear behavior is incomplete.

- [ ] **Step 3: Implement the controls**

```tsx
<span className="range-input-shell">
  <span className="range-unit">{unit}</span>
  <span className="range-bound">Мін.</span>
  <input aria-label={`${title}, мінімум`} />
</span>
```

Keep the existing per-filter `remove` callbacks in `selectedFilters`; make the chip button visibly hover with the same blue line/color language used for selected brand buttons. Ensure text and chevrons retain `flex-shrink: 0` where necessary and the summary alone ellipsizes.

- [ ] **Step 4: Run focused validation**

Run: `node --test tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/AventoSite.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "fix: improve clearable catalogue filter controls"
```

### Task 3: Add second-level navigation and catalogue views

**Files:**
- Modify: `app/components/AventoSite.tsx:240-255,379-446`
- Modify: `app/cars/page.tsx:8-30`
- Modify: `app/globals.css:68-140`
- Modify: `tests/rendered-html.test.mjs:50-76`

**Interfaces:**
- `Header` renders a `catalog-subnav` immediately below `site-header`.
- `/cars?condition=used` and `/cars?specialOffer=true` initialize `CarsPage` filters.

- [ ] **Step 1: Write failing rendered route assertions**

```js
const carsResponse = await render("/cars?specialOffer=true");
const html = await carsResponse.text();
assert.match(html, /Усі авто/);
assert.match(html, /З пробігом/);
assert.match(html, /Спецпропозиції/);
assert.match(html, /Викуп авто/);
assert.match(html, /href="\/sell"/);
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because the sub-navigation and its sell route do not yet exist.

- [ ] **Step 3: Implement the sub-navigation and query parsing**

```tsx
<nav className="catalog-subnav" aria-label="Категорії автомобілів">
  <Link href="/cars">Усі авто</Link>
  <Link href="/cars?condition=used">З пробігом</Link>
  <Link href="/cars?specialOffer=true">Спецпропозиції</Link>
  <Link href="/sell">Викуп авто</Link>
</nav>
```

Interpret `condition=used` as the current pre-owned catalogue data and `specialOffer=true` as `initialSpecialOffer`. Style it as a thin full-width strip with small text and no rounded pills.

- [ ] **Step 4: Run focused validation**

Run: `node --test tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/AventoSite.tsx app/cars/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add catalogue category navigation"
```

### Task 4: Show performance facts and sale rail

**Files:**
- Modify: `app/components/AventoSite.tsx:103-158,379-435`
- Modify: `app/components/CarDetailPage.tsx:34-57`
- Modify: `app/globals.css:430-620,970-1050`
- Modify: `tests/rendered-html.test.mjs:50-100`

**Interfaces:**
- `CarCard` and `CarDetailPage` consume `car.topSpeed` and `car.zeroToHundred`.
- `SaleRail` consumes `cars.filter((car) => car.isSpecialOffer)` and renders `slice(0, 4)`.

- [ ] **Step 1: Write failing render assertions**

```js
assert.match(html, /Макс\. швидкість/);
assert.match(html, /0–100 км\/год/);
assert.match(html, /Розпродаж/);
assert.match(html, /Усі спецпропозиції/);
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because neither performance labels nor sale rail exist.

- [ ] **Step 3: Implement card/detail facts and the reusable sale rail**

```tsx
<div><dt>Макс. швидкість</dt><dd>{car.topSpeed} км/год</dd></div>
<div><dt>0–100 км/год</dt><dd>{car.zeroToHundred.toFixed(1)} с</dd></div>

const saleCars = cars.filter((car) => car.isSpecialOffer);
<section className="sale-rail">
  <h2>Розпродаж</h2>
  <div className="sale-grid">{saleCars.slice(0, 4).map((car) => <CarCard key={car.id} car={car} onAction={onAction} />)}</div>
  {saleCars.length > 4 && <Link href="/cars?specialOffer=true">Усі спецпропозиції</Link>}
</section>
```

Place the rail beneath the details on the car page and beneath the active filter state on the catalogue page. Use a compact four-column layout that falls back to existing responsive widths.

- [ ] **Step 4: Run focused validation**

Run: `node --test tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/AventoSite.tsx app/components/CarDetailPage.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add vehicle performance and sale rail"
```

### Task 5: Build the vehicle-buyout route

**Files:**
- Create: `app/sell/page.tsx`
- Create: `app/components/SellCarPage.tsx`
- Modify: `app/globals.css:after buyout-related styles`
- Modify: `tests/rendered-html.test.mjs:after choose-car test`

**Interfaces:**
- `SellCarPage()` is a client component with local submission state.
- `/sell` renders `SellCarPage` and site metadata in Ukrainian.

- [ ] **Step 1: Write a failing `/sell` route test**

```js
test("renders vehicle buyout page", async () => {
  const response = await render("/sell");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Оцінимо ваше авто за 20 хвилин/);
  assert.match(html, /Необхідні документи/);
  assert.match(html, /Авто на обліку/);
  assert.match(html, /Авто знято з обліку/);
  assert.match(html, /Як це працює/);
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL with a 404 response for `/sell`.

- [ ] **Step 3: Add route and client component**

```tsx
export default function SellPage() {
  return <SellCarPage />;
}
```

Build `SellCarPage` from `Header`, a native `<form>` with required `name` and `tel` inputs, a success state, a document matrix, and four process steps. Use exactly these Ukrainian document labels: `Паспорт транспортного засобу`, `Свідоцтво про реєстрацію автомобіля`, `Паспорт власника`, `Генеральна довіреність (за потреби)`, `Усі комплекти ключів`, `Талон технічного огляду`, `Документи сервісного обслуговування`. Use `+` for required documents and `Бажано` for optional rows.

- [ ] **Step 4: Add responsive, strict styles**

```css
.buyout-documents { border-top: 2px solid var(--blue); }
.buyout-document-row { display: grid; grid-template-columns: minmax(0, 1fr) 180px 180px; }
.buyout-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
```

At small widths, stack the form and process steps, keeping the two document states legible in horizontally scrollable table content rather than shrinking the text.

- [ ] **Step 5: Run focused validation**

Run: `node --test tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/sell/page.tsx app/components/SellCarPage.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add vehicle buyout page"
```

### Task 6: Validate the complete feature and publish

**Files:**
- Modify: only files identified by a failed validation command

- [ ] **Step 1: Run complete validation**

Run:

```bash
node node_modules/vinext/dist/cli.js build
node --test tests/rendered-html.test.mjs tests/catalog.test.ts
node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next
```

Expected: build succeeds; all tests pass; ESLint exits with code 0.

- [ ] **Step 2: Package and privately deploy the validated source**

Use the existing Sites project, push the exact branch head, save a version from the matching archive, then deploy privately and wait for a successful deployment status.

- [ ] **Step 3: Commit a validation repair only if a command in Step 1 failed**

```bash
git add lib/catalog.ts app/components/AventoSite.tsx app/components/CarDetailPage.tsx app/components/SellCarPage.tsx app/cars/page.tsx app/sell/page.tsx app/globals.css tests/catalog.test.ts tests/rendered-html.test.mjs
git commit -m "fix: resolve catalogue and buyout validation"
```
