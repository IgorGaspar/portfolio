/** The agent's mark: a violet core inside a ring. */
export function AgentIcon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full border border-accent-2/50 ${className}`}
    >
      <span className="size-[30%] rounded-full bg-accent-2" />
    </span>
  );
}
