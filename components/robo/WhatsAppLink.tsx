import { whatsapp } from "@/lib/contact";

type Props = {
  draft: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Opens a WhatsApp chat with Igor, with the message already typed. */
export function WhatsAppLink({ draft, className, children, ...rest }: Props) {
  return (
    <a
      href={whatsapp(draft)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
