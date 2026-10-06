"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/agent-shared";
import { agent, useAgent } from "@/lib/agent-store";
import type { Locale } from "@/lib/i18n";
import { RichText } from "../ui/RichText";
import { AgentIcon } from "./AgentIcon";

export type ChatLabels = {
  chips: string[];
  placeholder: string;
  notice: string;
  send: string;
  stop: string;
  you: string;
  agentName: string;
};

type Props = {
  locale: Locale;
  labels: ChatLabels;
  variant: "inline" | "panel";
  initialDraft?: string;
};

export function ChatBox({ locale, labels, variant, initialDraft = "" }: Props) {
  const { messages, status } = useAgent();
  const [input, setInput] = useState(initialDraft);
  const listRef = useRef<HTMLDivElement>(null);
  const busy = status !== "idle";
  const last = messages.at(-1);

  // Keep the newest text in view while the answer streams in.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const submit = (text: string) => {
    if (busy || !text.trim()) return;
    setInput("");
    void agent.send(text, locale);
  };

  const inputId = `agent-input-${variant}`;
  const showChips = variant === "inline" || messages.length === 0;

  return (
    <div className={variant === "panel" ? "flex min-h-0 flex-1 flex-col" : undefined}>
      {messages.length > 0 && (
        <div
          ref={listRef}
          className={
            variant === "panel"
              ? "min-h-0 flex-1 space-y-4 overflow-y-auto pr-1"
              : "mt-8 max-h-96 space-y-4 overflow-y-auto pr-1"
          }
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <p
                key={message.id}
                className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-accent-2/15 px-4 py-2.5 whitespace-pre-wrap"
              >
                <span className="sr-only">{labels.you}: </span>
                {message.content}
              </p>
            ) : (
              <div key={message.id} className="flex max-w-[92%] gap-3">
                <AgentIcon className="mt-0.5 size-6 shrink-0" />
                <p className={`whitespace-pre-wrap ${message.notice ? "text-muted" : ""}`}>
                  <span className="sr-only">{labels.agentName}: </span>
                  {message.content ? (
                    <RichText text={message.content} />
                  ) : (
                    <span className="agent-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                  {status === "streaming" && message === last && (
                    <span aria-hidden="true" className="agent-cursor" />
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      )}

      {/* Announces each finished answer once, instead of every streamed token. */}
      <p className="sr-only" aria-live="polite">
        {!busy && last?.role === "assistant" ? last.content.replaceAll("**", "") : ""}
      </p>

      {showChips && (
        <ul className={`flex flex-wrap gap-2 ${variant === "panel" ? "mt-auto pt-4" : "mt-8"}`}>
          {labels.chips.map((chip) => (
            <li key={chip}>
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(chip)}
                className="rounded-full border border-accent-2/40 px-4 py-2 text-left text-sm transition-colors hover:border-accent-2 hover:bg-accent-2/10 disabled:opacity-50"
              >
                {chip}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit(input);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          {labels.placeholder}
        </label>
        <input
          id={inputId}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          autoComplete="off"
          enterKeyHint="send"
          placeholder={labels.placeholder}
          className="min-h-12 w-full min-w-0 rounded-xl border border-border bg-bg px-4 text-base placeholder:text-muted focus-visible:outline-accent-2"
        />
        {busy ? (
          <button
            type="button"
            onClick={agent.stop}
            aria-label={labels.stop}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-accent-2 text-accent-2"
          >
            <span aria-hidden="true" className="size-3.5 rounded-sm bg-current" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label={labels.send}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-2 text-white transition-opacity hover:opacity-90"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </form>
      <p className="mt-3 text-xs text-muted">{labels.notice}</p>
    </div>
  );
}
