import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentResult } from "@/lib/agent";
import { agentErrors } from "@/lib/agent-shared";

const streamAgentAnswer = vi.fn();
vi.mock("@/lib/agent", () => ({ streamAgentAnswer }));

async function* answer(...items: AgentResult[]) {
  yield* items;
}

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      ...headers,
    },
    body: JSON.stringify(body),
  });

const question = { locale: "pt", messages: [{ role: "user", content: "Quais projetos?" }] };

const readEvents = async (response: Response) =>
  (await response.text())
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

describe("POST /api/agent", () => {
  let POST: (request: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    streamAgentAnswer.mockReset();
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    vi.stubEnv("AGENT_RATE_LIMIT_MAX", "2");
    vi.spyOn(console, "error").mockImplementation(() => {});
    ({ POST } = await import("@/app/api/agent/route"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("streams text deltas as NDJSON", async () => {
    streamAgentAnswer.mockReturnValue(
      answer({ type: "text", text: "O Igor " }, { type: "text", text: "construiu o MonAI." }),
    );

    const response = await POST(post(question));

    expect(response.status).toBe(200);
    expect(await readEvents(response)).toEqual([
      { type: "delta", text: "O Igor " },
      { type: "delta", text: "construiu o MonAI." },
    ]);
    expect(streamAgentAnswer.mock.calls[0][0]).toMatchObject({
      locale: "pt",
      messages: question.messages,
    });
  });

  it("replaces partial text with the standard message on a refusal", async () => {
    streamAgentAnswer.mockReturnValue(answer({ type: "text", text: "Par" }, { type: "refusal" }));

    const events = await readEvents(await POST(post({ ...question, locale: "en" })));

    expect(events.at(-1)).toEqual({ type: "replace", text: agentErrors.en.refusal });
  });

  it("answers with the unavailable message when the API call fails", async () => {
    streamAgentAnswer.mockImplementation(async function* () {
      throw new Error("boom");
    });

    const events = await readEvents(await POST(post(question)));

    expect(events).toEqual([{ type: "replace", text: agentErrors.pt.unavailable }]);
  });

  it.each([
    ["more than 20 messages", { locale: "pt", messages: Array(21).fill(question.messages[0]) }],
    [
      "a message over 1,000 characters",
      { locale: "pt", messages: [{ role: "user", content: "a".repeat(1001) }] },
    ],
    [
      "a conversation that ends with the assistant",
      { locale: "pt", messages: [...question.messages, { role: "assistant", content: "Oi" }] },
    ],
    ["an unknown locale", { ...question, locale: "fr" }],
    ["a non-JSON body", "not json"],
  ])("rejects %s", async (_name, body) => {
    const response = await POST(post(body));

    expect(response.status).toBe(400);
    expect(streamAgentAnswer).not.toHaveBeenCalled();
  });

  it("rejects requests from another origin", async () => {
    const response = await POST(post(question, { origin: "https://evil.example" }));

    expect(response.status).toBe(403);
    expect(streamAgentAnswer).not.toHaveBeenCalled();
  });

  it("accepts the production origin", async () => {
    streamAgentAnswer.mockReturnValue(answer({ type: "text", text: "ok" }));

    const response = await POST(post(question, { origin: "https://igorgaspar.tech" }));

    expect(response.status).toBe(200);
  });

  it("rate limits by IP with a localized message", async () => {
    streamAgentAnswer.mockImplementation(() => answer({ type: "text", text: "ok" }));
    const from = (ip: string) => post(question, { "x-forwarded-for": ip });

    expect((await POST(from("1.1.1.1"))).status).toBe(200);
    expect((await POST(from("1.1.1.1"))).status).toBe(200);

    const limited = await POST(from("1.1.1.1"));
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: agentErrors.pt.rateLimited });

    expect((await POST(from("2.2.2.2"))).status).toBe(200);
  });

  it("ignores client-supplied x-forwarded-for entries when rate limiting", async () => {
    streamAgentAnswer.mockImplementation(() => answer({ type: "text", text: "ok" }));
    // The proxy appends the real address last; the leading entries are forged per request.
    const from = (forged: string) => post(question, { "x-forwarded-for": `${forged}, 9.9.9.9` });

    expect((await POST(from("3.3.3.1"))).status).toBe(200);
    expect((await POST(from("3.3.3.2"))).status).toBe(200);
    expect((await POST(from("3.3.3.3"))).status).toBe(429);
  });

  it("rejects an empty conversation with 400, not a crash", async () => {
    const response = await POST(post({ locale: "pt", messages: [] }));

    expect(response.status).toBe(400);
    expect(streamAgentAnswer).not.toHaveBeenCalled();
  });

  it("stops calling the model once the site-wide daily limit is reached", async () => {
    vi.stubEnv("AGENT_DAILY_LIMIT", "2");
    vi.stubEnv("AGENT_RATE_LIMIT_MAX", "100");
    vi.resetModules();
    ({ POST } = await import("@/app/api/agent/route"));
    streamAgentAnswer.mockImplementation(() => answer({ type: "text", text: "ok" }));
    // Different visitors: the per-IP limit never triggers, only the shared ceiling does.
    const from = (ip: string) => post(question, { "x-forwarded-for": ip });

    expect((await POST(from("4.4.4.1"))).status).toBe(200);
    expect((await POST(from("4.4.4.2"))).status).toBe(200);

    const blocked = await POST(from("4.4.4.3"));
    expect(blocked.status).toBe(503);
    expect(await blocked.json()).toEqual({ error: agentErrors.pt.unavailable });
    expect(streamAgentAnswer).toHaveBeenCalledTimes(2);
  });

  it("returns 503 without calling the model when the API key is missing", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    const response = await POST(post(question));

    expect(response.status).toBe(503);
    expect(streamAgentAnswer).not.toHaveBeenCalled();
  });
});
