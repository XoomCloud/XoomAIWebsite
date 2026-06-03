import { CTAButton } from "@/components/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { SITE } from "@/lib/site";

export function CTABlock({
  title = "Book your free AI Workflow Audit",
  subtitle = "30 minutes. No obligation. Walk away with a clear, prioritised plan for where AI can save your team time.",
  primaryLabel = "Book a Free AI Workflow Audit",
  secondaryLabel = "Take the AI Readiness Quiz",
  secondaryHref = "/ai-readiness",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-xa">
        <Reveal className="ring-gradient relative overflow-hidden rounded-3xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-surface-2 via-surface to-background p-10 text-center md:p-16">
            <div className="glow-radial pointer-events-none absolute inset-0" aria-hidden />
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{subtitle}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton booking size="lg" eventLabel="ctablock_primary">
                  {primaryLabel}
                </CTAButton>
                <CTAButton href={secondaryHref} variant="outline" size="lg" eventLabel="ctablock_secondary">
                  {secondaryLabel}
                </CTAButton>
              </div>
              <p className="mt-6 text-sm text-muted-2">
                Prefer to talk now? Call{" "}
                <a href={SITE.phoneHref} className="text-primary hover:underline">
                  {SITE.phone}
                </a>{" "}
                or email{" "}
                <a href={SITE.emailHref} className="text-primary hover:underline">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
