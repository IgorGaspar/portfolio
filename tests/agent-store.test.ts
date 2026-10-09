import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ndjson = (text: string) =>
  new Response(JSON.stringify({ type: "delta", text }) + "\n", {
    headers: { "Content-Type": "application/x-ndjson" },
  });

describe("agent store", () => {
  let store: typeof import("@/lib/agent-store");

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn(async () => ndjson("Resposta.")));
    store = await import("@/lib/agent-store");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the conversation while the language stays the same", async () => {
    store.agent.syncLocale("pt");
    await store.agent.send("Quais projetos?", "pt");
    store.agent.syncLocale("pt");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe("/api/agent");
  });

  it("starts a fresh conversation when the language changes", async () => {
    store.agent.syncLocale("pt");
    await store.agent.send("Quais projetos?", "pt");
    expect(store.agent.getState().messages).toHaveLength(2);

    store.agent.syncLocale("en");
    expect(store.agent.getState().messages).toHaveLength(0);
    expect(store.agent.getState().status).toBe("idle");
  });
});
