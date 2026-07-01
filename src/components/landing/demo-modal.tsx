"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";

/** "Watch 90 Second Demo" secondary CTA + lightbox. Drop a real video URL via prop. */
export function DemoModal({ videoUrl, className }: { videoUrl?: string; className?: string }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-border bg-white/[0.03] px-7 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-white/[0.06]"}
      >
        <span className="grid size-7 place-items-center rounded-full bg-primary/20 text-primary">
          <Play className="size-3.5 translate-x-px" aria-hidden fill="currentColor" />
        </span>
        Watch 90 Second Demo
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Product demo video"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="ring-gradient w-full max-w-3xl rounded-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0d1018]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="size-4" />
                </button>
                <div className="aspect-video w-full">
                  {videoUrl ? (
                    <iframe
                      src={videoUrl}
                      title="XoomAI 90 second demo"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#101826] to-[#0d1018] text-center">
                      <div>
                        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-inset ring-primary/30">
                          <Play className="size-7 translate-x-0.5" fill="currentColor" aria-hidden />
                        </span>
                        <p className="mt-4 font-display text-lg font-semibold text-foreground">90-second demo</p>
                        <p className="mt-1 text-sm text-muted">Video coming soon — book a live walkthrough instead.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
