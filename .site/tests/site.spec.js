import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ready = async (page) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toBeVisible();
};

test("production loads locally with no JavaScript errors, missing assets or third-party requests", async ({
  page,
}) => {
  const errors = [],
    failures = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:4173")) external.push(r.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  for (const section of [
    "#essencia",
    "#atuacao",
    "#olhares",
    "#casa-propria",
    "#contato",
  ]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
  }
  await page.evaluate(async () => {
    const images = [...document.images].filter((i) => i.getAttribute("src"));
    images.forEach((i) => {
      i.loading = "eager";
    });
    await Promise.all(images.map((i) => i.decode()));
  });
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  expect(external).toEqual([]);
  await expect(page).toHaveTitle(/Vilela Engenharia.*Comodoro/);
  expect(await page.locator("h1").count()).toBe(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const schema = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(JSON.parse(schema).telephone).toBe("+5565999438988");
});

test("hero scrolls directly into the next block with its layered wordmark intact", async ({
  page,
}) => {
  await ready(page);
  await page.waitForTimeout(1600);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".hero-bridge, .hero-veil")).toHaveCount(0);
  await expect(page.locator(".hero-word")).toHaveText("VILELA");
  await expect(page.locator(".hero-foreground")).toHaveCSS(
    "clip-path",
    /architecture-mask/,
  );
  const initial = await page
    .locator(".hero-world")
    .evaluate((el) => getComputedStyle(el).transform);
  const boundary = await page.evaluate(() => ({
    bottom: document.querySelector(".hero").getBoundingClientRect().bottom,
    next: document.querySelector("#essencia").getBoundingClientRect().top,
  }));
  expect(Math.abs(boundary.next - boundary.bottom)).toBeLessThan(1);
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(250);
  expect(
    await page
      .locator(".hero-world")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(initial);
  expect(
    await page
      .locator(".hero")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeLessThan(-490);
  expect(
    await page
      .locator("#essencia")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeLessThan(450);
});

test("service accordion is exclusive, accessible and contains working contact URLs", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.locator("#service-button-2").click();
  await expect(page.locator("#service-button-2")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.locator("#service-panel-2")).toBeVisible();
  await expect(page.locator("#service-panel-1")).toBeHidden();
  await expect(page.locator("#service-panel-2 a")).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/5565999438988\?text=/,
  );
  await page.locator("#service-button-3").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#service-panel-3")).toBeVisible();
  await expect(page.locator("#service-panel-2")).toBeHidden();
  await page.locator("#service-button-3").click();
  await expect(page.locator("#service-panel-3")).toBeHidden();
});

test("every WhatsApp button uses the current number and a relevant message", async ({
  page,
}) => {
  await ready(page);
  const links = await page.locator('a[href^="https://wa.me/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      label: anchor.getAttribute("aria-label") || anchor.textContent.trim(),
      href: anchor.href,
    })),
  );
  expect(links.length).toBeGreaterThan(7);
  for (const link of links) {
    const url = new URL(link.href);
    expect(url.pathname, link.label).toBe("/5565999438988");
    expect(url.searchParams.get("text"), link.label).toMatch(/Vilela Engenharia|projeto|obra|financiamento/i);
  }
  const contexts = [
    ["Quero planejar minha casa", /projeto residencial/i],
    ["Vamos falar da sua obra", /construção.*obra/i],
    ["Encontre o próximo passo", /planejar meu projeto/i],
    ["Conversar sobre financiamento", /financiamento habitacional/i],
    ["Começar meu projeto", /começar um projeto/i],
  ];
  for (const [label, message] of contexts) {
    const link = links.find((item) => item.label.includes(label));
    expect(link, label).toBeDefined();
    expect(new URL(link.href).searchParams.get("text")).toMatch(message);
  }
});

test("gallery supports arrows, keyboard, enlargement and Escape with focus restoration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.locator("#olhares").scrollIntoViewIfNeeded();
  await page.locator(".gallery-next").click();
  await expect(page.locator(".gallery-count")).toContainText("02");
  await page.locator(".gallery").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".gallery-count")).toContainText("03");
  await page.locator(".gallery-next").click();
  await expect(page.locator(".gallery-next")).toBeDisabled();
  await page.locator(".gallery-prev").click();
  await expect(page.locator(".gallery-next")).toBeEnabled();
  const link = page.locator("[data-gallery]").nth(2);
  await link.click();
  await expect(page.locator("#image-dialog")).toBeVisible();
  await expect(page.locator("#lightbox-caption")).toHaveText(
    "Linhas contemporâneas, escala acolhedora",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#image-dialog")).toBeHidden();
  await expect(link).toBeFocused();
});

test("project enquiry validates input and prepares an encoded WhatsApp draft without storing data", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const trigger = page.locator(".hero [data-enquiry]");
  await trigger.click();
  const dialog = page.locator("#project-dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Continuar no WhatsApp" }).click();
  expect(
    await page.locator("#client-name").evaluate((el) => el.validity.valid),
  ).toBe(false);
  await page.locator("#client-name").fill("Ana & João");
  await page.locator("#project-type").selectOption("Projeto residencial");
  await page
    .locator("#project-message")
    .fill("Gostaria de uma casa com jardim & varanda. <script>teste</script>");
  await page.evaluate(() => {
    window.open = (url, target, features) => {
      window.__outbound = { url, target, features };
    };
  });
  await dialog.getByRole("button", { name: "Continuar no WhatsApp" }).click();
  const outbound = await page.evaluate(() => window.__outbound);
  const url = new URL(outbound.url);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/5565999438988");
  expect(url.searchParams.get("text")).toContain("Ana & João");
  expect(url.searchParams.get("text")).toContain("<script>teste</script>");
  expect(outbound.features).toBe("noopener,noreferrer");
  await expect(page.locator(".form-fallback")).toHaveAttribute(
    "href",
    outbound.url,
  );
  expect(await context.cookies()).toEqual([]);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("reduced motion works initially and when toggled live; no pinned scroll or hidden headings", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".hero-bridge, .hero-veil")).toHaveCount(0);
  await expect(page.locator(".reveal-inner")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await page.locator(".reveal-inner").count()).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("#about-heading")).toHaveText(
    "Seu sonho temuma forma.Vamos encontrá-la.",
  );
  await expect(page.locator(".reveal-inner")).toHaveCount(0);
});

for (const width of [360, 390, 768]) {
  test(`responsive layout at ${width}px; menu and anchors remain usable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 761) {
      expect(
        await page
          .locator(".hero-background img")
          .evaluate((el) => el.currentSrc),
      ).toContain("mansao-1200.webp");
      expect(
        await page
          .locator(".hero-background img")
          .evaluate((el) => el.currentSrc),
      ).toEqual(
        await page
          .locator(".hero-foreground img")
          .evaluate((el) => el.currentSrc),
      );
      await page.locator(".menu-toggle").click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
      await expect(page.locator(".menu-toggle")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await page.locator('#mobile-menu a[href="#atuacao"]').click();
      await expect(page.locator("#mobile-menu")).toBeHidden();
      await expect(page.locator(".menu-toggle")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      await expect(page.locator("#atuacao")).toBeFocused();
      expect(
        await page
          .locator("#atuacao")
          .evaluate((el) => el.getBoundingClientRect().top),
      ).toBeGreaterThanOrEqual(68);
    }
    for (const id of [
      "essencia",
      "atuacao",
      "olhares",
      "casa-propria",
      "contato",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("WCAG 2.2 AA automated audit on desktop, mobile and enquiry dialog", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await page.locator(".hero [data-enquiry]").click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("source, original media and repository metadata are not served by the production server", async ({
  request,
}) => {
  for (const path of [
    "/.site/package.json",
    "/.site/materials/projeto1.png",
    "/.git/config",
    "/.env",
    "/.site/docs/README.md",
  ]) {
    expect((await request.get(path)).status()).toBe(403);
  }
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-security-policy"]).toContain(
    "script-src 'self'",
  );
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
});

test("without JavaScript the content and direct WhatsApp and gallery links remain available", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#about-heading")).toBeVisible();
  await expect(page.locator(".hero [data-enquiry]")).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/5565999438988\?text=/,
  );
  await expect(page.locator(".phone-link")).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/5565999438988\?text=/,
  );
  await expect(page.locator("[data-gallery]").first()).toHaveAttribute(
    "href",
    /comercial-1-1440.webp/,
  );
  await context.close();
});
