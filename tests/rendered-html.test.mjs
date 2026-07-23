import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Avento Motors home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<html lang="uk">/i);
  assert.match(html, /Avento Motors/);
  assert.match(html, /Обрати авто/);
  assert.match(html, /Про нас/);
  assert.match(html, /Ціна від/);
  assert.match(html, /У кредит від/);
  assert.match(html, /card-photo-segments/);
  assert.match(html, /Безкоштовний резерв до 24 годин/);
  assert.match(html, /Переглянути всі марки/);
  assert.match(html, /class="[^"]*all-brands-row"/);
  assert.match(html, /class="site-logo-mark"/);
  assert.match(html, /src="\/avento-logo-mark-white\.png"/);
  assert.match(html, /class="[^"]*hero-carousel/);
  assert.match(html, /avento-bmw-night\.png/);
  assert.match(html, /aria-label="Попередній слайд"/);
  assert.match(html, /aria-label="Наступний слайд"/);
  assert.match(html, /class="hero-dots"/);
  assert.match(html, /aria-label="Перейти до банера 1"/);
  assert.match(html, /Щодня ми оновлюємо добірку/);
  assert.match(html, /href="\/cars\/bmw-x5"/);
  assert.match(html, /src="\/cars\/bmw-x5-front\.png"/);
  assert.match(html, /href="\/cars\/porsche-911"/);
  assert.match(html, /src="\/cars\/porsche-911-front\.png"/);
  assert.match(html, /З 2002 року/);
  assert.match(html, /Продаж автомобілів · кредит · обмін · резерв/);
  assert.doesNotMatch(html, /hero-facts/);
  assert.doesNotMatch(html, /codex-preview|Новий рівень руху|У наявності/i);
  assert.doesNotMatch(html, />\s*Каталог\s*</i);
});

test("renders the choose-car page with filters and a large back action", async () => {
  const response = await render("/cars?brand=BMW");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Обрати авто/);
  assert.match(html, /На головну/);
  assert.match(html, /Ціна/);
  assert.match(html, /Рік/);
  assert.match(html, /Пробіг/);
  assert.match(html, /Марки/);
  assert.match(html, /Мін\./);
  assert.match(html, /Макс\./);
  assert.match(html, /₴/);
  assert.match(html, /BMW X5 xDrive30d/);
  assert.doesNotMatch(html, /results-heading[^>]*>.*<span>2<\/span>/s);
  assert.doesNotMatch(html, /У наявності/i);
});

test("renders a detailed car page with both local photos and actions", async () => {
  const response = await render("/cars/bmw-x5");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /BMW X5 xDrive30d/);
  assert.match(html, /bmw-x5-front\.png/);
  assert.match(html, /bmw-x5-rear\.png/);
  assert.match(html, /У кредит/);
  assert.match(html, /Обмін/);
  assert.match(html, /Резерв/);
  assert.match(html, /detail-top-layout/);
  assert.match(html, /detail-gallery-single/);
  assert.match(html, /detail-actions/);
  assert.match(html, /Безкоштовний резерв до 24 годин/);
  assert.doesNotMatch(html, /У наявності/i);
});

test("ships the finished visual system without starter artifacts", async () => {
  const [css, layout, packageJson, site, detail, catalog] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AventoSite.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CarDetailPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/catalog.ts", import.meta.url), "utf8"),
    access(new URL("../public/avento-logo.png", import.meta.url)),
    access(new URL("../public/avento-logo-mark-white.png", import.meta.url)),
  ]);

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.car-card/);
  assert.match(css, /\.brand-track/);
  assert.match(layout, /<html lang="uk">/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(site, /<option value="6">6 місяців<\/option>/);
  assert.match(site, /<option value="12">12 місяців<\/option>/);
  assert.match(site, /<option value="24">24 місяців<\/option>/);
  assert.match(site, /Ваш автомобіль/);
  assert.match(site, /request-car-identity/);
  assert.match(site, /card-photo-segment/);
  assert.doesNotMatch(css, /\.photo-frame:hover img\s*\{[^}]*scale/);
  assert.doesNotMatch(css, /\.gallery-tile:hover img\s*\{[^}]*scale/);
  assert.match(site, /className="site-logo-mark"/);
  assert.match(site, /function RangeFilter/);
  assert.match(site, /2010/);
  assert.match(site, /2026/);
  assert.match(site, /range-summary/);
  assert.match(site, /className="range-dropdown"/);
  assert.match(site, /scrollIntoView\(\{ behavior: "smooth" \}\)/);
  assert.match(site, /Chevrolet: "https:\/\/cdn\.simpleicons\.org\/chevrolet"/);
  assert.match(site, /range-unit/);
  assert.match(site, /<span className="range-unit">\{unit\}<\/span><span className="range-bound">Мін\.<\/span>/);
  assert.match(css, /\.selected-filter-chip:hover/);
  assert.match(site, /selected-filter-chip/);
  assert.match(site, /return `\$\{title\}: \$\{value\(min\)\}–\$\{value\(max\)\}`/);
  assert.match(site, /\+ нижче/);
  assert.match(site, /\+ більше/);
  assert.match(site, /function BrandFilter/);
  assert.match(site, /function YearFilter/);
  assert.match(site, /Оцінено за 38 пунктами від 0 до 5/);
  assert.match(site, /router\.push\(`\/cars\/\$\{car\.id\}`\)/);
  assert.doesNotMatch(site, /site-logo-letter-a/);
  assert.match(catalog, /"Tesla"/);
  assert.doesNotMatch(detail, /<p className="eyebrow">\{car\.brand\}<\/p>/);
  assert.match(css, /\.range-filter/);
  assert.match(css, /\.range-dropdown/);
  assert.match(css, /max-height: 0/);
  assert.match(css, /\.year-choice-list/);
  assert.match(css, /\.detail-rating-wrap \.rating-tooltip/);
  assert.match(css, /\.car-card\s*\{[^}]*overflow: visible/s);
  assert.match(css, /\.rating-tooltip::after/);
  assert.match(css, /\.detail-gallery-single\s*\{[^}]*height:/s);
  assert.match(css, /scroll-behavior:\s*smooth/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("ships local brand marks and user-provided car photos", async () => {
  await Promise.all([
    access(new URL("../public/brands/bmw.svg", import.meta.url)),
    access(new URL("../public/brands/porsche.svg", import.meta.url)),
    access(new URL("../public/cars/bmw-x5-front.png", import.meta.url)),
    access(new URL("../public/cars/bmw-x5-rear.png", import.meta.url)),
    access(new URL("../public/cars/porsche-911-front.png", import.meta.url)),
    access(new URL("../public/cars/porsche-911-rear.png", import.meta.url)),
  ]);
});
