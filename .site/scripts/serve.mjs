// Production-only local server. Never exposes sources or original media.
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { gzipSync } from "node:zlib";
const root = fileURLToPath(new URL("../../", import.meta.url));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
const security = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action https://wa.me; frame-ancestors 'none'",
};
http
  .createServer(async (request, response) => {
    Object.entries(security).forEach(([name, value]) =>
      response.setHeader(name, value),
    );
    try {
      const url = new URL(request.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      const allowed =
        pathname === "/" ||
        pathname === "/index.html" ||
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml" ||
        /^\/assets\/[\w./-]+$/.test(pathname);
      if (
        !allowed ||
        pathname.split("/").some((part) => part.startsWith("."))
      ) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const filepath = path.resolve(
        root,
        "." + (pathname === "/" ? "/index.html" : pathname),
      );
      if (!filepath.startsWith(root) || !(await stat(filepath)).isFile()) {
        response.writeHead(404).end("Not found");
        return;
      }
      const content = await readFile(filepath);
      const compress =
        /\.(html|css|js|txt|svg)$/.test(filepath) &&
        /\bgzip\b/.test(request.headers["accept-encoding"] || "");
      response.writeHead(200, {
        "Content-Type":
          mime[path.extname(filepath)] || "application/octet-stream",
        "Cache-Control": "no-cache",
        ...(compress
          ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" }
          : {}),
      });
      response.end(compress ? gzipSync(content) : content);
    } catch {
      response.writeHead(404).end("Not found");
    }
  })
  .listen(Number(process.env.PORT || 4173), "0.0.0.0", () =>
    console.log("Servidor de produção na porta " + (process.env.PORT || 4173)),
  );
