"use client";

import { motion } from "framer-motion";
import { RevealGroup, revealItem } from "@/components/motion/reveal";

export type Step = { title: string; description: string };

export function ProcessTimeline({ steps }: { steps: Step[] }) {
  return (
    <RevealGroup className="relative grid gap-6 md:grid-cols-5">
      <div
        className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block"
        aria-hidden
      />
      {steps.map((step, i) => (
        <motion.div key={step.title} variants={revealItem} className="relative">
          <div className="relative z-10 grid size-14 place-items-center rounded-2xl border border-border bg-surface font-display text-lg font-bold text-primary ring-1 ring-inset ring-primary/20">
            {String(i + 1).padStart(2, "0")}
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
