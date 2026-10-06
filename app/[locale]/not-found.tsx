import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { getDictionary } from "@/content";
import { defaultLocale, hasLocale, localeHome } from "@/lib/i18n";

export default async function NotFound() {
  const param = await rootLocale();
  const locale = param && hasLocale(param) ? param : defaultLocale;
  const { ui } = getDictionary(locale);

  return (
    <main className="container-page flex min-h-svh flex-col items-start justify-center gap-6">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="text-section font-semibold">{ui.notFoundTitle}</h1>
      <p className="text-lead text-muted">{ui.notFoundText}</p>
      <Link href={localeHome(locale)} className="btn">
        {ui.notFoundBack}
      </Link>
    </main>
  );
}
