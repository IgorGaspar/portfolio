import { describe, expect, it } from "vitest";
import { detectLanguage, getSystemPrompt } from "@/lib/agent";
import { createMemoryLimiter, parseWindow } from "@/lib/rate-limit";

describe("getSystemPrompt", () => {
  it("injects the knowledge base into the instructions", () => {
    const system = getSystemPrompt();

    expect(system).not.toContain("{{");
    expect(system).toContain("Você é o assistente do portfólio de Igor Gaspar");
    expect(system).toMatch(/<base_de_conhecimento>\s*# Igor Gaspar/);
    expect(system).toContain("Trajetória em uma frase");
  });

  it("is identical across calls so the prompt cache prefix stays stable", () => {
    expect(getSystemPrompt()).toBe(getSystemPrompt());
  });
});

describe("parseWindow", () => {
  it.each([
    ["1 h", 3_600_000],
    ["30m", 1_800_000],
    ["10 s", 10_000],
  ])("parses %s", (value, expected) => {
    expect(parseWindow(value)).toBe(expected);
  });

  it("rejects an unknown format", () => {
    expect(() => parseWindow("soon")).toThrow();
  });
});

describe("createMemoryLimiter", () => {
  it("blocks after the limit and resets when the window ends", async () => {
    let now = 0;
    const limit = createMemoryLimiter(2, 1000, () => now);

    expect((await limit("ip")).success).toBe(true);
    expect((await limit("ip")).success).toBe(true);
    expect((await limit("ip")).success).toBe(false);

    now = 1000;
    expect((await limit("ip")).success).toBe(true);
  });
});

describe("detectLanguage", () => {
  it.each([
    ["What's your experience with .NET and Angular?", "pt", "en"],
    ["Is Igor a senior developer?", "pt", "en"],
    ["Which projects have you shipped to production?", "pt", "en"],
    ["Qual sua experiência com .NET e Angular?", "en", "pt"],
    ["Quais projetos você já colocou em produção?", "en", "pt"],
    ["Ele lidera time?", "en", "pt"],
    ["Quanto ele cobra por um site?", "en", "pt"],
  ] as const)("detects the language of %s", (text, pageLocale, expected) => {
    expect(detectLanguage(text, pageLocale)).toBe(expected);
  });

  it.each(["pt", "en"] as const)("falls back to the page language (%s) when unclear", (locale) => {
    expect(detectLanguage("MonAI?", locale)).toBe(locale);
  });
});
