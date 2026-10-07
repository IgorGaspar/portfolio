const TOKEN =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)\s]+\)|https?:\/\/[^\s)]+[^\s).,;:!?])/g;

const linkProps = { target: "_blank", rel: "noopener noreferrer", className: "link break-words" };

/** Renders an agent answer: plain text plus **bold**, [label](url) links and bare URLs. */
export function ChatText({ text }: { text: string }) {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={i} href={link[2]} {...linkProps}>
          {link[1]}
        </a>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} {...linkProps}>
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }

    return part;
  });
}
