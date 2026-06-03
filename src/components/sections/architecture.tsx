"use client";

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/icon";

const ease = [0.16, 1, 0.3, 1] as const;

const controlPlane: { icon: IconName; label: string }[] = [
  { icon: "Users", label: "Swarm & Agent Management" },
  { icon: "CalendarClock", label: "Task Planning & Scheduling" },
  { icon: "MessageSquare", label: "Communication & Orchestration" },
  { icon: "Brain", label: "Memory & Knowledge" },
  { icon: "ShieldCheck", label: "Security & Governance" },
  { icon: "Gauge", label: "Monitoring & Observability" },
];

const core: { icon: IconName; label: string; sub: string }[] = [
  { icon: "Database", label: "Memory", sub: "Short & long-term" },
  { icon: "BookOpen", label: "Knowledge", sub: "Vector DB & graph" },
  { icon: "Settings", label: "Tools", sub: "Built-in & custom" },
  { icon: "Clock", label: "Schedulers", sub: "Cron & automation" },
  { icon: "Plug", label: "Connectors", sub: "APIs, data, queues" },
];

function Layer({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** On-brand, responsive rendering of the XOOM AI OS high-level architecture. */
export function Architecture() {
  return (
    <div className="ring-gradient relative overflow-hidden rounded-3xl">
      <div className="relative space-y-4 bg-gradient-to-b from-surface-2/80 to-surface p-5 md:p-8">
        <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden />

        {/* Control plane */}
        <Layer>
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-5">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Management Layer · Control Plane
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {controlPlane.map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background/40 px-2 py-3 text-center">
                  <Icon name={c.icon} className="size-5 text-accent" />
                  <span className="text-[11px] font-medium leading-tight text-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Layer>

        {/* Runtime row */}
        <Layer delay={0.1}>
          <div className="grid items-stretch gap-3 lg:grid-cols-[0.8fr_1.4fr_0.8fr]">
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-primary">Clients & Access</p>
              <div className="flex justify-center gap-4">
                {(["CLI", "API", "Web UI"] as const).map((x, i) => (
                  <div key={x} className="flex flex-col items-center gap-1.5">
                    <Icon name={(["Settings", "Network", "Globe"] as IconName[])[i]} className="size-5 text-primary" />
                    <span className="text-[11px] text-muted">{x}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ring-gradient relative rounded-2xl">
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 p-5 text-center">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Icon name="Bot" className="size-5" />
                </span>
                <p className="mt-3 font-display text-lg font-bold">XoomAgent Runtime</p>
                <p className="mt-1 text-xs text-muted">Autonomous agents that execute, collaborate and complete tasks.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-success/30 bg-success/[0.06] p-4">
              <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-success">Integrations</p>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <Icon name="Boxes" className="size-5 text-success" />
                  <span className="text-[11px] text-muted">MCP Servers</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Icon name="Plug" className="size-5 text-success" />
                  <span className="text-[11px] text-muted">External Systems</span>
                </div>
              </div>
            </div>
          </div>
        </Layer>

        {/* Core capability row */}
        <Layer delay={0.2}>
          <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-border bg-background/30 p-5 sm:grid-cols-3 lg:grid-cols-5">
            {core.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface/50 px-2 py-3 text-center">
                <Icon name={c.icon} className="size-5 text-primary" />
                <span className="text-xs font-semibold text-foreground">{c.label}</span>
                <span className="text-[10px] text-muted-2">{c.sub}</span>
              </div>
            ))}
          </div>
        </Layer>

        {/* Works with */}
        <Layer delay={0.3}>
          <div className="rounded-2xl border border-border bg-background/30 p-5">
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-2">Works with the platforms you trust</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["OpenAI", "Anthropic", "Google", "Meta", "Microsoft", "AWS", "NVIDIA", "PostgreSQL", "MongoDB", "Redis", "Pinecone", "& more"].map((p) => (
                <span key={p} className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">{p}</span>
              ))}
            </div>
          </div>
        </Layer>
      </div>
    </div>
  );
}
