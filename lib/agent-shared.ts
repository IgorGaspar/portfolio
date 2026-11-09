import type { Locale } from "./i18n";

// Contract shared by the browser chat and the /api/agent Route Handler.

export const MAX_MESSAGES = 20;
export const MAX_MESSAGE_LENGTH = 1000;
/**
 * Limit for the agent's own answers sent back as history. They are capped by the model's
 * max_tokens (2048), not by the chat input, so they routinely pass MAX_MESSAGE_LENGTH;
 * validating them with the visitor limit made every follow-up after a long answer fail with 400.
 */
export const MAX_ANSWER_LENGTH = 12_000;

export type AgentMessage = { role: "user" | "assistant"; content: string };
export type AgentRequest = { locale: Locale; messages: AgentMessage[] };

/** Newline-delimited JSON events streamed by the Route Handler. */
export type AgentEvent =
  | { type: "delta"; text: string }
  /** Discards any partial text and shows this message instead (refusal or failure). */
  | { type: "replace"; text: string };

type AgentErrorKind = "rateLimited" | "unavailable" | "refusal";

const email = "igorfgaspar@outlook.com";

export const agentErrors: Record<Locale, Record<AgentErrorKind, string>> = {
  pt: {
    rateLimited:
      "Muitas perguntas seguidas. Tente de novo em alguns minutos ou fale comigo por e-mail.",
    unavailable: `O assistente está indisponível agora. Fale comigo por e-mail: ${email}`,
    refusal: `Não consigo responder isso; fale direto com o Igor: ${email}`,
  },
  en: {
    rateLimited: "Too many questions in a row. Try again in a few minutes or email me.",
    unavailable: `The assistant is unavailable right now. Email me instead: ${email}`,
    refusal: `I can't answer that; reach out to Igor directly: ${email}`,
  },
};
