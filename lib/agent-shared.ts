import { z } from "zod";
import { locales, type Locale } from "./i18n";

// Contract shared by the browser chat and the /api/agent Route Handler.

export const MAX_MESSAGES = 20;
export const MAX_MESSAGE_LENGTH = 1000;

export const agentRequestSchema = z.object({
  locale: z.enum(locales),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
      }),
    )
    .min(1)
    .max(MAX_MESSAGES)
    .refine((messages) => messages[0].role === "user", "first message must be from the user")
    .refine((messages) => messages.at(-1)?.role === "user", "last message must be from the user"),
});

export type AgentRequest = z.infer<typeof agentRequestSchema>;
export type AgentMessage = AgentRequest["messages"][number];

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
