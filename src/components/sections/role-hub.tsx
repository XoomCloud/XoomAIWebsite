"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  TrendingUp, Headphones, Briefcase, Banknote, Workflow, Sparkles, Users, BookOpen,
  type LucideIcon,
} from "lucide-react";

type Node = { label: string; icon: LucideIcon; tone: string };

// 8 roles arranged around the centre (3×3 grid: 3 top, 2 sides, 3 bottom).
const NODES: Node[] = [
  { label: "Sales Rep", icon: TrendingUp, tone: "#0e9fc0" },
  { label: "Executive Assistant", icon: Briefcase, tone: "#6d3bf5" },
  { label: "Marketing", icon: Sparkles, tone: "#c026d3" },
  { label: "Customer Service", icon: Headphones, tone: "#0e9fc0" },
  { label: "Accounts Officer", icon: Banknote, tone: "#0f9d6b" },
  { label: "HR & People", icon: Users, tone: "#c026d3" },
  { label: "Operations", icon: Workflow, tone: "#6d3bf5" },
  { label: "Knowledge", icon: BookOpen, tone: "#0e9fc0" },
];

// endpoints (%) of each node's cell centre in the 3×3 grid, matching render order
const ENDPOINTS = [
  [16.67, 16.67], [50, 16.67], [83.33, 16.67],
  [16.67, 50], [83.33, 50],
  [16.67, 83.33], [50, 83.33], [83.33, 83.33],
];

function NodeCard({ node, i }: { node: Node; i: number }) {
  const Icon = node.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.06 }}
      className="relative z-10 flex items-center gap-2 self-center justify-self-center rounded-xl border border-border bg-surface px-2.5 py-2 shadow-[0_8px_20px_-12px_rgba(10,12,18,0.35)]"
    >
      <span
        className="grid size-7 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${node.tone}1f`, color: node.tone }}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="text-[11px] font-semibold leading-tight text-foreground">{node.label}</span>
    </motion.div>
  );
}

export function RoleHub() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
      {/* connectors */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="hub-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6d3bf5" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0e9fc0" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {ENDPOINTS.map(([x, y], i) => (
          <g key={i}>
            <line x1="50" y1="50" x2={x} y2={y} stroke="url(#hub-line)" strokeWidth="0.5" strokeDasharray="1.4 1.6" />
            <circle cx={x} cy={y} r="0.9" fill="#6d3bf5" />
          </g>
        ))}
        <circle cx="50" cy="50" r="1.1" fill="#0e9fc0" />
      </svg>

      {/* 3×3 grid: 8 role nodes around the XoomAgent centre */}
      <div className="relative grid h-full grid-cols-3 grid-rows-3 gap-2">
        <NodeCard node={NODES[0]} i={0} />
        <NodeCard node={NODES[1]} i={1} />
        <NodeCard node={NODES[2]} i={2} />

        <NodeCard node={NODES[3]} i={3} />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="ring-gradient relative z-20 self-center justify-self-center rounded-2xl"
        >
          <span className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 40px -6px rgba(109,59,245,0.45)" }} aria-hidden />
          <div className="grid size-24 place-items-center rounded-2xl border border-border bg-surface p-3 md:size-28">
            <Image
              src="/images/XoomAgent_Square.png"
              alt="XoomAgent™"
              width={2180}
              height={1472}
              className="h-auto w-full object-contain"
            />
          </div>
        </motion.div>
        <NodeCard node={NODES[4]} i={4} />

        <NodeCard node={NODES[5]} i={5} />
        <NodeCard node={NODES[6]} i={6} />
        <NodeCard node={NODES[7]} i={7} />
      </div>
    </div>
  );
}
