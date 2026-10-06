import Link from "next/link";
import type { Dictionary } from "@/content";
import { localeHome, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: "#projects", label: dict.nav.projects },
    { href: "#how-i-build", label: dict.nav.howIBuild },
    { href: "#journey", label: dict.nav.journey },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href={localeHome(locale)}
          className="font-display text-lg font-bold tracking-tight"
          aria-label="Igor Gaspar"
        >
          IG<span className="text-accent">.</span>
        </Link>

        <nav aria-label={dict.ui.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm text-muted">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="py-2 transition-colors hover:text-text">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} label={dict.ui.language} />
          <ThemeToggle label={dict.ui.themeToggle} />
          <a href="#contact" className="btn btn-solid hidden min-h-10 px-4 py-2 text-sm sm:inline-flex">
            {dict.nav.cta}
          </a>

          <details className="relative lg:hidden">
            <summary className="inline-flex h-10 list-none items-center rounded-full border border-border px-4 text-sm text-muted">
              {dict.ui.menu}
            </summary>
            <nav
              aria-label={dict.ui.mainNav}
              className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-surface p-2 shadow-xl"
            >
              <ul className="text-sm">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="block rounded-lg px-3 py-2.5 hover:bg-bg">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="sm:hidden">
                  <a href="#contact" className="block rounded-lg px-3 py-2.5 text-accent hover:bg-bg">
                    {dict.nav.cta}
                  </a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
