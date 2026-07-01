"use client";

import * as React from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Minimal, distraction-free top bar for the paid landing page (no site nav). */
export function LandingNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-[#06070b]/85 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="container-xa flex h-16 items-center justify-between">
        <Image
          src="/images/xoomai-logo-white.png"
          alt="XoomAI"
          width={991}
          height={285}
          priority
          className="h-8 w-auto"
        />
        <div className="flex items-center gap-4">
          <a href={SITE.phoneHref} className="hidden items-center gap-2 text-sm font-semibold text-foreground hover:text-primary sm:inline-flex">
            <Phone className="size-4 text-primary" aria-hidden /> {SITE.phone}
          </a>
          <a
            href="#book"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-0.5"
          >
            Book Free Session
          </a>
        </div>
      </div>
    </header>
  );
}
