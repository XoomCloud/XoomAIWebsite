"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, FileText, Banknote, BarChart3, ShieldCheck, Users } from "lucide-react";

const ROWS = [
  { icon: TrendingUp, text: "Qualified 4 new leads and updated HubSpot", dept: "Sales", color: "#22d3ee" },
  { icon: FileText, text: "Checked and filed this week's timesheets", dept: "Admin", color: "#6d3bf5" },
  { icon: Banknote, text: "Matched 12 supplier bills to POs in Xero", dept: "Finance", color: "#10b981" },
  { icon: BarChart3, text: "Sent the weekly operations report", dept: "Ops", color: "#f59e0b" },
];

export function LandingHero() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      {/* animated blue-glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-grid absolute inset-0 opacity-50" />
        <motion.div
          className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.16), rgba(109,59,245,0.08) 45%, transparent 70%)" }}
          animate={animate ? { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-xa grid items-center gap-14 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5" aria-hidden /> Built for Australian businesses · 10 to 100 staff
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
            Hire Your{" "}
            <span className="text-gradient">AI Employees.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            We build, connect and run AI employees across your sales, admin and finance, inside Microsoft
            365, HubSpot and Xero. Done for you, live in weeks, no tech team needed.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#book"
              className="inline-flex h-13 items-center justify-center rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_34px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Book Free Strategy Session
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-primary" aria-hidden />
              Trusted by Aussie business owners
            </span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" aria-hidden /> Australian owned · No lock-in</span>
          </div>
        </div>

        {/* hero visual: glass "AI employees" activity card, an example day across departments */}
        <div className="ring-gradient relative rounded-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#6d3bf5] to-[#0891b2] text-white font-display text-sm font-bold">AI</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Your AI Employees</p>
                  <p className="text-xs text-muted">Working now · Sales, Admin, Finance, Ops</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                <span className="size-1.5 rounded-full bg-success" /> Online
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {ROWS.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.li
                    key={r.text}
                    initial={animate ? { opacity: 0, x: 12 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.6 + i * 0.15 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] px-3.5 py-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${r.color}22`, color: r.color }}>
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="flex-1 text-sm text-foreground">
                      {r.text}
                      <span className="ml-2 text-[10.5px] uppercase tracking-[0.08em] text-muted-2">{r.dept}</span>
                    </span>
                    <svg viewBox="0 0 24 24" className="size-4 text-success" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-4 rounded-xl bg-gradient-to-r from-[#6d3bf5]/15 to-[#0891b2]/15 p-3 text-center text-xs text-muted">
              Example day. Every action is logged and you approve anything that goes out.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
