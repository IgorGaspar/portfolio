import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDictionary } from "@/content";
import { hasLocale } from "@/lib/i18n";

export const alt = "Igor Gaspar · igorgaspar.tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "pt" }, { locale: "en" }];
}

// The hero's neural core, pre-cropped to the card size by the one-off sharp call
// documented in assets/README.md (Satori cannot read the AVIF fallbacks). It is nudged right so the
// network stays clear of the title, which is kept to the left ~60% of the card.
const background = readFile(join(process.cwd(), "assets/og-neural.jpg"));

// Satori reads TTF, not the WOFF2 files next/font serves to the page.
const fontMedium = readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-Medium.ttf"));
const fontBold = readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-Bold.ttf"));

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(hasLocale(locale) ? locale : "pt");
  const data = `data:image/jpeg;base64,${(await background).toString("base64")}`;
  const [medium, bold] = await Promise.all([fontMedium, fontBold]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Space Grotesk",
          background: "#07080C",
          color: "#F3F5FA",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 170 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(7,8,12,0.92) 0%, rgba(7,8,12,0.75) 55%, rgba(7,8,12,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Sizes are chosen for the ~500 px wide previews of LinkedIn and Facebook feeds. */}
          <div style={{ display: "flex", fontSize: 32, fontWeight: 500, color: "#C9D0E0", letterSpacing: 0.3 }}>
            {dict.hero.eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, maxWidth: 800 }}>
            {dict.hero.title}
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#7DD3FC" }}>igorgaspar.tech</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: medium, weight: 500, style: "normal" },
        { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
