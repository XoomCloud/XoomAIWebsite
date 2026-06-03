import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "outline" | "solid" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "default" && "bg-primary/10 text-primary ring-1 ring-inset ring-primary/25",
        variant === "outline" && "border border-border text-muted",
        variant === "solid" && "bg-accent/15 text-accent ring-1 ring-inset ring-accent/30",
        className,
      )}
      {...props}
    />
  );
}
