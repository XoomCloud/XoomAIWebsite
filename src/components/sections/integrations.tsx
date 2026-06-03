import { Plug } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/** Logo-free integration chips (no third-party trademark assets required). */
export function Integrations({
  items,
  title = "Connects to the tools you already use",
}: {
  items: string[];
  title?: string;
}) {
  return (
    <Reveal className="card-surface rounded-3xl p-8 md:p-10">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Plug className="size-4" aria-hidden />
        {title}
      </div>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border bg-surface-2/60 px-4 py-2 text-sm text-muted transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
