import Image from "next/image";
import Link from "next/link";
import { ajuda, type Block } from "@/content/ajuda";
import { CopyButton } from "../ui/CopyButton";

const isUrl = (text: string) => /^https?:\/\//.test(text);

function Cell({ text }: { text: string }) {
  if (isUrl(text)) {
    return (
      <a href={text} target="_blank" rel="noopener noreferrer" className="link break-all">
        Abrir guia
      </a>
    );
  }
  return <>{text}</>;
}

/** Renders the blocks of one help section (see content/ajuda.ts). */
export function AjudaBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-muted">
                {block.text}
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg font-semibold">
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul key={i} className="list-disc space-y-2 pl-5 text-muted marker:text-accent">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="space-y-4">
                {block.items.map((step, n) => (
                  <li
                    key={step.title}
                    className="rounded-xl border border-border bg-surface p-5"
                  >
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-mono text-sm text-accent">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    {step.body && <p className="mt-2 text-muted">{step.body}</p>}
                    {step.code && <CodeBox text={step.code} />}
                  </li>
                ))}
              </ol>
            );
          case "code":
            return <CodeBox key={i} text={block.text} />;
          case "note":
            return (
              <p
                key={i}
                role="note"
                className={`rounded-xl border-l-4 bg-surface px-5 py-4 text-sm ${
                  block.tone === "warn" ? "border-l-amber-500" : "border-l-accent"
                }`}
              >
                <span className="font-semibold">
                  {block.tone === "warn" ? "Atenção: " : "Bom saber: "}
                </span>
                <span className="text-muted">{block.text}</span>
              </p>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead className="bg-surface text-muted">
                    <tr>
                      {block.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-3 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]} className="border-t border-border align-top">
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={`px-4 py-3 ${c === 0 ? "font-mono text-xs sm:text-sm" : "text-muted"}`}
                          >
                            <Cell text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "image":
            return (
              <figure key={i} className="max-w-xs">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  sizes="(max-width: 640px) 80vw, 320px"
                  className="rounded-xl border border-border"
                />
                <figcaption className="mt-2 text-sm text-muted">{block.caption}</figcaption>
              </figure>
            );
          case "links":
            return (
              <ul key={i} className="flex flex-wrap gap-3">
                {block.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="btn">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}

/** A command to type in the bot's chat, with a copy button. */
function CodeBox({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-start justify-between gap-3 rounded-xl border border-border bg-bg p-3">
      <pre className="min-w-0 overflow-x-auto font-mono text-sm">{text}</pre>
      <CopyButton value={text} label={ajuda.topicPage.copy} copiedLabel={ajuda.topicPage.copied} />
    </div>
  );
}
