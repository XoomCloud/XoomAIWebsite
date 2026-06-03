"use client";

import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { RevealGroup, revealItem } from "@/components/motion/reveal";
import { IconBadge } from "@/components/icon-badge";
import { type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

export type Feature = {
  icon: IconName;
  title: string;
  description: string;
};

export function FeatureGrid({
  features,
  columns = 4,
}: {
  features: Feature[];
  columns?: 2 | 3 | 4;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <RevealGroup className={cn("grid gap-5", cols)}>
      {features.map((f, i) => (
        <motion.div key={f.title} variants={revealItem}>
          <Card className="group h-full hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-32px_rgba(124,58,237,0.4)]">
            <IconBadge name={f.icon} index={i} className="transition-transform duration-300 group-hover:scale-105" />
            <CardTitle className="mt-5">{f.title}</CardTitle>
            <CardDescription>{f.description}</CardDescription>
          </Card>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
