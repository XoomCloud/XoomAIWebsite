"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type IconName } from "@/components/icon";
import { IconBadge } from "@/components/icon-badge";
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
      {cards.map((c, i) => (
        <motion.div key={c.href} variants={revealItem}>
          <Link
            href={c.href}
            className="card-surface group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-32px_rgba(124,58,237,0.4)]"
          >
            <div className="flex items-start justify-between">
              <IconBadge name={c.icon} index={i} className="transition-transform duration-300 group-hover:scale-105" />
              <ArrowUpRight className="size-5 text-muted-2 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
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
