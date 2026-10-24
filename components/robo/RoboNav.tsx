import Link from "next/link";
import { pt } from "@/content/pt";
import { robo } from "@/content/robo";
import { NavMenu } from "../layout/NavMenu";
import { ThemeToggle } from "../ui/ThemeToggle";
import { WhatsAppLink } from "./WhatsAppLink";

/** Header of the offers-bot page: same shell as the portfolio nav, with the page's own sections. */
export function RoboNav() {
  return (
    <header
      data-nav
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md transition-colors duration-300 data-[top]:border-transparent data-[top]:bg-transparent data-[top]:backdrop-blur-none"
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight"
          aria-label="Igor Gaspar"
        >
          IG<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="relative flex items-center gap-8 text-sm text-muted">
            {robo.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-nav-link
                  className="py-2 transition-colors hover:text-text aria-[current]:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li
              aria-hidden="true"
              data-nav-underline
              className="pointer-events-none absolute -bottom-1 left-0 h-px w-px origin-left bg-accent opacity-0 transition-[transform,opacity] duration-300 motion-reduce:transition-none"
            />
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle label={pt.ui.themeToggle} />
          <WhatsAppLink
            draft={robo.draft}
            className="btn btn-solid hidden min-h-10 px-4 py-2 text-sm sm:inline-flex"
          >
            {robo.cta}
          </WhatsAppLink>
          {/* No WhatsApp entry in the menu: on phones the bottom bar (RoboFooter) carries it. */}
          <NavMenu label={pt.ui.menu} navLabel="Seções da página" links={robo.nav} />
        </div>
      </div>
    </header>
  );
}
