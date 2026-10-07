import { streamAgentAnswer } from "@/lib/agent";
import { agentRequestSchema } from "@/lib/agent-schema";
import { agentErrors, type AgentEvent } from "@/lib/agent-shared";
import { defaultLocale, hasLocale, siteUrl } from "@/lib/i18n";
import { checkRateLimit } from "@/lib/rate-limit";

const allowedHosts = new Set([new URL(siteUrl).host, `www.${new URL(siteUrl).host}`]);

/** Only the site itself may call the agent. Same-host requests cover local dev and previews. */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  try {
    const { host } = new URL(origin);
    return allowedHosts.has(host) || host === request.headers.get("host");
  } catch {
    return false;
  }
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

const errorResponse = (message: string, status: number) =>
  Response.json({ error: message }, { status });

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  // The locale only picks the language of error messages until the body is validated.
  const rawLocale = (body as { locale?: unknown } | null)?.locale;
  const locale = typeof rawLocale === "string" && hasLocale(rawLocale) ? rawLocale : defaultLocale;
  const errors = agentErrors[locale];

  if (!isAllowedOrigin(request)) return errorResponse(errors.unavailable, 403);

  const parsed = agentRequestSchema.safeParse(body);
  if (!parsed.success) return errorResponse(errors.unavailable, 400);

  const { success } = await checkRateLimit(clientIp(request));
  if (!success) return errorResponse(errors.rateLimited, 429);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[agent] ANTHROPIC_API_KEY is not set");
    return errorResponse(errors.unavailable, 503);
  }

  const encoder = new TextEncoder();
  // Cancels the Anthropic call when the visitor closes the chat or leaves the page.
  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AgentEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      try {
        const answer = streamAgentAnswer({
          messages: parsed.data.messages,
          locale: parsed.data.locale,
          signal: abort.signal,
        });

        for await (const item of answer) {
          send(
            item.type === "text"
              ? { type: "delta", text: item.text }
              : { type: "replace", text: errors.refusal },
          );
        }
      } catch (error) {
        if (abort.signal.aborted) return;
        console.error("[agent] request failed", error);
        send({ type: "replace", text: errors.unavailable });
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed by a cancelled request.
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
