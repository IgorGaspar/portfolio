import { z } from "zod";
import { MAX_ANSWER_LENGTH, MAX_MESSAGES, MAX_MESSAGE_LENGTH } from "./agent-shared";
import { locales } from "./i18n";

// Server-side validation of the /api/agent request body. Kept out of agent-shared
// so the validation library never reaches the browser bundle.
export const agentRequestSchema = z.object({
  locale: z.enum(locales),
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          role: z.literal("user"),
          content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
        }),
        // The agent's previous answers come back as history and can be much longer.
        z.object({
          role: z.literal("assistant"),
          content: z.string().trim().min(1).max(MAX_ANSWER_LENGTH),
        }),
      ]),
    )
    .min(1)
    .max(MAX_MESSAGES)
    .refine((messages) => messages[0]?.role === "user", "first message must be from the user")
    .refine((messages) => messages.at(-1)?.role === "user", "last message must be from the user"),
});
