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

// The page language goes in the user turn, never in the system prompt, to keep the cache prefix stable.
const localeHint: Record<Locale, string> = {
  pt: "(Idioma da página: português. Use-o apenas se o idioma da pergunta for ambíguo.)",
  en: "(Idioma da página: inglês. Use-o apenas se o idioma da pergunta for ambíguo.)",
};

function toMessageParams(messages: AgentMessage[], locale: Locale): Anthropic.MessageParam[] {
  return messages.map((message, i) =>
    i === messages.length - 1
      ? {
          role: message.role,
          content: [
            { type: "text", text: localeHint[locale] },
            { type: "text", text: message.content },
          ],
        }
      : { role: message.role, content: message.content },
  );
}

// Effort and server-side refusal fallbacks are not accepted by Haiku 4.5.
const supportsEffortAndFallbacks = (model: string) => !model.includes("haiku");

export type AgentResult =
  | { type: "text"; text: string }
  | { type: "refusal" };

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
