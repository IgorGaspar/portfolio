import { expect, test } from "@playwright/test";

const describe = (el: Element | null) => {
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const tag = el.tagName.toLowerCase();
  const name =
    el.getAttribute("aria-label") || (el.textContent ?? "").trim().slice(0, 30) || el.getAttribute("href") || "";
  const outlined = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
  const shadow = cs.boxShadow !== "none";
  return {
    id: `${tag}:${name}#${Array.from(document.querySelectorAll("*")).indexOf(el)}`,
    outlined: outlined || shadow,
    inViewport: r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth,
    visible: cs.visibility !== "hidden" && r.width > 0 && r.height > 0,
  };
};

for (const [path, reduced] of [
  ["/", false],
  ["/", true],
  ["/en", false],
] as const) {
  test(`tab through page ${path} reduced=${reduced}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    await page.goto(path);
    await page.waitForTimeout(1500);
    const seen: string[] = [];
    const problems: string[] = [];
    for (let i = 0; i < 250; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(60);
      const info = (await page.evaluate(`(${describe.toString()})(document.activeElement)`)) as ReturnType<
        typeof describe
      >;
      if (!info || info.id.startsWith("body")) {
        problems.push(`step ${i}: focus left to body`);
        break;
      }
      if (!info.outlined) problems.push(`no focus indicator: ${info.id}`);
      if (!info.visible) problems.push(`focused element not visible: ${info.id}`);
      if (!info.inViewport) problems.push(`focused element off-screen: ${info.id}`);
      if (seen.includes(info.id) && seen.indexOf(info.id) < seen.length - 1 && i > 3) {
        seen.push(info.id);
        break; // wrapped around
      }
      seen.push(info.id);
    }
    // Focus leaving to the browser chrome after the last control is expected.
    expect(problems.filter((p) => !p.includes("focus left to body"))).toEqual([]);
    expect(seen.length).toBeGreaterThan(30);
    await context.close();
  });
}

test("chat dialog keyboard", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.route("**/api/agent", (route) => route.abort());
  await page.goto("/");
  await page.waitForTimeout(1500);
  // Scroll so the floating button can appear, then reach it by keyboard.
  await page.mouse.wheel(0, 2500);
  await page.waitForTimeout(1200);
  const button = page.getByRole("button", { name: /^(Abrir o agente|Open the agent)$/ });
  await button.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(700);
  const insideAfterOpen = await page.evaluate(() => !!document.activeElement?.closest("dialog"));
  expect(insideAfterOpen).toBe(true);
  const stops: string[] = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    stops.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        return `${a?.tagName.toLowerCase()}:${a?.getAttribute("aria-label") ?? (a?.textContent ?? "").trim().slice(0, 20)}:${!!a?.closest("dialog")}`;
      }),
    );
  }
  // Tab never reaches the page behind the modal.
  expect(stops.filter((x) => x.startsWith("body")).length).toBeLessThanOrEqual(2);
  expect(stops.filter((x) => !x.startsWith("body") && x.endsWith(":false"))).toEqual([]);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  await expect(dialog).toHaveCount(0);
  await expect(button).toBeFocused();
  await context.close();
});
