import type { Dictionary } from "@/content";

export function AgentInline({ dict }: { dict: Dictionary }) {
  const { agent, ui } = dict;

  return (
    <section id="agent" aria-labelledby="agent-title" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-3xl rounded-2xl border border-accent-2/30 bg-surface p-6 shadow-[0_0_80px_-20px_color-mix(in_srgb,var(--accent-2)_45%,transparent)] sm:p-10">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-accent-2/50"
            >
              <span className="size-3 rounded-full bg-accent-2" />
            </span>
            <div>
              <h2 id="agent-title" className="text-3xl font-semibold sm:text-4xl">
                {agent.title}
              </h2>
              <p className="mt-3 text-muted">{agent.support}</p>
            </div>
          </div>

          {/* Static shell: the chat is wired up in the next build step. */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {agent.chips.map((chip) => (
              <li key={chip}>
                <button
                  type="button"
                  disabled
                  className="rounded-full border border-accent-2/40 px-4 py-2 text-left text-sm text-text"
                >
                  {chip}
                </button>
              </li>
            ))}
          </ul>

          <form className="mt-4 flex gap-2">
            <label htmlFor="agent-input" className="sr-only">
              {agent.placeholder}
            </label>
            <input
              id="agent-input"
              type="text"
              disabled
              placeholder={agent.placeholder}
              className="min-h-12 w-full rounded-xl border border-border bg-bg px-4 text-base placeholder:text-muted"
            />
            <button
              type="submit"
              disabled
              aria-label={ui.send}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-2 text-white opacity-60"
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
          </form>
          <p className="mt-3 text-xs text-muted">{agent.notice}</p>
        </div>
      </div>
    </section>
  );
}
