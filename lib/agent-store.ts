"use client";

import { useSyncExternalStore } from "react";
import {
  MAX_MESSAGES,
  agentErrors,
  type AgentEvent,
  type AgentMessage,
} from "./agent-shared";
import type { Locale } from "./i18n";

export type ChatMessage = AgentMessage & {
  id: number;
  /** Error and refusal notices are shown but never sent back as history. */
  notice?: boolean;
};

type State = {
  messages: ChatMessage[];
  status: "idle" | "waiting" | "streaming";
  panelOpen: boolean;
  /** Text placed in the panel input when it opens (hero and contact CTAs). */
  draft: string;
};

// Module-level store: the conversation lives in the browser only and survives
// the root layout re-render that happens when the visitor switches language.
let state: State = { messages: [], status: "idle", panelOpen: false, draft: "" };
const listeners = new Set<() => void>();
let nextId = 1;
let controller: AbortController | undefined;

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function updateLast(patch: Partial<ChatMessage>, status?: State["status"]) {
  const messages = state.messages.slice();
  messages[messages.length - 1] = { ...messages[messages.length - 1], ...patch };
  setState(status ? { messages, status } : { messages });
}

/** Last messages that fit the API contract: no notices, starting with a user turn. */
function toHistory(messages: ChatMessage[]): AgentMessage[] {
  const history = messages
    // Drop notices and the questions they answered: neither got a real reply.
    .filter((message, i) => !message.notice && message.content && !messages[i + 1]?.notice)
    .slice(-MAX_MESSAGES)
    .map(({ role, content }) => ({ role, content }));
  while (history.length && history[0].role !== "user") history.shift();
  return history;
}

async function send(text: string, locale: Locale) {
  const content = text.trim();
  if (!content || state.status !== "idle") return;

  const question: ChatMessage = { id: nextId++, role: "user", content };
  const history = toHistory([...state.messages, question]);
  setState({
    messages: [...state.messages, question, { id: nextId++, role: "assistant", content: "" }],
    status: "waiting",
    draft: "",
  });

  controller = new AbortController();
  const fail = (message: string) => updateLast({ content: message, notice: true });

  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, messages: history }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      const data: { error?: string } | null = await response.json().catch(() => null);
      fail(data?.error ?? agentErrors[locale].unavailable);
      return;
    }

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    let answer = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line) continue;
        const event = JSON.parse(line) as AgentEvent;
        if (event.type === "delta") {
          answer += event.text;
          updateLast({ content: answer }, "streaming");
        } else {
          fail(event.text);
        }
      }
    }

    if (!state.messages.at(-1)?.content) fail(agentErrors[locale].unavailable);
  } catch {
    if (controller.signal.aborted) {
      // Stopped by the visitor: keep what arrived, drop an empty bubble.
      if (!state.messages.at(-1)?.content) setState({ messages: state.messages.slice(0, -1) });
    } else {
      fail(agentErrors[locale].unavailable);
    }
  } finally {
    controller = undefined;
    setState({ status: "idle" });
  }
}

export const agent = {
  send,
  stop: () => controller?.abort(),
  openPanel: (draft = "") => setState({ panelOpen: true, draft }),
  /** Closing the chat also cancels a request in flight. */
  closePanel: () => {
    controller?.abort();
    setState({ panelOpen: false });
  },
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const serverState: State = { messages: [], status: "idle", panelOpen: false, draft: "" };

export const useAgent = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
