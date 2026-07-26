import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";

const clientDir = "dist/client";
const prerenderDir = "dist/server/prerendered-routes";
const outputDir = "dist/vercel-static";

await rm(outputDir, { recursive: true, force: true });
await cp(clientDir, outputDir, { recursive: true });

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(path) : [path];
  }));
  return files.flat();
}

for (const source of await collectHtml(prerenderDir)) {
  if (extname(source) !== ".html") continue;
  const route = relative(prerenderDir, source);
  const output = route === "index.html"
    ? join(outputDir, "index.html")
    : route === "404.html"
      ? join(outputDir, "404.html")
      : join(outputDir, route.slice(0, -".html".length), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await cp(source, output);
}
