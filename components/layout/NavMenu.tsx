"use client";

import { useEffect, useRef } from "react";

type Props = {
  label: string;
  navLabel: string;
  links: {
    href: string;
    label: string;
    accent?: boolean;
    smallOnly?: boolean;
    /** Opens in a new tab (WhatsApp). */
    external?: boolean;
  }[];
};

/** Mobile menu. A native <details>, so it opens without JavaScript; this adds closing. */
export function NavMenu({ label, navLabel, links }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const menu = ref.current;
    if (!menu) return;

    const close = () => menu.removeAttribute("open");
    const onPointerDown = (event: PointerEvent) => {
      if (!menu.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu.open) return;
      close();
      menu.querySelector("summary")?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details ref={ref} className="relative lg:hidden">
      <summary className="inline-flex h-10 list-none items-center rounded-full border border-border px-4 text-sm text-muted">
        {label}
      </summary>
      <nav
        aria-label={navLabel}
        className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-surface p-2 shadow-xl"
      >
        <ul className="text-sm">
          {links.map((link) => (
            <li key={link.href + link.label} className={link.smallOnly ? "sm:hidden" : undefined}>
              <a
                href={link.href}
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                onClick={() => ref.current?.removeAttribute("open")}
                className={`block rounded-lg px-3 py-2.5 hover:bg-bg ${link.accent ? "text-accent" : ""}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
