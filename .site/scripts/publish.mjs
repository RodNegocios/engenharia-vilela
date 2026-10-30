import { cp, readFile, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const project = fileURLToPath(new URL("..", import.meta.url));
const root = path.resolve(project, "..");
const dist = path.join(project, "dist");
const html = await readFile(path.join(dist, "index.html"), "utf8");
if (!html.includes("Vilela Engenharia") || !html.includes("assets/"))
  throw new Error("Build incompleto.");
// Only remove stale Vite bundles, preserving original media and other user files.
await mkdir(path.join(root, "assets"), { recursive: true });
for (const name of await readdir(path.join(root, "assets"))) {
  if (/^index-[a-zA-Z0-9_-]+\.(js|css)$/.test(name))
    await rm(path.join(root, "assets", name));
}
for (const name of await readdir(dist))
  await cp(path.join(dist, name), path.join(root, name), { recursive: true });
console.log(
  "Produção atualizada na raiz: HTML, assets, robots.txt e proteção Apache.",
);
