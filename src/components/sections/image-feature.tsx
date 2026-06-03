import Image from "next/image";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Image + copy band — adds a human touch and breaks up the grid sections. */
export function ImageFeature({
  image,
  alt,
  eyebrow,
  title,
  body,
  points,
  reverse,
  cta,
  badge,
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  body: string;
  points?: string[];
  reverse?: boolean;
  cta?: { label: string; booking?: boolean; href?: string };
  badge?: string;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <Reveal className={cn(reverse && "lg:order-2")}>
        <div className="ring-gradient relative rounded-3xl">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={image}
              alt={alt}
              width={1400}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 560px"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/25 via-transparent to-[#06b6d4]/15 mix-blend-multiply" aria-hidden />
            {badge && (
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#0b1424] shadow-sm backdrop-blur">
                  {badge}
                </span>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={1} className={cn(reverse && "lg:order-1")}>
        {eyebrow && <Badge variant="solid">{eyebrow}</Badge>}
        <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="mt-4 text-muted">{body}</p>
        {points && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <div className="mt-7">
            <CTAButton booking={cta.booking} href={cta.href} size="lg" eventLabel="imagefeature_cta">
              {cta.label}
            </CTAButton>
          </div>
        )}
      </Reveal>
    </div>
  );
}
