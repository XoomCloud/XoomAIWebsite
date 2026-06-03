"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Icon, type IconName } from "@/components/icon";
import { RevealGroup, revealItem } from "@/components/motion/reveal";

export type LinkCard = {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  meta?: string;
};

/** Linked cards used for service and industry directories. */
export function CardGrid({ cards, columns = 3 }: { cards: LinkCard[]; columns?: 2 | 3 }) {
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <RevealGroup className={`grid gap-5 ${cols}`}>
      {cards.map((c) => (
        <motion.div key={c.href} variants={revealItem}>
          <Link
            href={c.href}
            className="card-surface group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-primary/30"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary ring-1 ring-inset ring-primary/20">
                <Icon name={c.icon} className="size-5" />
              </span>
              <ArrowUpRight className="size-5 text-muted-2 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.description}</p>
            {c.meta && <p className="mt-4 text-xs font-medium uppercase tracking-wide text-primary">{c.meta}</p>}
          </Link>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
