import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { AgentIcon } from "../agent/AgentIcon";
import { ChatBox, type ChatLabels } from "../agent/ChatBox";

type Props = { locale: Locale; dict: Dictionary; chatLabels: ChatLabels };

export function AgentInline({ locale, dict, chatLabels }: Props) {
  const { agent } = dict;

  return (
    <section id="agent" aria-labelledby="agent-title" className="section">
      <div className="container-page">
        <div
          data-reveal="agent"
          className="mx-auto max-w-3xl rounded-2xl border border-accent-2/30 bg-surface p-6 shadow-[0_0_80px_-20px_color-mix(in_srgb,var(--accent-2)_45%,transparent)] sm:p-10"
        >
          <div className="flex items-start gap-4">
            <AgentIcon className="mt-1 size-10 shrink-0" />
            <div>
              <h2 id="agent-title" className="text-3xl font-semibold sm:text-4xl">
                {agent.title}
              </h2>
              <p className="mt-3 text-muted">{agent.support}</p>
            </div>
          </div>

          <ChatBox locale={locale} labels={chatLabels} variant="inline" />
        </div>
      </div>
    </section>
  );
}
