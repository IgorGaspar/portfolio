import Image from "next/image";
import Link from "next/link";
import { vitrine } from "@/content/vitrine";
import { WhatsAppLink } from "../robo/WhatsAppLink";
import { Badge } from "../ui/Badge";
import { SectionHeading } from "../ui/SectionHeading";

/** One card per product or service, in the same format so the grid can grow. */
export function VitrineProducts() {
  const { products } = vitrine;

  return (
    <section aria-labelledby="products-title" className="section">
      <div className="container-page">
        <SectionHeading id="products-title" title={products.title} subtitle={products.subtitle} />

        <ul className="mt-16 grid gap-8 lg:grid-cols-2">
          {products.items.map((item) => (
            <li key={item.id} data-reveal="up" className="flex">
              <article
                aria-labelledby={`product-${item.id}`}
                className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
              >
                {item.image && (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="aspect-[4/3] h-auto w-full border-b border-border object-cover object-top"
                  />
                )}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div>
                    <Badge>{item.badge}</Badge>
                  </div>
                  <h3 id={`product-${item.id}`} className="mt-5 text-2xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted">{item.body}</p>
                  {item.example && (
                    <p className="mt-5 rounded-xl border border-border p-4 text-sm text-muted">
                      <span className="block font-mono text-xs uppercase tracking-widest">
                        {products.exampleLabel}: {item.example.label}
                      </span>
                      <span className="mt-2 block">{item.example.text}</span>
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                    <WhatsAppLink draft={item.cta.draft} className="btn btn-solid">
                      {item.cta.label}
                    </WhatsAppLink>
                    <Link href={item.howItWasMade} className="link py-2 text-sm">
                      {products.howItWasMade} →
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
