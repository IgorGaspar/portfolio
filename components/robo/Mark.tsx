/** Check or cross used in the plan and setup lists. */
export function Mark({ included }: { included: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`mt-1 size-4 shrink-0 ${included ? "text-accent" : "text-muted opacity-60"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {included ? <path d="m3 8.5 3.2 3L13 4.5" /> : <path d="m4.5 4.5 7 7m0-7-7 7" />}
    </svg>
  );
}
