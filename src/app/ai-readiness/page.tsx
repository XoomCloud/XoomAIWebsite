import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Section, SectionHeading } from "@/components/sections/section";
import { ReadinessQuiz } from "@/components/quiz/readiness-quiz";
import { FAQ } from "@/components/sections/faq";
import { CTABlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Readiness Quiz | How AI-Ready Is Your Australian Business? | XoomAI",
  description:
    "Take the free 3-minute AI Readiness Quiz. Get your personalised AI Readiness Score and your top quick wins for automating your Australian business with XoomAgent™.",
  alternates: { canonical: "/ai-readiness" },
};

const faqs = [
  { q: "How long does the quiz take?", a: "About three minutes. There are ten quick questions across the dimensions that most affect AI success — time, systems, data, process and readiness to act." },
  { q: "Is it really free?", a: "Yes, completely free and obligation-free. You'll get your AI Readiness Score and tailored quick wins instantly." },
  { q: "What do I get at the end?", a: "A personalised score out of 100, a readiness band, and your top three quick wins — plus the option to book a free 30-minute strategy consultation to go deeper." },
  { q: "What happens to my email?", a: "We use it to send your results and, with your consent, to follow up about how XoomAgent™ could help. We respect your privacy and never sell your data." },
];

export default function AiReadinessPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "AI Readiness Quiz", href: "/ai-readiness" }]} />

      <Section className="pt-4">
        <SectionHeading
          as="h1"
          eyebrow="Free Lead Magnet · 3 Minutes"
          title="How AI-Ready Is Your Business?"
          subtitle="Answer ten quick questions to get your personalised AI Readiness Score and the top quick wins where an AI employee would pay off first."
        />

        <Reveal className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
          <Badge><Clock className="size-3.5" /> 3-minute quiz</Badge>
          <Badge><Sparkles className="size-3.5" /> Instant personalised score</Badge>
          <Badge><ShieldCheck className="size-3.5" /> Free & no obligation</Badge>
        </Reveal>

        <div className="mt-12">
          <ReadinessQuiz />
        </div>
      </Section>

      <FAQ items={faqs} title="About the quiz" />

      <CTABlock
        title="Prefer to talk it through?"
        subtitle="Skip the quiz and book a free 30-minute AI Workflow Audit. We'll map where AI can save your team time — no obligation."
      />
    </>
  );
}
