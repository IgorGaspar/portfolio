// Renders the static fallback of the hero's neural core (spec 3.3.1): one AVIF
// per theme, shown to devices that do not get the WebGL scene.
//
// Run it again whenever the scene's look changes:
//   1. npm run dev
//   2. node scripts/render-neural-fallback.mjs [http://localhost:3000]

import { chromium } from "@playwright/test";
import sharp from "sharp";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const size = { width: 1600, height: 1000 };

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

for (const theme of ["dark", "light"]) {
  const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
  await context.addInitScript((value) => localStorage.setItem("theme", value), theme);
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 15_000 });

  // Only the backdrop: no text, no navigation, no dev overlay, no custom cursor.
  await page.addStyleTag({
    content: `
      header, [data-hero] .container-page, #scroll-progress, nextjs-portal,
      .cursor-ring, .cursor-dot { visibility: hidden !important; }
    `,
  });
  await page.waitForTimeout(2500);

  const png = await page.screenshot({ clip: { x: 0, y: 0, ...size } });
  const file = `public/media/neural-${theme}.avif`;
  const info = await sharp(png).avif({ quality: 42, effort: 6 }).toFile(file);
  console.log(`${file}: ${(info.size / 1024).toFixed(1)} KB`);
  await context.close();
}

await browser.close();
