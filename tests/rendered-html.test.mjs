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
  assert.match(html, /Переглянути всі марки/);
  assert.doesNotMatch(html, /codex-preview|Новий рівень руху|У наявності/i);
  assert.doesNotMatch(html, />\s*Каталог\s*</i);
});

test("renders the choose-car page with filters and a large back action", async () => {
  const response = await render("/cars?brand=BMW");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Обрати авто/);
  assert.match(html, /На головну/);
  assert.match(html, /Максимальна ціна/);
  assert.match(html, /Рік від/);
  assert.match(html, /Пробіг до/);
  assert.match(html, /BMW X5 xDrive30d/);
  assert.doesNotMatch(html, /У наявності/i);
});

test("ships the finished visual system without starter artifacts", async () => {
  const [css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/avento-logo.png", import.meta.url)),
  ]);

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.car-card/);
  assert.match(css, /\.brand-track/);
  assert.match(layout, /<html lang="uk">/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
