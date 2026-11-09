"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ajuda, commandList } from "@/content/ajuda";

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Table of every command with a search box (filters by command and description). */
export function AjudaCommands() {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const rows = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return commandList;
    return commandList.filter((row) => fold(`${row.command} ${row.does}`).includes(q));
  }, [query]);

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {ajuda.commands.search}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={ajuda.commands.searchPlaceholder}
        autoComplete="off"
        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent"
      />
      <p aria-live="polite" className="mt-2 text-sm text-muted">
        {rows.length ? ajuda.commands.count(rows.length) : ajuda.commands.empty}
      </p>

      {rows.length > 0 && (
        <div
          role="region"
          aria-label={ajuda.commands.search}
          tabIndex={0}
          className="mt-4 overflow-x-auto rounded-xl border border-border"
        >
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Comando
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  O que faz
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Plano
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.command} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm">{row.command}</td>
                  <td className="px-4 py-3 text-muted">
                    {row.does}{" "}
                    <Link
                      href={`${ajuda.basePath}/${row.topic}`}
                      className="link whitespace-nowrap"
                    >
                      Ver como
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{row.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
