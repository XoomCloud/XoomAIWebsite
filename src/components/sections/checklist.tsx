"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { RevealGroup, revealItem } from "@/components/motion/reveal";

/** "What we deliver" / capability checklist with two-column layout. */
export function Checklist({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <RevealGroup className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <motion.div
          key={item}
          variants={revealItem}
          className="card-surface flex items-start gap-3 rounded-xl p-4"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <span className="text-sm text-foreground">{item}</span>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
