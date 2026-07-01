"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

type T = { quote: string; name: string; role: string };

// Placeholder testimonials — replace with verified client quotes.
const TESTIMONIALS: T[] = [
  { quote: "Our AI employee now handles every after-hours enquiry and books the job before we've even seen it. It's like adding a full-time coordinator overnight.", name: "Placeholder — Director", role: "Construction, Gold Coast" },
  { quote: "Admin used to eat two days a week. XoomAgent processes our invoices and updates the system automatically — my team finally does the work that matters.", name: "Placeholder — Principal", role: "Accounting Firm, Brisbane" },
  { quote: "Leads get a reply in under a minute, day or night. Our conversion has genuinely lifted and nothing slips through the cracks anymore.", name: "Placeholder — Owner", role: "Professional Services, Sydney" },
];

export function Testimonials() {
  const reduce = useReducedMotion();
  const [i, setI] = React.useState(0);
  const go = (d: number) => setI((v) => (v + d + TESTIMONIALS.length) % TESTIMONIALS.length);

  React.useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, [reduce]);

  const t = TESTIMONIALS[i];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="ring-gradient rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-white/[0.03] p-8 backdrop-blur-sm md:p-12">
          <Quote className="size-9 text-primary/30" aria-hidden />
          <div className="min-h-[8.5rem]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="mt-3"
              >
                <p className="font-display text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                  “{t.quote}”
                </p>
                <footer className="mt-5 text-sm">
                  <span className="font-semibold text-foreground">{t.name}</span>
                  <span className="text-muted"> · {t.role}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-4" fill="currentColor" aria-hidden />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid size-9 place-items-center rounded-full border border-border text-muted hover:text-foreground">
                <ChevronLeft className="size-4" />
              </button>
              {TESTIMONIALS.map((_, d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setI(d)}
                  aria-label={`Go to testimonial ${d + 1}`}
                  className={`h-1.5 rounded-full transition-all ${d === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                />
              ))}
              <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid size-9 place-items-center rounded-full border border-border text-muted hover:text-foreground">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
