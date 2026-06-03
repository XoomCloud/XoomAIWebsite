import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbSchema } from "./json-ld";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="container-xa pt-28 md:pt-32">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {full.map((c, i) => {
          const last = i === full.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {last ? (
                <span className="text-foreground" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              )}
              {!last && <ChevronRight className="size-3.5 text-muted-2" aria-hidden />}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbSchema(full)} />
    </nav>
  );
}
