import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/cta-button";
import { Reveal } from "@/components/motion/reveal";

/** Compact hero for service and industry pages. The single <h1> for the page. */
export function InnerHero({
  eyebrow,
  title,
  subtitle,
  primaryLabel = "Book a Free AI Workflow Audit",
  secondaryLabel = "See What XoomAgent Automates",
  secondaryHref = "/xoomagent",
  stats,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  stats?: { value: string; label: string }[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-x-0 -top-10 h-80" aria-hidden />
      <div className="container-xa relative pb-12 pt-8 md:pt-10">
        <Reveal className="max-w-3xl">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] md:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton booking size="lg" eventLabel="innerhero_primary">
              {primaryLabel}
            </CTAButton>
            <CTAButton href={secondaryHref} variant="outline" size="lg" eventLabel="innerhero_secondary">
              {secondaryLabel}
            </CTAButton>
          </div>
        </Reveal>

        {stats && (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i}>
                <div className="card-surface rounded-2xl p-5">
                  <div className="font-display text-2xl font-bold text-gradient md:text-3xl">{s.value}</div>
                  <div className="mt-1 text-sm text-muted">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
