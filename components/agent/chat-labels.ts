import type { Dictionary } from "@/content";

/** Everything the inline chat and the floating panel need from a dictionary. */
export function buildChatLabels(dict: Dictionary) {
  const chat = {
    chips: dict.agent.chips,
    placeholder: dict.agent.placeholder,
    notice: dict.agent.notice,
    send: dict.ui.send,
    stop: dict.ui.stop,
    you: dict.ui.you,
    agentName: dict.ui.agentName,
  };
  const dock = {
    ...chat,
    title: dict.agent.title,
    openAgent: dict.ui.openAgent,
    close: dict.ui.close,
    email: dict.contact.emailLabel,
  };
  return { chat, dock };
}
