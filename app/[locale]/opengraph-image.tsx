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
// documented in assets/README.md (Satori cannot read the AVIF fallbacks).
const background = readFile(join(process.cwd(), "assets/og-neural.jpg"));

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(hasLocale(locale) ? locale : "pt");
  const data = `data:image/jpeg;base64,${(await background).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#07080C",
          color: "#F3F5FA",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0 }} />
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
            padding: "72px 80px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, color: "#9AA3B8", letterSpacing: 0.5 }}>
            {dict.hero.eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, maxWidth: 820 }}>
            {dict.hero.title}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#7DD3FC" }}>igorgaspar.tech</div>
        </div>
      </div>
    ),
    size,
  );
}
