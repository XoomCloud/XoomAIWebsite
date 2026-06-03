import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/cta-button";
import { Reveal } from "@/components/motion/reveal";

export type PricingProps = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  highlight?: boolean;
  ctaLabel?: string;
  note?: string;
};

export function PricingCard({
  name,
  price,
  period = "/month",
  blurb,
  features,
  highlight,
  ctaLabel = "Book a Free AI Workflow Audit",
  note,
}: PricingProps) {
  return (
    <Reveal className={highlight ? "ring-gradient rounded-3xl" : ""}>
      <div className="card-surface relative h-full overflow-hidden rounded-3xl p-8">
        {highlight && (
          <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden />
        )}
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">{name}</h3>
            {highlight && <Badge>Most popular</Badge>}
          </div>
          {blurb && <p className="mt-2 text-sm text-muted">{blurb}</p>}
          <div className="mt-6 flex items-end gap-1">
            <span className="font-display text-4xl font-bold">{price}</span>
            <span className="mb-1 text-sm text-muted">{period}</span>
          </div>
          {note && <p className="mt-1 text-xs text-muted-2">{note}</p>}
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          <CTAButton
            booking
            size="lg"
            variant={highlight ? "primary" : "outline"}
            className="mt-8 w-full"
            eventLabel={`pricing_${name.toLowerCase().replace(/\s+/g, "_")}`}
          >
            {ctaLabel}
          </CTAButton>
        </div>
      </div>
    </Reveal>
  );
}
