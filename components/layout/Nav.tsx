import Link from "next/link";
import type { Dictionary } from "@/content";
import { localeHome, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";
import { NavMenu } from "./NavMenu";

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: "#projects", label: dict.nav.projects },
    { href: "#how-i-build", label: dict.nav.howIBuild },
    { href: "#journey", label: dict.nav.journey },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header
      data-nav
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md transition-colors duration-300 data-[top]:border-transparent data-[top]:bg-transparent data-[top]:backdrop-blur-none"
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href={localeHome(locale)}
          className="font-display text-lg font-bold tracking-tight"
          aria-label="Igor Gaspar"
        >
          IG<span className="text-accent">.</span>
        </Link>

        <nav aria-label={dict.ui.mainNav} className="hidden lg:block">
          <ul className="relative flex items-center gap-8 text-sm text-muted">
            {links.map((link) => (
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
            {/* Slides under the link of the section in view (positioned by lib/motion). */}
            <li
              aria-hidden="true"
              data-nav-underline
              className="pointer-events-none absolute -bottom-1 left-0 h-px w-px origin-left bg-accent opacity-0 transition-[transform,opacity] duration-300 motion-reduce:transition-none"
            />
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} label={dict.ui.language} />
          <ThemeToggle label={dict.ui.themeToggle} />
          <a
            href="#contact"
            className="btn btn-solid hidden min-h-10 px-4 py-2 text-sm sm:inline-flex"
          >
            {dict.nav.cta}
          </a>

          <NavMenu
            label={dict.ui.menu}
            navLabel={dict.ui.mainNav}
            links={[
              ...links,
              { href: "#contact", label: dict.nav.cta, accent: true, smallOnly: true },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
