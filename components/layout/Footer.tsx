import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { LocaleSwitch } from "./LocaleSwitch";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted">
        <p>{dict.footer.text}</p>
        <LocaleSwitch locale={locale} label={dict.ui.language} />
      </div>
    </footer>
  );
}
