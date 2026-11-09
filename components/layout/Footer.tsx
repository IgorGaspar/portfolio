import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { LocaleSwitch } from "./LocaleSwitch";

type Props = {
  locale: Locale;
  dict: Dictionary;
  localeHrefs?: Partial<Record<Locale, string>>;
};

export function Footer({ locale, dict, localeHrefs }: Props) {
  return (
    // The bottom padding keeps the language switch clear of the agent mascot resting in the
    // corner (components/agent/AgentDock) when the page is scrolled to the end.
    <footer className="border-t border-border pb-16">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted">
        <p>{dict.footer.text}</p>
        <LocaleSwitch locale={locale} label={dict.ui.language} hrefs={localeHrefs} />
      </div>
    </footer>
  );
}
