"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { CTAButton } from "@/components/cta-button";
import { trackEvent, ConversionEvents } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Option = { label: string; score: number };
type Question = { dimension: string; q: string; options: Option[] };

const QUESTIONS: Question[] = [
  { dimension: "Time", q: "How much of your team's week goes to repetitive admin (email, data entry, documents)?", options: [
    { label: "Very little — we're efficient", score: 4 },
    { label: "Some — a few hours a week", score: 3 },
    { label: "A lot — it's a daily drain", score: 1 },
    { label: "It's capping our growth", score: 0 },
  ]},
  { dimension: "Response", q: "How quickly do new enquiries and leads get a first response?", options: [
    { label: "Within minutes, every time", score: 4 },
    { label: "Within a few hours", score: 3 },
    { label: "Same or next day", score: 1 },
    { label: "Inconsistently — some slip", score: 0 },
  ]},
  { dimension: "Systems", q: "How well are your core systems (email, CRM, docs) connected?", options: [
    { label: "Tightly integrated and automated", score: 4 },
    { label: "Partly connected", score: 3 },
    { label: "Mostly manual hand-offs", score: 1 },
    { label: "Everything is copy-paste", score: 0 },
  ]},
  { dimension: "Data", q: "How accessible and organised is your business data?", options: [
    { label: "Clean, centralised and reportable", score: 4 },
    { label: "Reasonable but scattered", score: 2 },
    { label: "Mostly in spreadsheets and inboxes", score: 1 },
    { label: "Hard to find anything", score: 0 },
  ]},
  { dimension: "Process", q: "Are your key processes documented and repeatable?", options: [
    { label: "Yes — clearly documented", score: 4 },
    { label: "Some are", score: 2 },
    { label: "It's mostly in people's heads", score: 1 },
    { label: "No real documentation", score: 0 },
  ]},
  { dimension: "After-hours", q: "What happens to enquiries outside business hours?", options: [
    { label: "We capture and respond automatically", score: 4 },
    { label: "Captured, answered next day", score: 2 },
    { label: "They wait in a queue", score: 1 },
    { label: "We likely lose them", score: 0 },
  ]},
  { dimension: "AI use", q: "How is your team currently using AI tools?", options: [
    { label: "Structured, with guidelines", score: 4 },
    { label: "Ad hoc but growing", score: 2 },
    { label: "A few people experiment", score: 1 },
    { label: "Not really at all", score: 0 },
  ]},
  { dimension: "Security", q: "How confident are you in handling data securely with AI?", options: [
    { label: "Very — we have clear controls", score: 4 },
    { label: "Somewhat confident", score: 2 },
    { label: "Unsure where to start", score: 1 },
    { label: "It's a real concern blocking us", score: 0 },
  ]},
  { dimension: "Ownership", q: "Who would own an AI project in your business?", options: [
    { label: "Clear owner with leadership backing", score: 4 },
    { label: "Someone could lead it", score: 2 },
    { label: "Nobody obvious", score: 1 },
    { label: "No capacity for it internally", score: 0 },
  ]},
  { dimension: "Intent", q: "How ready are you to act on AI in the next 90 days?", options: [
    { label: "Ready now — actively looking", score: 4 },
    { label: "Soon — building the case", score: 3 },
    { label: "Exploring options", score: 2 },
    { label: "Just curious for now", score: 1 },
  ]},
];

const MAX = QUESTIONS.length * 4;

function band(pct: number) {
  if (pct >= 80) return { title: "AI-Ready Leader", body: "You have the foundations to deploy an AI workforce quickly. The opportunity now is to capture value before competitors do — a focused XoomAgent™ deployment could deliver returns fast." };
  if (pct >= 60) return { title: "Emerging & Ready", body: "You're in a strong position with a few gaps to close. A free AI Workflow Audit will pinpoint the quick wins where XoomAgent™ pays off first." };
  if (pct >= 40) return { title: "Building Momentum", body: "There's clear, untapped opportunity here. With the right roadmap, you can turn manual drag into automated wins — start with the highest-impact workflow." };
  return { title: "Early Stage — Big Upside", body: "The good news: the upside is enormous. Manual work is holding you back, and a guided, secure approach with XoomAI can change that quickly." };
}

export function ReadinessQuiz() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const started = React.useRef(false);

  const total = answers.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / MAX) * 100);
  const result = band(pct);

  const isQuiz = step < QUESTIONS.length;
  const isGate = step === QUESTIONS.length && !submitted;

  function choose(score: number) {
    if (!started.current) {
      started.current = true;
      trackEvent(ConversionEvents.startQuiz);
    }
    const next = [...answers];
    next[step] = score;
    setAnswers(next);
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  function submitGate(e: React.FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubmitted(true);
    trackEvent(ConversionEvents.completeQuiz, { score: total, percent: pct, band: result.title });
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setSubmitted(false);
    setEmail("");
    started.current = false;
  }

  const progress = Math.min((step / QUESTIONS.length) * 100, 100);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="ring-gradient rounded-3xl">
        <div className="card-surface relative overflow-hidden rounded-3xl p-6 md:p-9">
          {/* Progress */}
          {!submitted && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{isGate ? "Almost there" : `Question ${step + 1} of ${QUESTIONS.length}`}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" animate={{ width: `${progress}%` }} transition={{ ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isQuiz && (
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{QUESTIONS[step].dimension}</p>
                <h3 className="mt-2 font-display text-xl font-semibold md:text-2xl">{QUESTIONS[step].q}</h3>
                <div className="mt-6 grid gap-3">
                  {QUESTIONS[step].options.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => choose(o.score)}
                      className={cn(
                        "group flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3.5 text-left text-sm transition-all hover:border-primary/50 hover:bg-surface-2",
                        answers[step] === o.score && "border-primary/60 bg-primary/5",
                      )}
                    >
                      <span className="text-foreground">{o.label}</span>
                      <ArrowRight className="size-4 text-muted-2 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
                    <ArrowLeft className="size-4" aria-hidden /> Back
                  </button>
                )}
              </motion.div>
            )}

            {isGate && (
              <motion.form key="gate" onSubmit={submitGate} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <h3 className="font-display text-2xl font-semibold">Your score is ready</h3>
                <p className="mt-2 text-sm text-muted">Enter your email to reveal your AI Readiness Score and your top quick wins. No spam — just your results.</p>
                <div className="mt-6">
                  <Label htmlFor="quiz-email">Work email</Label>
                  <Input id="quiz-email" type="email" placeholder="you@company.com.au" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!emailError} />
                  {emailError && <p className="mt-1.5 text-sm text-red-400">{emailError}</p>}
                </div>
                <Button type="submit" size="lg" className="mt-6 w-full">
                  Reveal My AI Readiness Score <ArrowRight className="size-4" />
                </Button>
                <p className="mt-3 text-center text-xs text-muted-2">By continuing you agree to be contacted about your results. We respect your privacy.</p>
              </motion.form>
            )}

            {submitted && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <div className="text-center">
                  <div className="relative mx-auto grid size-32 place-items-center">
                    <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-surface-2)" strokeWidth="10" />
                      <motion.circle
                        cx="60" cy="60" r="52" fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 52}
                        initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pct / 100) }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#7c5cfc" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute text-center">
                      <div className="font-display text-3xl font-bold">{pct}%</div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-2">{total}/{MAX}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">{result.title}</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted">{result.body}</p>
                </div>

                <div className="mt-7 rounded-2xl border border-border bg-background/40 p-5">
                  <p className="text-sm font-semibold text-foreground">Your top 3 quick wins</p>
                  <ul className="mt-3 space-y-2.5">
                    {["Automate first-response to every new enquiry and lead", "Take repetitive document and data-entry work off your team", "Capture and qualify after-hours enquiries 24/7"].map((w) => (
                      <li key={w} className="flex items-start gap-2.5 text-sm text-muted">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <CTAButton booking size="lg" className="flex-1" event={ConversionEvents.bookConsult} eventLabel="quiz_book_consult">
                    Book Your Free Strategy Consultation
                  </CTAButton>
                  <Button variant="outline" size="lg" onClick={restart}>
                    <RotateCcw className="size-4" /> Retake
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
