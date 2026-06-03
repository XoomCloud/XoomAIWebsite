"use client";

import { motion } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { RevealGroup, revealItem } from "@/components/motion/reveal";

export type PainSolution = { pain: string; solution: string };

/** Side-by-side "problem → XoomAgent fix" rows. */
export function PainSolutionList({ items }: { items: PainSolution[] }) {
  return (
    <RevealGroup className="grid gap-4">
      {items.map((item) => (
        <motion.div
          key={item.pain}
          variants={revealItem}
          className="card-surface grid items-center gap-4 rounded-2xl p-5 md:grid-cols-[1fr_auto_1fr]"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-400">
              <X className="size-4" aria-hidden />
            </span>
            <p className="text-sm text-muted">{item.pain}</p>
          </div>
          <ArrowRight className="mx-auto hidden size-5 text-primary md:block" aria-hidden />
          <div className="flex items-start gap-3 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-4" aria-hidden />
            </span>
            <p className="text-sm font-medium text-foreground">{item.solution}</p>
          </div>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
