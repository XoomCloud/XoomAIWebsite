import { Reveal } from "@/components/motion/reveal";

export type Stat = { value: string; label: string; note?: string };

export function StatsBand({ stats, caption }: { stats: Stat[]; caption?: string }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i}>
            <div className="card-surface h-full rounded-2xl p-6 text-center">
              <div className="font-display text-3xl font-bold text-gradient md:text-4xl">{s.value}</div>
              <div className="mt-2 text-sm font-medium text-foreground">{s.label}</div>
              {s.note && <div className="mt-1 text-xs text-muted-2">{s.note}</div>}
            </div>
          </Reveal>
        ))}
      </div>
      {caption && <p className="mt-4 text-center text-xs text-muted-2">{caption}</p>}
    </div>
  );
}
