"use client";

import { useEffect, useState } from "react";

type Props = { value: string; label: string; copiedLabel: string };

export function CopyButton({ value, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard blocked: the address stays selectable as plain text.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-text"
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
