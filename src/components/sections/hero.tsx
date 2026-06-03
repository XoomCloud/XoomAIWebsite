"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/cta-button";
import { Icon, type IconName } from "@/components/icon";

const ease = [0.16, 1, 0.3, 1] as const;

/** Large homepage / product hero with animated reveal and a "live agent" panel. */
export function Hero({
  badge,
  title,
  highlight,
  subtitle,
  primary,
  secondary,
  panel,
}: {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle: string;
  primary: { label: string; booking?: boolean; href?: string };
  secondary?: { label: string; href: string };
  panel?: { label: string; items: { icon: IconName; text: string; status: string }[] };
}) {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="glow-radial pointer-events-none absolute inset-x-0 -top-20 -z-10 h-[60vh]" aria-hidden />
      <div className="container-xa grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
        <div>
          {badge && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
              <Badge>
                <span className="size-1.5 rounded-full bg-primary" /> {badge}
              </Badge>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl"
          >
            {title} {highlight && <span className="text-gradient">{highlight}</span>}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted md:text-xl"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <CTAButton booking={primary.booking} href={primary.href} size="lg" eventLabel="hero_primary">
              {primary.label}
            </CTAButton>
            {secondary && (
              <CTAButton href={secondary.href} variant="outline" size="lg" eventLabel="hero_secondary">
                {secondary.label}
              </CTAButton>
            )}
          </motion.div>
        </div>

        {panel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="ring-gradient relative rounded-3xl"
          >
            <div className="card-surface rounded-3xl p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Icon name="Bot" className="size-4" />
                  </span>
                  {panel.label}
                </div>
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="size-2 animate-pulse rounded-full bg-success" /> Live
                </span>
              </div>
              <ul className="mt-3 space-y-2.5">
                {panel.items.map((item, i) => (
                  <motion.li
                    key={item.text}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.12 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 px-3.5 py-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={item.icon} className="size-4" />
                    </span>
                    <span className="flex-1 text-sm text-foreground">{item.text}</span>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                      {item.status}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
