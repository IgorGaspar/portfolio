import Link from "next/link";
import { htmlLang, localeHome, locales, type Locale } from "@/lib/i18n";

export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2 font-mono text-sm">
      {locales.map((item, i) => (
        <span key={item} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-border">
              |
            </span>
          )}
          <Link
            href={localeHome(item)}
            prefetch={false}
            hrefLang={htmlLang[item]}
            lang={htmlLang[item]}
            aria-current={item === locale ? "true" : undefined}
            className={
              item === locale
                ? "px-1 py-2 text-text"
                : "px-1 py-2 text-muted transition-colors hover:text-text"
            }
          >
            {item.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
