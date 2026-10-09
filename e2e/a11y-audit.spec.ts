import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";

const paths = ["/", "/en"];
const themes = ["dark", "light"] as const;
const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

for (const path of paths) {
  for (const theme of themes) {
    for (const [vpName, viewport] of Object.entries(viewports)) {
      for (const reduced of [false, true]) {
        const name = `${path} ${theme} ${vpName}${reduced ? " reduced" : ""}`;
        test(`axe: ${name}`, async ({ browser }, info) => {
          const context = await browser.newContext({
            viewport,
            reducedMotion: reduced ? "reduce" : "no-preference",
          });
          const page = await context.newPage();
          await page.route("**/api/agent", (route) => route.abort());
          await page.goto(path);
          await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
          // Scroll through so lazy/animated sections are rendered and visible.
          for (let y = 0; y < 12000; y += 700) {
            await page.mouse.wheel(0, 700);
            await page.waitForTimeout(120);
          }
          await page.waitForTimeout(800);
          const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"])
            .analyze();
          const rows = results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.slice(0, 6).map((n) => ({
              target: n.target.join(" "),
              summary: n.failureSummary?.split("\n").slice(1, 3).join(" ").trim(),
            })),
            count: v.nodes.length,
          }));
          await info.attach("violations.json", {
            body: JSON.stringify(rows, null, 2),
            contentType: "application/json",
          });
          console.log(`### ${name}: ${rows.length} violation types`);
          for (const r of rows) console.log(JSON.stringify(r));
          await context.close();
        });
      }
    }
  }
}
