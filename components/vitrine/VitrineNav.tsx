import Link from "next/link";
import { pt } from "@/content/pt";
import { vitrine } from "@/content/vitrine";
import { LocaleSwitch } from "../layout/LocaleSwitch";
import { NavMenu } from "../layout/NavMenu";
import { WhatsAppLink } from "../robo/WhatsAppLink";
import { ThemeToggle } from "../ui/ThemeToggle";

/** Header of the products showcase: same shell as the portfolio nav. */
export function VitrineNav() {
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

        <nav aria-label={pt.ui.mainNav} className="hidden lg:block">
          <ul className="relative flex items-center gap-8 text-sm text-muted">
            {vitrine.nav.map((link) =>
              link.href.startsWith("#") ? (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-nav-link
                    className="py-2 transition-colors hover:text-text aria-[current]:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 py-2 transition-colors hover:text-text"
                  >
                    {link.highlight && (
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                    )}
                    {link.label}
                  </Link>
                </li>
              ),
            )}
            <li
              aria-hidden="true"
              data-nav-underline
              className="pointer-events-none absolute -bottom-1 left-0 h-px w-px origin-left bg-accent opacity-0 transition-[transform,opacity] duration-300 motion-reduce:transition-none"
            />
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale="pt" label={pt.ui.language} hrefs={{ pt: "/" }} />
          <ThemeToggle label={pt.ui.themeToggle} />
          <WhatsAppLink
            draft={vitrine.draft}
            className="btn btn-solid hidden min-h-10 px-4 py-2 text-sm sm:inline-flex"
          >
            {vitrine.cta}
          </WhatsAppLink>
          <NavMenu label={pt.ui.menu} navLabel={pt.ui.mainNav} links={vitrine.nav} />
        </div>
      </div>
    </header>
  );
}
