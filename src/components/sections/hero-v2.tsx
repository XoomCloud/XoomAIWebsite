"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Phone, TrendingUp, Headphones, Banknote, Workflow, Users, Sparkles,
  ArrowRight, ArrowDown, type LucideIcon,
} from "lucide-react";
import { CTAButton } from "@/components/cta-button";

/* ── The company "nervous system" ───────────────────────────────────────── */

type Dept = { id: string; label: string; x: number; y: number; color: string; task: string; icon: LucideIcon };

const CORE = { x: 50, y: 31 };

// viewBox is 0 0 100 62 — coordinates are fixed (no randomness → no hydration drift)
const DEPTS: Dept[] = [
  { id: "marketing", label: "Marketing", x: 50, y: 7, color: "#6d3bf5", task: "Campaign scheduled", icon: Sparkles },
  { id: "sales", label: "Sales", x: 80, y: 15, color: "#22d3ee", task: "Lead qualified", icon: TrendingUp },
  { id: "reception", label: "Reception", x: 20, y: 16, color: "#22d3ee", task: "Call answered", icon: Phone },
  { id: "finance", label: "Finance", x: 86, y: 40, color: "#10b981", task: "Invoice processed", icon: Banknote },
  { id: "support", label: "Support", x: 14, y: 40, color: "#d017c9", task: "Ticket closed", icon: Headphones },
  { id: "hr", label: "HR", x: 68, y: 56, color: "#f59e0b", task: "Candidate screened", icon: Users },
  { id: "ops", label: "Operations", x: 32, y: 56, color: "#6d3bf5", task: "Workflow run", icon: Workflow },
];

function NervousSystem({ animate }: { animate: boolean }) {
  return (
    <svg
      viewBox="0 0 100 62"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        {DEPTS.map((d) => (
          <linearGradient key={d.id} id={`edge-${d.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor={d.color} stopOpacity="0.15" />
          </linearGradient>
        ))}
      </defs>

      {/* edges */}
      {DEPTS.map((d) => (
        <line
          key={`l-${d.id}`}
          x1={CORE.x} y1={CORE.y} x2={d.x} y2={d.y}
          stroke={`url(#edge-${d.id})`} strokeWidth="0.22"
        />
      ))}

      {/* travelling work pulses */}
      {animate &&
        DEPTS.map((d, i) => {
          const outbound = i % 2 === 0; // dispatch vs return — feels two-way
          const from = outbound ? CORE : d;
          const to = outbound ? d : CORE;
          return (
            <motion.circle
              key={`p-${d.id}`}
              r="0.7"
              fill={d.color}
              initial={{ cx: from.x, cy: from.y, opacity: 0 }}
              animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.1, delay: i * 0.45, repeat: Infinity, repeatDelay: 1.4, ease: "linear" }}
              style={{ filter: "drop-shadow(0 0 1.4px currentColor)" }}
            />
          );
        })}

      {/* department nodes */}
      {DEPTS.map((d, i) => (
        <g key={`n-${d.id}`}>
          <motion.circle
            cx={d.x} cy={d.y} r="2.4" fill={d.color} opacity={0.14}
            animate={animate ? { r: [2.2, 3.4, 2.2], opacity: [0.12, 0.28, 0.12] } : undefined}
            transition={{ duration: 2.1, delay: i * 0.45 + 1, repeat: Infinity, repeatDelay: 1.4 }}
          />
          <circle cx={d.x} cy={d.y} r="1.1" fill={d.color} />
        </g>
      ))}

      {/* core */}
      <circle cx={CORE.x} cy={CORE.y} r="9" fill="url(#coreGlow)" />
      <motion.circle
        cx={CORE.x} cy={CORE.y} r="2.6" fill="none" stroke="#22d3ee" strokeWidth="0.18" opacity={0.5}
        animate={animate ? { r: [2.6, 6, 2.6], opacity: [0.5, 0, 0.5] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
      <circle cx={CORE.x} cy={CORE.y} r="2" fill="#eafcff" />
    </svg>
  );
}

/* ── Live task feed ─────────────────────────────────────────────────────── */

const FEED = DEPTS.map((d) => ({ label: d.task, dept: d.label, color: d.color, icon: d.icon }));

function TaskFeed({ animate }: { animate: boolean }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!animate) return;
    const t = setInterval(() => setTick((v) => v + 1), 1700);
    return () => clearInterval(t);
  }, [animate]);

  // newest three, newest first
  const items = [0, 1, 2].map((o) => {
    const idx = ((tick - o) % FEED.length + FEED.length) % FEED.length;
    return { ...FEED[idx], key: `${tick - o}` };
  });

  return (
    <div className="panel w-full overflow-hidden p-2.5">
      <div className="mb-2 flex items-center gap-2 px-2 pt-1 text-[11px] font-medium text-muted">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        Live · your AI workforce, working now
      </div>
      <div className="relative space-y-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.key}
                layout
                initial={animate ? { opacity: 0, y: -10, scale: 0.98 } : false}
                animate={{ opacity: i === 0 ? 1 : 0.55 - i * 0.12, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${it.color}1f`, color: it.color }}>
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="flex-1 text-sm text-foreground">{it.label}</span>
                <span className="text-[11px] text-muted-2">{it.dept}</span>
                <svg viewBox="0 0 24 24" className="size-4 text-success" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Count-up proof ─────────────────────────────────────────────────────── */

function useCountUp(target: number, animate: boolean, duration = 1600) {
  const [val, setVal] = React.useState(animate ? 0 : target);
  React.useEffect(() => {
    if (!animate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVal(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, animate]);
  return val;
}

function Stat({ target, suffix, label, animate }: { target: number; suffix?: string; label: string; animate: boolean }) {
  const v = useCountUp(target, animate);
  return (
    <div>
      <div className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {v.toLocaleString("en-AU")}{suffix}
      </div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export function HeroV2() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  // pointer parallax (disabled on coarse pointers / reduced motion)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const fine = React.useRef(false);

  React.useEffect(() => {
    fine.current =
      !reduce && typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  }, [reduce]);

  function onPointerMove(e: React.PointerEvent) {
    if (!fine.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 22);
  }

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      onPointerMove={onPointerMove}
      className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* background layers */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <motion.div className="pointer-events-none absolute inset-0 opacity-90" style={{ x: sx, y: sy }} aria-hidden>
        <NervousSystem animate={animate} />
      </motion.div>
      {/* legibility vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% 42%, rgba(6,7,11,0) 30%, rgba(6,7,11,0.55) 70%, rgba(6,7,11,0.92) 100%)" }}
        aria-hidden
      />

      <div className="container-xa relative flex flex-1 flex-col justify-center pt-28 pb-16 md:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* copy */}
          <div className="max-w-2xl">
            <motion.span
              initial={animate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="eyebrow text-[color:var(--color-muted)]"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              The AI Workforce Platform · Australian made
            </motion.span>

            <motion.h1
              initial={animate ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
              className="display-hero mt-6 text-foreground"
            >
              Hire your first{" "}
              <span className="text-gradient">AI&nbsp;employee.</span>
            </motion.h1>

            <motion.p
              initial={animate ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
            >
              XoomAgent™ puts a digital employee in every department — answering calls, replying to email,
              qualifying leads, processing invoices and running workflows inside Microsoft 365, Google
              Workspace and your CRM. Fully managed by XoomAI.
            </motion.p>

            <motion.div
              initial={animate ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.25 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <CTAButton booking size="lg" eventLabel="herov2_primary">
                Build My AI Employee <ArrowRight className="size-4" />
              </CTAButton>
              <CTAButton href="#workforce" variant="outline" size="lg" eventLabel="herov2_secondary">
                See it in action
              </CTAButton>
            </motion.div>

            {/* proof */}
            <motion.div
              initial={animate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6"
            >
              <Stat target={48000} suffix="+" label="Tasks automated" animate={animate} />
              <Stat target={12400} suffix="+" label="Calls answered" animate={animate} />
              <Stat target={9200} suffix="+" label="Hours returned" animate={animate} />
            </motion.div>
            <p className="mt-3 text-[11px] text-muted-2">Indicative aggregate activity across XoomAgent™ deployments.</p>
          </div>

          {/* live feed */}
          <motion.div
            initial={animate ? { opacity: 0, y: 24, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="hidden lg:block"
          >
            <TaskFeed animate={animate} />
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#workforce"
        className="relative z-10 mx-auto mb-7 flex flex-col items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-2 transition-colors hover:text-foreground"
      >
        Inside the workforce
        <motion.span
          animate={animate ? { y: [0, 5, 0] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" aria-hidden />
        </motion.span>
      </a>
    </section>
  );
}
