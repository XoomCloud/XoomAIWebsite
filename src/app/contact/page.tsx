import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Section, SectionHeading } from "@/components/sections/section";
import { ContactForm } from "@/components/contact/contact-form";
import { FAQ } from "@/components/sections/faq";
import { Reveal } from "@/components/motion/reveal";
import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/site";
import { Phone, Mail, CalendarClock, ShieldCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact XoomAI | Book a Free AI Workflow Audit | Australia",
  description:
    "Talk to XoomAI about deploying XoomAgent™ in your business. Book a free 30-minute AI Workflow Audit, call 1300 040 225 or send us a message. Australian owned, backed by XoomCloud.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  { q: "What happens in the free AI Workflow Audit?", a: "In 30 minutes we map your highest-impact workflows, identify where an AI employee would save the most time, and outline a practical, secure path forward. No obligation, no jargon." },
  { q: "Do you work with businesses outside Brisbane and the Gold Coast?", a: "Yes. We're based in South-East Queensland and work with businesses Australia-wide, delivering and managing XoomAgent™ remotely." },
  { q: "Is there any cost to talk to you?", a: "No. The initial audit and consultation are free. You'll leave with a clearer view of where AI can help, whether or not you proceed with us." },
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />

      <Section className="pt-4">
        <SectionHeading
          as="h1"
          eyebrow="Let's Talk"
          title="Book Your Free AI Workflow Audit"
          subtitle="Tell us what's eating your team's time and we'll show you where XoomAgent™ can help. Australian owned and backed by XoomCloud."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact details */}
          <Reveal className="space-y-4">
            <div className="ring-gradient overflow-hidden rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl">
                <Image
                  src="/images/people/office-meeting.jpg"
                  alt="The XoomAI team meeting with an Australian business to scope their AI workflow audit"
                  width={1400}
                  height={780}
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="h-44 w-full object-cover md:h-52"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/30 via-transparent to-[#06b6d4]/15 mix-blend-multiply" aria-hidden />
              </div>
            </div>
            <div className="ring-gradient rounded-3xl">
              <div className="card-surface relative overflow-hidden rounded-3xl p-7">
                <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-32" aria-hidden />
                <Badge variant="solid"><CalendarClock className="size-3.5" /> Fastest way to start</Badge>
                <h3 className="mt-4 font-display text-xl font-semibold">Book a 30-minute consultation</h3>
                <p className="mt-2 text-sm text-muted">Pick a time that suits you. No obligation — walk away with a clear AI roadmap.</p>
                <CTAButton booking size="lg" className="mt-5 w-full" eventLabel="contact_book">
                  Book a Free AI Workflow Audit
                </CTAButton>
              </div>
            </div>

            <a href={SITE.phoneHref} className="card-surface flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-primary/40">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Phone className="size-5" aria-hidden /></span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-2">Call us</p>
                <p className="font-medium text-foreground">{SITE.phone}</p>
              </div>
            </a>

            <a href={SITE.emailHref} className="card-surface flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-primary/40">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Mail className="size-5" aria-hidden /></span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-2">Email us</p>
                <p className="font-medium text-foreground">{SITE.email}</p>
              </div>
            </a>

            <div className="card-surface flex items-start gap-4 rounded-2xl p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><MapPin className="size-5" aria-hidden /></span>
              <div className="text-sm text-muted">
                <p className="font-medium text-foreground">Brisbane · Gold Coast · Australia-wide</p>
                <p className="mt-1 flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-primary" aria-hidden /> {SITE.legalName} · ABN {SITE.abn}</p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={1}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      <FAQ items={faqs} title="Before you reach out" />
    </>
  );
}
