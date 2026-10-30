"use client";

import { agent } from "@/lib/agent-store";

type Props = {
  /** Fallback destination when JavaScript is unavailable (the inline chat). */
  href: string;
  /** First message placed in the chat input, ready to edit and send. */
  draft?: string;
  className?: string;
  children: React.ReactNode;
};

/** Link that opens the agent panel, optionally with a prefilled first message. */
export function AgentCta({ href, draft, className, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        agent.openPanel(draft);
      }}
    >
      {children}
    </a>
  );
}
