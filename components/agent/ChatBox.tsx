"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MAX_MESSAGE_LENGTH } from "@/lib/agent-shared";
import { agent, useAgent } from "@/lib/agent-store";
import type { Locale } from "@/lib/i18n";
import { AgentIcon } from "./AgentIcon";
import { ChatText } from "./ChatText";

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

/**
 * The clicked chip flies up and lands as the visitor's message in the chat
 * (FLIP from the chip's position to the new bubble; spec 3.3.2).
 */
function flyToBubble(from: DOMRect, list: HTMLElement | null) {
  const bubble = Array.from(list?.querySelectorAll<HTMLElement>("[data-user-message]") ?? []).at(
    -1,
  );
  if (!list || !bubble || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  list.scrollTop = list.scrollHeight;
  const to = bubble.getBoundingClientRect();
  const ghost = bubble.cloneNode(true) as HTMLElement;
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${to.left}px`,
    top: `${to.top}px`,
    width: `${to.width}px`,
    maxWidth: "none",
    margin: "0",
    zIndex: "70",
    pointerEvents: "none",
    transformOrigin: "top left",
  });
  // Inside the panel the ghost must live in the dialog to stay above it.
  (list.closest("dialog") ?? document.body).append(ghost);
  bubble.style.visibility = "hidden";

  const animation = ghost.animate(
    [
      {
        transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
        borderRadius: "999px",
        opacity: 0.6,
      },
      { transform: "none", opacity: 1 },
    ],
    { duration: 450, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
  );

  // The real bubble always shows up, even if a background tab pauses the animation.
  const land = () => {
    ghost.remove();
    bubble.style.visibility = "";
  };
  const timeout = new Promise((resolve) => setTimeout(resolve, 650));
  void Promise.race([animation.finished.catch(() => undefined), timeout]).then(land);
}

export function ChatBox({ locale, labels, variant, initialDraft = "" }: Props) {
  const { messages, status } = useAgent();
  const [input, setInput] = useState(initialDraft);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = status !== "idle";
  const last = messages.at(-1);

  // Switching language re-mounts the page but not the store: start a fresh conversation then.
  useEffect(() => agent.syncLocale(locale), [locale]);

  // The field is as tall as its text (including a prefilled draft), up to its max height.
  useEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight + 2}px`;
  }, [input]);

  // Keep the newest text in view while the answer streams in.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const submit = (text: string) => {
    if (busy || !text.trim()) return false;
    setInput("");
    void agent.send(text, locale);
    return true;
  };

  const submitChip = (chip: HTMLElement, text: string) => {
    const from = chip.getBoundingClientRect();
    let sent = false;
    // The message must be in the DOM before the flight can target it.
    flushSync(() => {
      sent = submit(text);
    });
    if (sent) flyToBubble(from, listRef.current);
  };

  const inputId = `agent-input-${variant}`;
  const showChips = variant === "inline" || messages.length === 0;

  return (
    <div className={variant === "panel" ? "flex min-h-0 flex-1 flex-col" : undefined}>
      {messages.length > 0 && (
        <div
          ref={listRef}
          data-native-scroll
          className={
            variant === "panel"
              ? "chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto pr-2"
              : "chat-scroll mt-8 max-h-96 space-y-4 overflow-y-auto pr-2"
          }
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <p
                key={message.id}
                data-user-message
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
                    <ChatText text={message.content} />
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
                onClick={(event) => submitChip(event.currentTarget, chip)}
                className="rounded-full border border-accent-2/40 px-4 py-2 text-left text-sm transition-colors hover:border-accent-2 hover:bg-accent-2/10 disabled:opacity-50"
              >
                {chip}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="mt-4 flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit(input);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          {labels.placeholder}
        </label>
        {/* Grows with the message, up to a few lines. Enter sends; Shift+Enter breaks the line. */}
        <textarea
          id={inputId}
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
            event.preventDefault();
            submit(input);
          }}
          maxLength={MAX_MESSAGE_LENGTH}
          autoComplete="off"
          enterKeyHint="send"
          placeholder={labels.placeholder}
          className="chat-scroll max-h-40 min-h-12 w-full min-w-0 resize-none rounded-xl border border-border bg-bg px-4 py-3 text-base leading-6 placeholder:text-muted focus-visible:outline-accent-2"
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
