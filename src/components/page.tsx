import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { cx } from "@/lib/typo";
import { Figure, INK, PAPER } from "./pictograms";

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
    <nav aria-label="Ścieżka" className={cx("label text-ink-soft", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-x-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-ink-faint">
                /
              </span>
            )}
            {crumb.href && i < all.length - 1 ? (
              <Link href={crumb.href} className="transition-colors hover:text-red">
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

/** The top of every page: breadcrumbs, the h1, a lead, a line of facts and an optional picture. */
export function PageHeader({
  crumbs,
  title,
  titleId,
  lead,
  meta,
  aside,
  className,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("wrap pt-8 md:pt-12", className)}>
      <Breadcrumbs crumbs={crumbs} />
      <div className="mt-8 grid items-end gap-10 md:mt-12 lg:grid-cols-12">
        <div className={aside ? "lg:col-span-8" : "lg:col-span-10"}>
          <h1 id={titleId} className="text-[clamp(2.75rem,7.4vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            {title}
          </h1>
          {lead && <div className="mt-6 max-w-2xl text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-ink-soft">{lead}</div>}
          {meta && <div className="label mt-6 text-ink-faint">{meta}</div>}
        </div>
        {aside && <div className="lg:col-span-4">{aside}</div>}
      </div>
    </header>
  );
}

/** A titled block of a page. Every section starts on a hairline. */
export function Section({
  id,
  title,
  intro,
  aside,
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cx("wrap scroll-mt-6 py-14 md:py-20", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-ink pt-5">
        <h2 id={id} className="text-[clamp(1.85rem,3.4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.015em]">
          {title}
        </h2>
        {aside && <div className="label text-ink-soft">{aside}</div>}
      </div>
      {intro && <p className="mt-3 max-w-2xl text-ink-soft">{intro}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** Closes every page: one line about the test and the button. */
export function TestPromo({ title, text }: { title: ReactNode; text: ReactNode }) {
  return (
    <section aria-label="Test Dziadersa" className="bg-ink text-paper">
      <div className="wrap flex flex-col gap-10 py-14 md:flex-row md:items-center md:py-16">
        <svg viewBox="-2 -1 56 97" className="hidden h-36 shrink-0 md:block" aria-hidden="true">
          <Figure color={PAPER} cutout={INK} right="point" />
        </svg>
        <div className="flex-1">
          <p className="text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.015em]">{title}</p>
          <p className="mt-3 max-w-xl text-paper/75">{text}</p>
        </div>
        <Link href="/test" className="btn self-start bg-paper text-ink hover:bg-red hover:text-paper md:self-center">
          Wykonaj test <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/** Previous / next links at the foot of an entry. */
export function Pager({
  label,
  previous,
  next,
}: {
  label: string;
  previous?: { href: string; label: string; title: string };
  next?: { href: string; label: string; title: string };
}) {
  return (
    <nav aria-label={label} className="mt-16 grid gap-6 border-t border-ink pt-6 sm:grid-cols-2">
      {previous ? (
        <Link href={previous.href} className="group">
          <span className="label text-ink-soft">← {previous.label}</span>
          <span className="mt-1 block text-xl font-bold leading-tight transition-colors group-hover:text-red">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className="group sm:text-right">
          <span className="label text-ink-soft">{next.label} →</span>
          <span className="mt-1 block text-xl font-bold leading-tight transition-colors group-hover:text-red">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
