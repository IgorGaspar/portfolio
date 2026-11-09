import Link from "next/link";
import { pt } from "@/content/pt";
import { ajuda } from "@/content/ajuda";
import { robo } from "@/content/robo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { WhatsAppLink } from "../robo/WhatsAppLink";

/** Header of the help center: a plain bar with a way back to the sales page and to WhatsApp. */
export function AjudaNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight"
            aria-label="Igor Gaspar"
          >
            IG<span className="text-accent">.</span>
          </Link>
          <span aria-hidden="true" className="h-5 w-px bg-border" />
          <Link
            href={ajuda.basePath}
            className="py-2 text-sm text-muted transition-colors hover:text-text"
          >
            {ajuda.index.eyebrow}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/robo-de-ofertas"
            className="hidden py-2 text-sm text-muted transition-colors hover:text-text sm:inline"
          >
            Robô de ofertas
          </Link>
          <ThemeToggle label={pt.ui.themeToggle} />
          <WhatsAppLink
            draft={ajuda.topicPage.stuckDraft}
            className="btn btn-solid min-h-10 px-4 py-2 text-sm"
          >
            {robo.cta}
          </WhatsAppLink>
        </div>
      </div>
    </header>
  );
}
