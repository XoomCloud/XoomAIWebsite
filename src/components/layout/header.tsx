"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/cta-button";
import { ConversionEvents } from "@/lib/analytics";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="container-xa flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center" aria-label="XoomAI home">
          <Image
            src="/images/xoomai-logo-dark.png"
            alt="XoomAI — powering business intelligence"
            width={991}
            height={285}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {MAIN_NAV.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-60" aria-hidden />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-72 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="card-surface overflow-hidden rounded-2xl p-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2"
                      >
                        <span className="text-sm font-medium text-foreground">{child.label}</span>
                        {child.description && (
                          <span className="mt-0.5 block text-xs text-muted">{child.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CTAButton booking size="sm" event={ConversionEvents.bookAudit} eventLabel="header_book_audit">
            Book a Free Audit
          </CTAButton>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-border text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-background/98 backdrop-blur-xl lg:hidden">
          <nav className="container-xa flex flex-col gap-1 py-6" aria-label="Mobile">
            {MAIN_NAV.map((item) => (
              <div key={item.label} className="border-b border-border/60 py-2">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-base font-medium text-foreground"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="grid grid-cols-2 gap-1 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-2 py-1.5 text-sm text-muted hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <CTAButton booking size="lg" className="w-full" event={ConversionEvents.bookAudit} eventLabel="mobile_book_audit">
                Book a Free AI Workflow Audit
              </CTAButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
