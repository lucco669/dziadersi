import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { cx } from "@/lib/typo";

export type Crumb = { label: string; href?: string };

/** schema.org data in a script tag, with "<" escaped so content can't close it. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Instytut", href: "/" }, ...crumbs].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${site.url}${crumb.href === "/" ? "" : crumb.href}` } : {}),
    })),
  };
}

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Instytut", href: "/" }, ...crumbs];
  return (
    <nav aria-label="Ścieżka" className={cx("kicker text-ink-faint", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {crumb.href && i < all.length - 1 ? (
              <Link href={crumb.href} className="transition-colors hover:text-ink">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className="text-ink">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Page-level counterpart of SectionHeading: same rule and kicker, with the h1. */
export function PageHeading({
  kicker,
  aside,
  title,
  lead,
  className,
}: {
  kicker: ReactNode;
  aside?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      <div className="kicker flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
        <p>{kicker}</p>
        {aside && <p className="text-ink-faint">{aside}</p>}
      </div>
      <h1 className="mt-8 max-w-5xl font-display text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.9] tracking-[-0.035em] md:mt-10">
        {title}
      </h1>
      {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">{lead}</p>}
    </header>
  );
}

/** Green band that sends readers to the test. */
export function TestCallout({ title, text }: { title: ReactNode; text: ReactNode }) {
  return (
    <section aria-label="Test Dziadersa" className="bg-green text-paper">
      <div className="wrap grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="kicker text-paper/70">
            Laboratorium <span className="mx-1.5 opacity-50">/</span> Formularz IBD-T1
          </p>
          <p className="mt-5 font-display text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]">
            {title}
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/80">{text}</p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Link href="/test" className="btn bg-paper text-green hover:bg-paper-light">
            Wykonaj test <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
