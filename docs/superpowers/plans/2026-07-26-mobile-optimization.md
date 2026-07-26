# Avento Motors Mobile Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать главную, каталог, карточки, формы, подробную страницу и футер Avento Motors удобными на телефонах шириной до 768 px без изменения десктопной версии.

**Architecture:** Существующие React-компоненты остаются общими для всех устройств. Мобильное поведение фотографий и аккордеона фильтров добавляется небольшими управляемыми состояниями, а вся перестройка размеров и сеток изолируется в мобильном медиазапросе.

**Tech Stack:** React 19, TypeScript, Vinext/Next App Router, CSS, Node test runner.

## Global Constraints

- Мобильная версия действует на ширине до 768 px; контрольные размеры — 390×844 и 768×1024.
- Десктоп выше 768 px сохраняет существующую структуру.
- Не добавлять библиотеки и тяжёлые изображения.
- Баннер и автомобильные галереи используют контейнер постоянного размера.
- Интерактивные элементы имеют область нажатия не меньше 40 px.
- Учитывать `prefers-reduced-motion`.

---

### Task 1: Зафиксировать мобильные требования тестами

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: серверный HTML из `dist/server/index.js`, исходники `app/components/AventoSite.tsx`, `app/components/CarGallery.tsx`, `app/globals.css`.
- Produces: регрессионные проверки мобильных стрелок, доступности, аккордеона фильтров и брейкпоинта 768 px.

- [ ] **Step 1: Добавить падающие проверки**

Добавить в тест `ships the finished visual system without starter artifacts` чтение `CarGallery.tsx` и следующие утверждения:

```js
assert.match(site, /className="card-photo-arrow card-photo-arrow-prev"/);
assert.match(site, /className="card-photo-arrow card-photo-arrow-next"/);
assert.match(site, /aria-label="Попереднє фото"/);
assert.match(site, /aria-label="Наступне фото"/);
assert.match(site, /openFilter/);
assert.match(site, /onOpenChange/);
assert.match(css, /@media \(max-width:\s*768px\)/);
assert.match(css, /\.site-header nav a:last-child\s*\{[^}]*display:\s*inline-flex/s);
assert.match(css, /\.hero-carousel\s*\{[^}]*height:\s*clamp\(/s);
assert.match(css, /\.card-photo-zones\s*\{[^}]*display:\s*none/s);
assert.match(css, /\.request-modal\s*\{[^}]*max-height:/s);
assert.match(css, /\.detail-gallery-single\s*\{[^}]*height:\s*clamp\(/s);
assert.match(gallery, /aria-label="Попереднє фото"/);
assert.match(gallery, /aria-label="Наступне фото"/);
```

- [ ] **Step 2: Запустить тест и подтвердить ожидаемое падение**

Run:

```bash
pnpm run build
node --test tests/rendered-html.test.mjs
```

Expected: FAIL на отсутствии `card-photo-arrow` и медиазапроса `max-width: 768px`.

- [ ] **Step 3: Commit тестов**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define mobile layout requirements"
```

---

### Task 2: Добавить мобильные стрелки карточек

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `selectPhoto(index)` и `car.gallery`.
- Produces: кнопки `.card-photo-arrow-prev` и `.card-photo-arrow-next`, меняющие `activePhoto` без перехода на подробную страницу.

- [ ] **Step 1: Добавить минимальную логику переключения**

В `CarCard` добавить:

```tsx
const movePhoto = (offset: number) => {
  prefetchGallery();
  setActivePhoto((current) => cycleIndex(current, car.gallery.length, offset));
};
```

После `.card-photo-zones` добавить:

```tsx
{car.gallery.length > 1 && (
  <>
    <button
      type="button"
      className="card-photo-arrow card-photo-arrow-prev"
      onClick={() => movePhoto(-1)}
      aria-label="Попереднє фото"
    ><span aria-hidden="true">‹</span></button>
    <button
      type="button"
      className="card-photo-arrow card-photo-arrow-next"
      onClick={() => movePhoto(1)}
      aria-label="Наступне фото"
    ><span aria-hidden="true">›</span></button>
  </>
)}
```

- [ ] **Step 2: Добавить базовые стили с десктопным скрытием**

```css
.card-photo-arrow {
  display: none;
}
```

В мобильном медиазапросе показывать кнопки, скрывать `.card-photo-zones`, сохранять нижние сегменты:

```css
.card-photo-zones { display: none; }
.card-photo-arrow {
  position: absolute;
  top: 50%;
  z-index: 3;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 0.28);
  border-radius: 50%;
  background: rgb(7 9 12 / 0.58);
  color: #fff;
  transform: translateY(-50%);
}
.card-photo-arrow-prev { left: 18px; }
.card-photo-arrow-next { right: 18px; }
```

- [ ] **Step 3: Запустить тест**

```bash
pnpm run build
node --test tests/rendered-html.test.mjs
```

Expected: проверки стрелок PASS; оставшиеся мобильные CSS-проверки ещё FAIL.

- [ ] **Step 4: Commit**

```bash
git add app/components/AventoSite.tsx app/globals.css
git commit -m "feat: add mobile car photo controls"
```

---

### Task 3: Сделать фильтры управляемым мобильным аккордеоном

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: идентификатор фильтра `"brands" | "price" | "year" | "mileage"`.
- Produces: `openFilter` в `CarsPage`, а компоненты фильтра получают `open: boolean` и `onOpenChange(open: boolean): void`.

- [ ] **Step 1: Перевести фильтры на контролируемое раскрытие**

Для `RangeFilter`, `YearFilter` и `BrandFilter` заменить локальное состояние `open` на параметры:

```tsx
open: boolean;
onOpenChange: (open: boolean) => void;
```

Кнопки используют:

```tsx
onClick={() => onOpenChange(!open)}
```

В `CarsPage` добавить:

```tsx
type FilterId = "brands" | "price" | "year" | "mileage";
const [openFilter, setOpenFilter] = useState<FilterId | null>(null);
const controlFilter = (id: FilterId) => ({
  open: openFilter === id,
  onOpenChange: (open: boolean) => setOpenFilter(open ? id : null),
});
```

Передать `...controlFilter("brands")`, `...controlFilter("price")`, `...controlFilter("year")`, `...controlFilter("mileage")`.

- [ ] **Step 2: Перестроить мобильные выпадающие блоки в поток**

В `@media (max-width: 768px)`:

```css
.filters {
  grid-template-columns: 1fr;
}
.range-dropdown {
  position: relative;
  top: auto;
  right: auto;
  left: auto;
  z-index: auto;
  width: 100%;
  box-shadow: none;
}
.range-filter.is-open .range-dropdown {
  margin-top: 6px;
}
```

Это заставляет следующий фильтр сдвигаться вниз плавно вместе с изменением `max-height`.

- [ ] **Step 3: Запустить тест**

```bash
pnpm run build
node --test tests/rendered-html.test.mjs
```

Expected: проверки `openFilter`, `onOpenChange` и структуры фильтров PASS.

- [ ] **Step 4: Commit**

```bash
git add app/components/AventoSite.tsx app/globals.css
git commit -m "feat: make mobile filters an accordion"
```

---

### Task 4: Выполнить мобильную компоновку всех страниц

**Files:**
- Modify: `app/globals.css`
- Modify: `app/components/CarGallery.tsx` только если текущие подписи стрелок не совпадают с тестом.
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: существующие классы шапки, баннера, карточки, модального окна, каталога, галереи и футера.
- Produces: изолированный медиазапрос `@media (max-width: 768px)`.

- [ ] **Step 1: Шапка и баннер**

Добавить мобильные правила:

```css
@media (max-width: 768px) {
  .site-header { min-height: 68px; }
  .catalog-subnav { top: 68px; }
  .site-header nav { gap: 12px; font-size: 11px; }
  .site-header nav a:last-child { display: inline-flex; }
  .hero-carousel {
    height: clamp(300px, 64vw, 420px);
    min-height: 300px;
    margin-bottom: 42px;
  }
  .hero-slide img { object-position: center; }
}
```

- [ ] **Step 2: Компактные карточки и цены**

В том же медиазапросе:

```css
.car-list { gap: 14px; }
.car-card { grid-template-columns: 1fr; min-height: 0; border-radius: 16px; }
.photo-frame { margin: 7px; width: calc(100% - 14px); border-radius: 12px; }
.car-details, .car-price, .car-actions { padding: 16px; }
.car-actions { flex-direction: row; flex-wrap: wrap; gap: 8px; }
.car-actions button { min-height: 42px; flex: 1 1 calc(33.333% - 8px); }
.car-actions > span { flex-basis: 100%; }
.car-price strong { font-family: inherit; font-size: 22px; }
.car-old-price { font-family: inherit; font-size: 29px; }
```

Не менять глобальное соотношение старой и актуальной цены: старая остаётся крупнее.

- [ ] **Step 3: Компактные марки и формы**

```css
.brand-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
.brand-grid .brand-chip {
  min-height: 72px;
  padding: 10px;
  align-items: center;
}
.brand-grid .brand-mark { width: 34px; height: 26px; }
.modal-backdrop { padding: 18px; }
.request-modal {
  width: min(420px, 100%);
  max-height: calc(100dvh - 36px);
  padding: 24px 18px 18px;
  border-radius: 18px;
}
.request-modal h2 { padding-right: 42px; font-size: 28px; }
```

- [ ] **Step 4: Подробная страница и галерея**

```css
.car-detail { padding-block: 24px 72px; }
.detail-heading { padding-block: 28px 20px; }
.detail-heading h1 { font-size: clamp(38px, 12vw, 58px); }
.detail-top-layout { grid-template-columns: 1fr; height: auto; }
.detail-gallery-single {
  height: clamp(260px, 72vw, 380px);
  min-height: clamp(260px, 72vw, 380px);
}
.detail-gallery-single .gallery-tile img { object-fit: contain; }
.detail-offer {
  height: auto;
  min-height: 0;
  max-height: none;
  padding: 24px 18px;
}
.detail-specs { margin-top: 18px; padding: 24px 18px; }
.detail-request-grid { grid-template-columns: 1fr; }
```

- [ ] **Step 5: Футер**

```css
footer { gap: 12px; padding-block: 46px 32px; text-align: center; }
.footer-contacts {
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 10px;
}
.footer-legal {
  width: 100%;
  align-items: center;
  gap: 4px;
}
.footer-legal a {
  width: fit-content;
  max-width: 100%;
  text-align: center;
}
```

- [ ] **Step 6: Запустить тесты**

```bash
pnpm run build
node --test tests/rendered-html.test.mjs tests/catalog.test.ts
```

Expected: PASS, 0 failures.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/components/CarGallery.tsx tests/rendered-html.test.mjs
git commit -m "feat: optimize Avento Motors for mobile"
```

---

### Task 5: Визуальная проверка и публикация

**Files:**
- Modify only if verification exposes a defect: `app/globals.css`, `app/components/AventoSite.tsx`, `app/components/CarGallery.tsx`

**Interfaces:**
- Consumes: production build and all responsive pages.
- Produces: проверенный production deployment.

- [ ] **Step 1: Запустить production preview**

```bash
pnpm run build
pnpm run start
```

- [ ] **Step 2: Проверить 390×844**

Проверить `/`, `/cars`, `/cars/opel-insignia-grand-sport`:

- баннер постоянной высоты;
- «Про нас» видно;
- карточки и формы не выходят за экран;
- стрелки меняют фотографии;
- следующий фильтр уезжает вниз при раскрытии;
- подробная галерея сохраняет размер;
- футер читается без горизонтальной прокрутки.

- [ ] **Step 3: Проверить 768×1024 и 1440×900**

На 768 px подтвердить мобильную компоновку. На 1440 px подтвердить отсутствие изменений десктопной структуры.

- [ ] **Step 4: Финальная автоматическая проверка**

```bash
pnpm run test
git diff --check
git status --short
```

Expected: тесты PASS, `git diff --check` без вывода, рабочее дерево содержит только намеренные изменения.

- [ ] **Step 5: Push и production deployment**

```bash
git push origin main
pnpm dlx vercel deploy --prod --yes
```

- [ ] **Step 6: Проверить production URL**

Проверить HTTP 200 для:

```text
https://avento-motors.vercel.app/
https://avento-motors.vercel.app/cars
https://avento-motors.vercel.app/cars/opel-insignia-grand-sport
```
