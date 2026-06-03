import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export type Testimonial = { quote: string; name: string; role: string };

export function TestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <Reveal className="ring-gradient mx-auto max-w-3xl rounded-3xl">
      <figure className="card-surface relative rounded-3xl p-8 md:p-12">
        <Quote className="size-8 text-primary/40" aria-hidden />
        <blockquote className="mt-4 font-display text-xl font-medium leading-relaxed text-foreground md:text-2xl">
          “{quote}”
        </blockquote>
        <figcaption className="mt-6 text-sm">
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-muted"> — {role}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
