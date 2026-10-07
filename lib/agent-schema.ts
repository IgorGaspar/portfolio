import { z } from "zod";
import { MAX_MESSAGES, MAX_MESSAGE_LENGTH } from "./agent-shared";
import { locales } from "./i18n";

// Server-side validation of the /api/agent request body. Kept out of agent-shared
// so the validation library never reaches the browser bundle.
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
