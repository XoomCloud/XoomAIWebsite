import Link from "next/link";
import { Sparkles, Phone, Mail, ShieldCheck } from "lucide-react";
import { SITE, SERVICES_NAV, INDUSTRIES_NAV } from "@/lib/site";
import { CTAButton } from "@/components/cta-button";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-border bg-surface/40">
      <div className="container-xa py-16">
        {/* CTA strip */}
        <div className="ring-gradient mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-surface-2 to-surface p-8 md:p-12">
          <div className="glow-radial pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Ready to deploy your first AI employee?
              </h2>
              <p className="mt-2 max-w-xl text-muted">
                Book a free AI Workflow Audit and we&apos;ll map exactly where XoomAgent™ can save your team time.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
              <CTAButton booking size="lg" eventLabel="footer_book_audit">
                Book a Free AI Workflow Audit
              </CTAButton>
              <CTAButton href="/ai-readiness" variant="outline" size="lg" eventLabel="footer_quiz">
                Take the AI Readiness Quiz
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <Sparkles className="size-4" aria-hidden />
              </span>
              Xoom<span className="text-gradient">AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Your managed AI workforce for Australian business. XoomAgent™ automates email, documents,
              enquiries, CRM updates and workflows — fully managed by XoomAI, a brand of {SITE.parent}.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-muted hover:text-primary">
                <Phone className="size-4" aria-hidden /> {SITE.phone}
              </a>
              <a href={SITE.emailHref} className="flex items-center gap-2 text-muted hover:text-primary">
                <Mail className="size-4" aria-hidden /> {SITE.email}
              </a>
              <p className="flex items-center gap-2 text-muted-2">
                <ShieldCheck className="size-4" aria-hidden /> Australian owned · ABN {SITE.abn}
              </p>
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="text-sm font-semibold text-foreground">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/xoomagent" className="text-muted hover:text-primary">
                  XoomAgent™
                </Link>
              </li>
              {SERVICES_NAV.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-muted hover:text-primary">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Industries">
            <h3 className="text-sm font-semibold text-foreground">Industries</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {INDUSTRIES_NAV.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-muted hover:text-primary">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/industries" className="text-muted hover:text-primary">All Industries</Link></li>
              <li><Link href="/ai-readiness" className="text-muted hover:text-primary">AI Readiness Quiz</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-primary">Contact &amp; Booking</Link></li>
              <li><a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary">LinkedIn</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-2 md:flex-row md:items-center">
          <p>© {year} {SITE.legalName}. All rights reserved. XoomAgent™ is a trademark of {SITE.parent}.</p>
          <p>Brisbane · Gold Coast · Australia-wide · Australian English · Privacy Act focused</p>
        </div>
      </div>
    </footer>
  );
}
