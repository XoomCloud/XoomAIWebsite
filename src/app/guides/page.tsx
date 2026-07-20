import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, FileText, MessageSquareText, ShieldCheck, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/sections/section";

const guideBase = "/guides/bren-ten-hire-excavation-xoomagent-user-guide";

export const metadata: Metadata = {
  title: "XoomAgent™ Client Guides",
  description:
    "Practical XoomAgent™ user guides for client teams, including channel use, task threads, workflows and approval guardrails.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "XoomAgent™ Client Guides | XoomAI",
    description:
      "Practical XoomAgent™ guides for client teams using managed workflows and digital employees.",
    url: "/guides",
  },
};

const guideHighlights = [
  {
    icon: MessageSquareText,
    title: "Discord channels and threads",
    description: "Choose the right functional channel and keep each task in one clearly named thread.",
  },
  {
    icon: Workflow,
    title: "Workflow requests",
    description: "Capture repeatable processes, examples, access needs and approval points for XoomAI to build.",
  },
  {
    icon: ShieldCheck,
    title: "Human approval guardrails",
    description: "Keep client-facing messages, system changes and sensitive decisions under human review.",
  },
];

export default function GuidesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface pt-20">
        <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden />
        <div className="container-xa relative py-16 md:py-24">
          <Reveal className="max-w-3xl">
            <Badge>Client guides</Badge>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.06] md:text-6xl">
              Use XoomAgent™ with clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              Practical reference guides for channel use, task threads, managed workflows and approval
              guardrails. Built for the way each client team works.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <Reveal className="ring-gradient overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-soft)]">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 md:p-10">
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="size-6" aria-hidden />
                </div>
                <div>
                  <p className="eyebrow">Bren-Ten Hire &amp; Excavation</p>
                  <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                    XoomAgent™ Discord User Guide
                  </h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                    An 11-page guide covering the confirmed Discord channel structure, clearly named task
                    threads, prompt examples, workflow requests and external-action approvals.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`${guideBase}.html`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#0891b2] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,58,237,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Open guide <ExternalLink className="size-4" aria-hidden />
                </Link>
                <a
                  href={`${guideBase}.pdf`}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-2"
                >
                  Download PDF <Download className="size-4" aria-hidden />
                </a>
              </div>
            </div>

            <div className="border-t border-border bg-surface-2/60 p-7 md:p-10 lg:border-l lg:border-t-0">
              <h3 className="font-display text-lg font-semibold">What the guide covers</h3>
              <div className="mt-5 space-y-5">
                {guideHighlights.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
