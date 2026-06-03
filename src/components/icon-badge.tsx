import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "violet" | "magenta";

const TONES: Tone[] = ["violet", "cyan", "magenta"];

const toneStyles: Record<Tone, { fill: string; text: string; node: string; ring: string }> = {
  cyan: { fill: "bg-[#06b6d4]/8", text: "text-[#0891b2]", node: "bg-[#06b6d4]", ring: "ring-[#06b6d4]/25" },
  violet: { fill: "bg-[#7c3aed]/8", text: "text-[#7c3aed]", node: "bg-[#7c3aed]", ring: "ring-[#7c3aed]/25" },
  magenta: { fill: "bg-[#c026d3]/8", text: "text-[#c026d3]", node: "bg-[#c026d3]", ring: "ring-[#c026d3]/25" },
};

/**
 * Branded icon tile. Echoes the XOOM logo's angular bracket + node motif:
 * a clipped corner, a gradient hairline, thin-stroke icon and a brand node dot.
 * Tone cycles by `index` so grids never read as a uniform default-icon wall.
 */
export function IconBadge({
  name,
  tone,
  index = 0,
  size = "md",
  className,
}: {
  name: IconName;
  tone?: Tone;
  index?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const t = toneStyles[tone ?? TONES[index % TONES.length]];
  const box = size === "lg" ? "size-14" : size === "sm" ? "size-10" : "size-12";
  const glyph = size === "lg" ? "size-6" : "size-5";

  return (
    <span className={cn("icon-badge rounded-[14px]", box, className)}>
      {/* angular clipped tile with a tone hairline */}
      <span
        className={cn("absolute inset-0 rounded-[14px] ring-1 ring-inset", t.fill, t.ring)}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%)" }}
        aria-hidden
      />
      {/* brand node dot (logo motif) */}
      <span className={cn("absolute -left-0.5 -top-0.5 size-2 rounded-full ring-2 ring-[var(--color-surface)]", t.node)} aria-hidden />
      <Icon name={name} className={cn("relative z-10 [stroke-width:1.6]", glyph, t.text)} />
    </span>
  );
}
