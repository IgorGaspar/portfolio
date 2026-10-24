export const contact = {
  email: "igorfgaspar@outlook.com",
  linkedin: { label: "linkedin.com/in/igorfgaspar", href: "https://linkedin.com/in/igorfgaspar" },
  github: { label: "github.com/IgorGaspar", href: "https://github.com/IgorGaspar" },
} as const;

export const mailto = (subject: string) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;

/** WhatsApp is the sales channel of the offers bot (/robo-de-ofertas). */
const whatsappNumber = "5511986893761";

export const whatsapp = (text: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
