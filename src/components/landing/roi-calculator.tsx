"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calculator, TrendingUp, Clock, ArrowRight } from "lucide-react";

function useAnimatedNumber(target: number, animate: boolean, duration = 700) {
  const [val, setVal] = React.useState(target);
  const prev = React.useRef(target);
  React.useEffect(() => {
    if (!animate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVal(target);
      prev.current = target;
      return;
    }
    const from = prev.current;
    prev.current = target;
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, animate, duration]);
  return val;
}

const AUD = (n: number) => n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function Slider({ label, icon, value, min, max, step, onChange, format }: {
  label: string; icon: React.ReactNode; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted">{icon}{label}</label>
        <span className="font-display text-lg font-semibold text-foreground">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(34,211,238,0.2)] [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary"
        style={{ background: `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-surface-2) ${pct}%)` }}
      />
    </div>
  );
}

export function RoiCalculator() {
  const reduce = useReducedMotion();
  const [employees, setEmployees] = React.useState(10);
  const [rate, setRate] = React.useState(45);
  const [hours, setHours] = React.useState(8);

  // Assume an AI employee reclaims ~70% of the wasted hours.
  const weekly = employees * hours * rate * 0.7;
  const yearly = Math.round(weekly * 52);
  const animatedYearly = useAnimatedNumber(yearly, !reduce);
  const reclaimedHours = Math.round(employees * hours * 0.7 * 52);

  return (
    <div className="ring-gradient rounded-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
        <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden />
        <div className="relative grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Calculator className="size-4" aria-hidden /> ROI Calculator
            </div>
            <Slider label="Team members doing repetitive work" icon={<span className="text-primary">•</span>} value={employees} min={1} max={100} step={1} onChange={setEmployees} format={(v) => `${v}`} />
            <Slider label="Average hourly cost" icon={<span className="text-primary">•</span>} value={rate} min={25} max={150} step={5} onChange={setRate} format={(v) => `${AUD(v)}/hr`} />
            <Slider label="Hours wasted per person each week" icon={<Clock className="size-4 text-primary" />} value={hours} min={1} max={30} step={1} onChange={setHours} format={(v) => `${v} hrs`} />
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 text-center">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">Estimated yearly saving</span>
            <motion.div
              key={yearly}
              initial={reduce ? false : { scale: 0.98, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-2 font-display text-4xl font-bold text-gradient md:text-5xl"
            >
              {AUD(animatedYearly)}
            </motion.div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted">
              <TrendingUp className="size-4 text-success" aria-hidden />
              ~{reclaimedHours.toLocaleString("en-AU")} hours returned / year
            </div>
            <a
              href="#book"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Turn this into reality <ArrowRight className="size-4" />
            </a>
            <p className="mt-3 text-[11px] text-muted-2">Indicative estimate. Actual savings vary by workflow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
