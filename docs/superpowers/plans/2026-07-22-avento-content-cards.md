# Avento Motors Content and Car Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Обновить главную Avento Motors, добавить пользовательские фотографии, официальные логотипы марок и подробные страницы двух автомобилей, затем опубликовать новую версию существующего сайта.

**Architecture:** Данные автомобилей остаются в `lib/catalog.ts` и получают локальные пути изображений. Существующий клиентский `AventoSite` отвечает за главную, список, фильтры и формы, а новая серверная динамическая страница выбирает автомобиль по `id` и передаёт его в отдельный клиентский компонент подробной страницы. Все изображения хранятся локально в `public`, поэтому сайт не зависит от внешних CDN во время работы.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Node test runner, Vinext, Sites.

## Global Constraints

- Весь пользовательский интерфейс — на украинском языке.
- Не использовать слоганы, рекламные подзаголовки, слово «Каталог» и надпись «У наявності».
- Рейтинг остаётся синим.
- Использовать четыре предоставленных изображения автомобилей без генерации и редактирования.
- В ленте марок использовать локальные логотипы на белых карточках.
- Сохранить кредит, обмен, бесплатный резерв на 24 часа и существующие фильтры.
- Автоматическая лента движется вправо и останавливается при наведении или фокусе.

---

### Task 1: Зафиксировать новое поведение тестами

**Files:**
- Modify: `tests/catalog.test.ts`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `lib/catalog.ts`

**Interfaces:**
- Produces: `getCarById(id: string): Car | undefined`.
- Produces: поля `coverImage: string` и `gallery: readonly string[]` в `Car`.

- [ ] **Step 1: Написать падающий тест данных автомобиля**

Добавить в `tests/catalog.test.ts`:

```ts
import { cars, filterCars, getCarById } from "../lib/catalog.ts";

test("returns a car with local card and gallery images", () => {
  const car = getCarById("porsche-911");
  assert.equal(car?.coverImage, "/cars/porsche-911-front.png");
  assert.deepEqual(car?.gallery, [
    "/cars/porsche-911-front.png",
    "/cars/porsche-911-rear.png",
  ]);
});

test("returns undefined for an unknown car", () => {
  assert.equal(getCarById("missing-car"), undefined);
});
```

- [ ] **Step 2: Написать падающие тесты разметки**

Дополнить `tests/rendered-html.test.mjs` проверками:

```js
test("renders linked car photos and factual home sections", () => {
  const home = renderToStaticMarkup(createElement(Home));
  assert.match(home, /href="\/cars\/bmw-x5"/);
  assert.match(home, /src="\/cars\/bmw-x5-front\.png"/);
  assert.match(home, /href="\/cars\/porsche-911"/);
  assert.match(home, /src="\/cars\/porsche-911-front\.png"/);
  assert.doesNotMatch(home, /hero-facts/);
  assert.match(home, /З 2002 року/);
  assert.match(home, /Продаж автомобілів · кредит · обмін · резерв/);
});

test("ships car detail routes and local brand marks", async () => {
  const detailPage = await readFile(
    new URL("../app/cars/[id]/page.tsx", import.meta.url),
    "utf8",
  );
  const component = await readFile(
    new URL("../app/components/CarDetailPage.tsx", import.meta.url),
    "utf8",
  );
  assert.match(detailPage, /getCarById/);
  assert.match(component, /car\.gallery/);
  assert.match(component, /У кредит/);
  await access(new URL("../public/brands/bmw.svg", import.meta.url));
  await access(new URL("../public/brands/porsche.svg", import.meta.url));
});
```

- [ ] **Step 3: Запустить тесты и подтвердить RED**

Run:

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/usr/bin:/bin node --test tests/catalog.test.ts tests/rendered-html.test.mjs
```

Expected: FAIL из-за отсутствующих `getCarById`, путей изображений, подробного маршрута и логотипов.

- [ ] **Step 4: Минимально расширить модель данных**

В `lib/catalog.ts` добавить:

```ts
export type Car = {
  // существующие поля
  coverImage: string;
  gallery: readonly string[];
};

export function getCarById(id: string) {
  return cars.find((car) => car.id === id);
}
```

Для BMW использовать `/cars/bmw-x5-front.png`, `/cars/bmw-x5-rear.png`; для Porsche — `/cars/porsche-911-front.png`, `/cars/porsche-911-rear.png`.

- [ ] **Step 5: Запустить только тесты данных**

Run: та же команда.

Expected: тесты `getCarById` PASS; тесты интерфейса продолжают FAIL по отсутствующим компонентам и ассетам.

- [ ] **Step 6: Commit**

```bash
git add lib/catalog.ts tests/catalog.test.ts tests/rendered-html.test.mjs
git commit -m "test: define Avento car media and detail behavior"
```

---

### Task 2: Добавить пользовательские фотографии и логотипы марок

**Files:**
- Create: `public/cars/bmw-x5-front.png`
- Create: `public/cars/bmw-x5-rear.png`
- Create: `public/cars/porsche-911-front.png`
- Create: `public/cars/porsche-911-rear.png`
- Create: `public/brands/*.svg`

**Interfaces:**
- Consumes: пути `coverImage` и `gallery` из `lib/catalog.ts`.
- Produces: локальные статические ассеты для карточек, подробных страниц и ленты марок.

- [ ] **Step 1: Скопировать четыре предоставленные фотографии без изменения**

```bash
mkdir -p public/cars
cp "/Users/ila/Downloads/ChatGPT Image 22 июля 2026 г., 14_10_46.png" public/cars/bmw-x5-front.png
cp "/Users/ila/Downloads/ChatGPT Image 22 июля 2026 г., 14_10_52.png" public/cars/bmw-x5-rear.png
cp "/Users/ila/Downloads/ChatGPT Image 22 июля 2026 г., 13_35_29.png" public/cars/porsche-911-front.png
cp "/Users/ila/Downloads/ChatGPT Image 22 июля 2026 г., 13_35_36.png" public/cars/porsche-911-rear.png
```

- [ ] **Step 2: Скачать локальные SVG-знаки марок**

Создать `public/brands` и сохранить тёмные SVG с `cdn.simpleicons.org`: `audi`, `bmw`, `hyundai`, `kia`, `landrover`, `lexus`, `mercedes`, `porsche`, `skoda`, `toyota`, `volkswagen`, `volvo`. Каждый URL имеет вид `https://cdn.simpleicons.org/<slug>/111111`.

- [ ] **Step 3: Проверить файлы**

Run:

```bash
file public/cars/*.png public/brands/*.svg
```

Expected: 4 PNG и 12 SVG; фотографии имеют исходные размеры 1536 × 1024 или 1448 × 1086.

- [ ] **Step 4: Commit**

```bash
git add public/cars public/brands
git commit -m "assets: add Avento car photos and brand marks"
```

---

### Task 3: Обновить главную, карточки, марки и футер

**Files:**
- Modify: `app/components/AventoSite.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Car.coverImage`, локальные `/brands/*.svg`.
- Produces: кликабельные карточки, обновлённый первый экран, ленту марок, расширенный раздел `#about` и вертикальный футер.

- [ ] **Step 1: Заменить пустые рамки фотографиями и ссылками**

В `CarCard` сделать изображение и `h3` ссылками на `/cars/${car.id}`:

```tsx
<Link className="photo-frame" href={`/cars/${car.id}`} aria-label={`Докладніше про ${car.brand} ${car.model}`}>
  <img src={car.coverImage} alt={`${car.brand} ${car.model}`} />
</Link>

<h3>
  <Link href={`/cars/${car.id}`}>{car.brand} {car.model}</Link>
</h3>
```

- [ ] **Step 2: Исправить шапку и первый экран**

Использовать обычный локальный `<img src="/avento-logo.png">` с видимым текстовым fallback в DOM. Удалить `.hero-facts`. В CSS задать первому экрану `min-height: calc(100svh - 84px)`, уменьшить верхний padding и выровнять содержимое по центру, чтобы следующий раздел не выглядывал обрезанным.

- [ ] **Step 3: Расширить фактический текст «Про нас»**

Добавить четыре абзаца на украинском:

```tsx
<p>З 2002 року Avento Motors працює з автомобілями різних класів — від міських моделей до преміальних седанів, кросоверів і спортивних авто.</p>
<p>Перед продажем ми звіряємо документи, історію обслуговування, пробіг і технічний стан. Результати перевірки пояснюємо покупцеві до оформлення угоди.</p>
<p>Допомагаємо порівняти програми кредитування, розрахувати щомісячний платіж та оцінити автомобіль для обміну.</p>
<p>Обране авто можна безкоштовно зарезервувати на 24 години. Команда супроводжує оформлення та відповідає на запитання щодо подальшого обслуговування.</p>
```

- [ ] **Step 4: Переделать ленту марок**

Создать таблицу `brandAssets` с точными путями. В `BrandMark` показывать `<img>` на белой карточке. Заголовок «Марки» остаётся над лентой, а ссылка «Переглянути всі марки» размещается отдельной строкой под лентой без рамки и фона.

- [ ] **Step 5: Переделать футер и плавные переходы**

```tsx
<footer>
  <strong>Avento Motors</strong>
  <span>Продаж автомобілів · кредит · обмін · резерв</span>
  <span>© 2026</span>
</footer>
```

Сохранить `scroll-behavior: smooth`; добавить `scroll-margin-top` для `#about` и отключить плавность в `prefers-reduced-motion`.

- [ ] **Step 6: Запустить тесты**

Run: команда из Task 1.

Expected: тест главной PASS; тест подробной страницы продолжает FAIL.

- [ ] **Step 7: Commit**

```bash
git add app/components/AventoSite.tsx app/globals.css
git commit -m "feat: refresh Avento home and car cards"
```

---

### Task 4: Добавить подробные страницы автомобилей

**Files:**
- Create: `app/components/CarDetailPage.tsx`
- Create: `app/cars/[id]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `getCarById(id)` и объект `Car`.
- Produces: маршруты `/cars/bmw-x5` и `/cars/porsche-911`.

- [ ] **Step 1: Создать клиентский компонент подробной страницы**

`CarDetailPage` принимает `{ car: Car }`, отображает кнопку «← До автомобілів», название, синий рейтинг, `car.gallery`, цену, платёж, все характеристики и три существующих действия. Формы повторно используют тот же `RequestModal`; при необходимости экспортировать модальное окно и тип `Action` из `AventoSite.tsx` либо вынести их в `app/components/CarRequestModal.tsx`.

- [ ] **Step 2: Создать динамический маршрут**

```tsx
import { notFound } from "next/navigation";
import { CarDetailPage } from "../../components/CarDetailPage";
import { getCarById } from "@/lib/catalog";

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) notFound();
  return <CarDetailPage car={car} />;
}
```

Добавить `generateStaticParams` для двух `id` и `generateMetadata` для названия автомобиля.

- [ ] **Step 3: Добавить адаптивные стили**

На широком экране галерея состоит из двух колонок, параметры и цена — из двух колонок ниже. На экране до 760 px все блоки становятся одной колонкой; изображения используют `object-fit: cover` и исходное соотношение сторон.

- [ ] **Step 4: Запустить все тесты**

Run: команда из Task 1.

Expected: все тесты PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/CarDetailPage.tsx 'app/cars/[id]/page.tsx' app/globals.css
git commit -m "feat: add Avento car detail pages"
```

---

### Task 5: Проверить и опубликовать

**Files:**
- Modify only if verification exposes a defect.

**Interfaces:**
- Consumes: полностью собранный сайт.
- Produces: новая приватная Sites-версия существующего Avento Motors.

- [ ] **Step 1: Запустить ESLint**

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/usr/bin:/bin ./node_modules/.bin/eslint . --ignore-pattern dist --ignore-pattern .next
```

Expected: exit 0. Для локальных пользовательских изображений допустим точечный eslint-disable правила `@next/next/no-img-element`, если Vinext снова не отображает `next/image`.

- [ ] **Step 2: Запустить production-сборку**

```bash
PATH=/Users/ila/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/usr/bin:/bin WRANGLER_LOG_PATH=.wrangler/wrangler.log ./node_modules/.bin/vinext build
```

Expected: exit 0; маршруты `/`, `/cars`, `/cars/[id]` присутствуют.

- [ ] **Step 3: Запустить все тесты**

Run: команда из Task 1.

Expected: 0 failures.

- [ ] **Step 4: Выполнить браузерную проверку**

Проверить главную, `/cars`, `/cars/bmw-x5`, `/cars/porsche-911`, переход по названию/фотографии, фильтр BMW, форму кредита и viewport 390 × 844. Проверить отсутствие overlay, console errors и горизонтального переполнения.

- [ ] **Step 5: Опубликовать существующий Sites-проект**

Собрать архив `scripts/package-site.sh`, сохранить новую версию для `project_id` из `.openai/hosting.json`, выполнить `deploy_private_site_version`, дождаться `status: succeeded` и открыть полученный URL.

- [ ] **Step 6: Commit при наличии исправлений проверки**

```bash
git add .
git commit -m "fix: complete Avento visual verification"
```
