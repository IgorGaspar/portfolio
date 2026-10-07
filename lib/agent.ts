import { readFileSync } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import type { AgentMessage } from "./agent-shared";
import type { Locale } from "./i18n";

const DEFAULT_MODEL = "claude-opus-5-5";
// Room for the answer plus the model's own thinking, which counts toward the limit.
const MAX_TOKENS = 2048;
const KNOWLEDGE_PLACEHOLDER = "{{CONTEÚDO DA SEÇÃO 7.2}}";
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

const readAgentFile = (name: string) =>
  readFileSync(path.join(process.cwd(), "content", "agent", name), "utf8").trim();

let cachedSystem: string | undefined;

/** Instructions with the knowledge base injected. Stable across requests so it can be cached. */
export function getSystemPrompt(): string {
  cachedSystem ??= readAgentFile("instructions.md").replace(
    KNOWLEDGE_PLACEHOLDER,
    readAgentFile("knowledge.md"),
  );
  return cachedSystem;
}

// The reply language goes in the user turn, never in the system prompt, to keep the cache prefix stable.
// It is decided here rather than left to the model: smaller models drift to the language of the
// system prompt (Portuguese) even when the visitor writes in English.
const EN_WORDS = new Set(
  "the is are was what which how does did he his him you your have has with and of to for about can could who where why it its in on tell this that would be an any there".split(
    " ",
  ),
);
const PT_WORDS = new Set(
  "que qual quais como ele dele você voce vocês tem têm com de da das dos para por sobre um uma é não nao quanto quantos onde quem seu sua em na nos nas já ja foi são sao isso esse essa mais ou se quero".split(
    " ",
  ),
);

/** Picks Portuguese or English for the reply; falls back to the page language when unclear. */
export function detectLanguage(text: string, fallback: Locale): Locale {
  let en = 0;
  let pt = /[ãõçáéíóúâêô]/i.test(text) ? 2 : 0;
  for (const word of text.toLowerCase().match(/[a-zà-ú']+/g) ?? []) {
    if (EN_WORDS.has(word)) en += 1;
    else if (PT_WORDS.has(word)) pt += 1;
  }
  if (en === pt) return fallback;
  return en > pt ? "en" : "pt";
}

const languageNote: Record<Locale, string> = {
  pt: "(Note from the site, not the visitor: reply in Portuguese.)",
  en: "(Note from the site, not the visitor: reply in English.)",
};

function toMessageParams(messages: AgentMessage[], locale: Locale): Anthropic.MessageParam[] {
  return messages.map((message, i) =>
    i === messages.length - 1
      ? {
          role: message.role,
          content: [
            { type: "text", text: languageNote[detectLanguage(message.content, locale)] },
            { type: "text", text: message.content },
          ],
        }
      : { role: message.role, content: message.content },
  );
}

// Effort and server-side refusal fallbacks are not accepted by Haiku 4.5.
const supportsEffortAndFallbacks = (model: string) => !model.includes("haiku");

export type AgentResult = { type: "text"; text: string } | { type: "refusal" };

type StreamOptions = {
  messages: AgentMessage[];
  locale: Locale;
  signal?: AbortSignal;
  onUsage?: (usage: Anthropic.Beta.BetaUsage | Anthropic.Usage) => void;
};

/**
 * Calls Claude with streaming and yields text as it arrives. A final
 * "refusal" item means any text yielded before it must be discarded.
 */
export async function* streamAgentAnswer({
  messages,
  locale,
  signal,
  onUsage,
}: StreamOptions): AsyncGenerator<AgentResult> {
  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const base = {
    model,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text" as const,
        text: getSystemPrompt(),
        cache_control: { type: "ephemeral" as const },
      },
    ],
    messages: toMessageParams(messages, locale),
  };

  const stream = supportsEffortAndFallbacks(model)
    ? client.beta.messages.stream(
        {
          ...base,
          output_config: { effort: "low" },
          betas: [FALLBACK_BETA],
          fallbacks: "default",
        },
        { signal },
      )
    : client.messages.stream(base, { signal });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield { type: "text", text: event.delta.text };
    }
  }

  const final = await stream.finalMessage();
  onUsage?.(final.usage);
  if (final.stop_reason === "refusal") yield { type: "refusal" };
}
