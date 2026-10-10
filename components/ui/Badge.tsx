/** Mono badge with a 1px border and a green "live" dot. */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
