import { defineConfig } from "vite";
import { writeFile, appendFile } from "node:fs/promises";
import business from "./site.config.js";

const configuredUrl = process.env.SITE_URL || business.siteUrl;
let origin = "";
if (configuredUrl) {
  const url = new URL(configuredUrl);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL deve ser a origem HTTPS real, sem caminho, credenciais, consulta ou fragmento.",
    );
  }
  origin = url.origin;
}

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: { host: "0.0.0.0" },
  plugins: [
    {
      name: "public-business-details",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          const rendered = html
            .replaceAll("__WHATSAPP_NUMBER__", business.whatsapp)
            .replaceAll("__PHONE_LABEL__", business.phoneLabel)
            .replaceAll("__INSTAGRAM_HANDLE__", business.instagram);
          const tags = origin
            ? [
                {
                  tag: "link",
                  attrs: { rel: "canonical", href: origin + "/" },
                  injectTo: "head",
                },
                {
                  tag: "meta",
                  attrs: { property: "og:url", content: origin + "/" },
                  injectTo: "head",
                },
                {
                  tag: "meta",
                  attrs: {
                    property: "og:image",
                    content: origin + "/assets/images/mansao-1672.webp",
                  },
                  injectTo: "head",
                },
                {
                  tag: "meta",
                  attrs: {
                    property: "og:image:alt",
                    content:
                      "Vilela Engenharia — imagem conceitual de arquitetura residencial",
                  },
                  injectTo: "head",
                },
              ]
            : [];
          return { html: rendered, tags };
        },
      },
      async closeBundle() {
        if (!origin) return;
        await writeFile(
          new URL("./dist/sitemap.xml", import.meta.url),
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`,
        );
        await appendFile(
          new URL("./dist/robots.txt", import.meta.url),
          `\nSitemap: ${origin}/sitemap.xml\n`,
        );
      },
    },
  ],
});
