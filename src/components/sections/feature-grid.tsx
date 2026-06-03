"use client";

import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { RevealGroup, revealItem } from "@/components/motion/reveal";
import { Icon, type IconName } from "@/components/icon";
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
      {features.map((f) => (
        <motion.div key={f.title} variants={revealItem}>
          <Card className="group h-full hover:-translate-y-1 hover:ring-1 hover:ring-primary/30">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-colors group-hover:bg-primary/15">
              <Icon name={f.icon} className="size-5" />
            </span>
            <CardTitle className="mt-4">{f.title}</CardTitle>
            <CardDescription>{f.description}</CardDescription>
          </Card>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
