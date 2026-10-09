import { expect, test, type Page } from "@playwright/test";

const ndjson = (...events: object[]) => events.map((e) => JSON.stringify(e)).join("\n") + "\n";

/** The agent API is always mocked: smoke tests never spend API credit. */
async function mockAgent(page: Page, text = "Resposta de teste.") {
  const requests: unknown[] = [];
  await page.route("**/api/agent", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson; charset=utf-8",
      body: ndjson({ type: "delta", text }),
    });
  });
  return requests;
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && new URL(r.url()).origin === new URL(page.url()).origin) {
      errors.push(`${r.status()} ${r.url()}`);
    }
  });
  return errors;
}

for (const [path, lang, hreflangOther] of [
  ["/", "pt-BR", "en"],
  ["/en", "en", "pt-BR"],
] as const) {
  test(`loads ${path}`, async ({ page }) => {
    const errors = collectErrors(page);
    await mockAgent(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator(`link[rel="alternate"][hreflang="${hreflangOther}"]`)).toHaveCount(1);
    await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
}

test("language switch goes PT -> EN", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("group", { name: "Idioma" }).first().getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("inline chat answers a suggestion", async ({ page }) => {
  const requests = await mockAgent(page, "Resposta de teste.");
  await page.goto("/");
  await page.getByRole("button", { name: /^Quais projetos/ }).click();
  await expect(page.getByText("Resposta de teste.").first()).toBeVisible();
  expect(requests).toHaveLength(1);
});

test("floating button opens the panel; Escape closes it and returns focus", async ({ page }) => {
  await mockAgent(page);
  await page.goto("/");
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 2500);
  const open = page.getByRole("button", { name: "Abrir o agente" });
  await expect(open).toBeVisible();
  await open.click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toBeVisible();
  await expect(dialog.locator("textarea")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });

  test("no pinning, no smooth scroll, static neural image, all content visible", async ({ page }) => {
    const errors = collectErrors(page);
    await mockAgent(page);
    await page.goto("/");

    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);

    // Static fallback instead of the WebGL scene.
    await expect(page.locator("html")).toHaveAttribute("data-neural", "static");
    await expect(page.locator("canvas")).toHaveCount(0);

    // Scroll the whole page in real steps (no Lenis to intercept the wheel).
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 600) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => {
      const hidden = [...document.querySelectorAll("[data-reveal], [data-project], [data-pillar]")]
        .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
        .map((el) => el.getAttribute("data-reveal") ?? el.tagName);
      const pinned = [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return cs.position === "fixed" && el.closest("section");
      }).length;
      const transformed = [...document.querySelectorAll("[data-reveal], [data-project], [data-pillar]")]
        .filter((el) => getComputedStyle(el).transform !== "none")
        .map((el) => el.getAttribute("data-reveal") ?? el.tagName);
      return {
        hidden,
        transformed,
        pinSpacers: document.querySelectorAll(".pin-spacer").length,
        lenis: document.documentElement.classList.contains("lenis"),
        pinnedFixedInSections: pinned,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    expect(state.hidden).toEqual([]);
    expect(state.transformed).toEqual([]);
    expect(state.pinSpacers).toBe(0);
    expect(state.lenis).toBe(false);
    expect(state.overflowX).toBe(false);
    expect(errors).toEqual([]);
  });

  test("agent panel still works", async ({ page }) => {
    await mockAgent(page, "Resposta reduzida.");
    await page.goto("/");
    await page.getByRole("button", { name: /^Quais projetos/ }).click();
    await expect(page.getByText("Resposta reduzida.").first()).toBeVisible();
  });
});

test("full motion (control): WebGL scene, smooth scroll and pinned sections are active", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await mockAgent(page);
  await page.goto("/");
  // The scene loads on the first sign of life from the visitor.
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.mouse.move(400, 300);
  await expect(page.locator("canvas").first()).toBeAttached({ timeout: 25_000 });
  await expect(page.locator("html")).not.toHaveAttribute("data-neural", "static");
  await expect(page.locator("html.lenis")).toHaveCount(1);
  await expect(page.locator(".pin-spacer").first()).toBeAttached();
  await context.close();
});

test("the agent card's suggestions are clickable as soon as they are visible", async ({ page }) => {
  await mockAgent(page);
  await page.goto("/");
  await page.mouse.move(300, 300); // wakes the WebGL scene, which must never cover the page
  await expect(page.locator("canvas").first()).toBeAttached({ timeout: 25_000 });
  // Card entering from the bottom of the screen, as it does when scrolling down.
  for (let i = 0; i < 40; i++) {
    const cardTop = await page.evaluate(() => document.getElementById("agent")!.getBoundingClientRect().top);
    if (cardTop < 450) break;
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(100);
  }
  const chip = page.getByRole("button", { name: /^Quais projetos/ });
  await expect(chip).toHaveCSS("opacity", "1");
  const covered = await chip.evaluate((el) => {
    const box = el.getBoundingClientRect();
    return !el.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
  });
  expect(covered).toBe(false);
});

test("the OG image is served directly, without a redirect", async ({ request }) => {
  for (const path of ["/pt/opengraph-image", "/en/opengraph-image"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
});

test("switching language starts a fresh chat", async ({ page }) => {
  await mockAgent(page, "Resposta em português.");
  await page.goto("/");
  await page.getByRole("button", { name: /^Quais projetos/ }).click();
  await expect(page.getByText("Resposta em português.").first()).toBeVisible();

  await page.getByRole("group", { name: "Idioma" }).first().getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("button", { name: /^Which projects/ })).toBeVisible();
  await expect(page.getByText("Resposta em português.")).toHaveCount(0);
});

test.describe("touch screens", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("tapping a selected project again clears the stack highlight", async ({ page }) => {
    await page.goto("/");
    const chip = page.getByRole("button", { name: "MonAI", exact: true });
    await chip.scrollIntoViewIfNeeded();
    const dimmed = page.locator("[data-pill].opacity-20");

    await chip.tap();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(await dimmed.count()).toBeGreaterThan(0);

    await chip.tap();
    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await expect(dimmed).toHaveCount(0);
  });

  test("architecture diagrams fit the screen without scrolling sideways", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const diagrams = page.locator("svg[data-diagram]:visible");
    await expect(diagrams).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const fits = await diagrams.nth(i).evaluate((svg) => {
        const box = svg.getBoundingClientRect();
        const parent = svg.parentElement!;
        return parent.scrollWidth <= parent.clientWidth && box.width <= window.innerWidth;
      });
      expect(fits).toBe(true);
    }
  });
});
