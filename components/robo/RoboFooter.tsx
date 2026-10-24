import Link from "next/link";
import { robo } from "@/content/robo";
import { WhatsAppLink } from "./WhatsAppLink";

export function RoboFooter() {
  return (
    <footer className="border-t border-border pb-20 sm:pb-0">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted">
        <p>{robo.footer}</p>
        <Link href="/" className="py-2 transition-colors hover:text-text">
          {robo.backHome}
        </Link>
      </div>
      {/* Bottom bar on phones, where the header button is hidden; the footer leaves room for it.
          It lives inside the footer so it stays within a landmark. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/90 p-3 backdrop-blur-md sm:hidden">
        <WhatsAppLink draft={robo.draft} className="btn btn-solid w-full">
          {robo.cta}
        </WhatsAppLink>
      </div>
    </footer>
  );
}
