import { ShieldCheck, Server, Lock, FileCheck2, MapPin, EyeOff } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section";

const PILLARS = [
  { icon: Server, title: "Dedicated infrastructure", body: "Your agent runs on dedicated hardware in an isolated environment — not a shared multi-tenant AI." },
  { icon: EyeOff, title: "No training on your data", body: "Your documents, emails and customer data are never used to train AI models. Full stop." },
  { icon: MapPin, title: "Australian data sovereignty", body: "Hosted and managed in Australia with a Privacy Act–first approach to data handling." },
  { icon: Lock, title: "Permissioned access", body: "Role-based, least-privilege access to every connected system, scoped to each workflow." },
  { icon: FileCheck2, title: "Full audit trails", body: "Every action the agent takes is logged and reviewable, so you stay in control and compliant." },
  { icon: ShieldCheck, title: "Backed by XoomCloud", body: "Built by a managed IT and cyber-security provider — not a marketing-first AI startup." },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-1/2" aria-hidden />
      <div className="container-xa relative">
        <SectionHeading
          eyebrow="Security & Trust"
          title="Enterprise security from an Australian MSP, not a startup"
          subtitle="XoomAI is a brand of XoomCloud — a managed IT and cyber-security provider. AI security is built in, not bolted on."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i}>
                <div className="card-surface h-full rounded-2xl p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
