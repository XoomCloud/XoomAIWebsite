"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Script from "next/script";
import { Send, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { trackLead } from "@/lib/meta";

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;

const EMPLOYEE_BANDS = ["1–9", "10–24", "25–49", "50–100", "100+"];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  business: z.string().trim().min(2, "Please enter your business name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  employees: z.string().min(1, "Select your team size"),
  challenge: z.string().trim().min(5, "Tell us your biggest challenge"),
});
type Values = z.infer<typeof schema>;

declare global {
  interface Window {
    hbspt?: { forms: { create: (opts: Record<string, unknown>) => void } };
  }
}

/** HubSpot embedded form when configured; otherwise a fully-working styled fallback. */
export function HubspotForm() {
  const router = useRouter();
  const useHubspot = Boolean(PORTAL_ID && FORM_ID);

  if (useHubspot) return <HubspotEmbed router={router} />;
  return <NativeForm router={router} />;
}

function HubspotEmbed({ router }: { router: ReturnType<typeof useRouter> }) {
  const created = React.useRef(false);

  function create() {
    if (created.current || !window.hbspt) return;
    created.current = true;
    window.hbspt.forms.create({
      portalId: PORTAL_ID,
      formId: FORM_ID,
      region: "na1",
      target: "#hubspot-form-target",
      onFormSubmitted: () => {
        trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
        router.push("/thank-you");
      },
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-white/[0.03] p-6 backdrop-blur-sm">
      <div id="hubspot-form-target" className="hs-form-frame min-h-64" />
      <Script src="https://js.hsforms.net/forms/embed/v2.js" strategy="afterInteractive" onLoad={create} />
    </div>
  );
}

function NativeForm({ router }: { router: ReturnType<typeof useRouter> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(v: Values) {
    // Fire the Meta Lead event immediately on a valid submission.
    trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
    // Best-effort: email the lead to the team via the existing endpoint.
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          company: v.business,
          phone: v.phone,
          message: `AI Strategy Session request (Meta LP)\nTeam size: ${v.employees}\nBiggest challenge: ${v.challenge}`,
        }),
      });
    } catch {
      /* non-blocking — still take them to the thank-you page */
    }
    router.push("/thank-you");
  }

  const field = "mt-1.5";
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-white/[0.03] p-6 backdrop-blur-sm md:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="l-name">Name</Label>
          <Input id="l-name" className={field} autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="l-business">Business</Label>
          <Input id="l-business" className={field} autoComplete="organization" {...register("business")} aria-invalid={!!errors.business} />
          {errors.business && <p className="mt-1 text-sm text-red-400">{errors.business.message}</p>}
        </div>
        <div>
          <Label htmlFor="l-email">Work email</Label>
          <Input id="l-email" type="email" className={field} autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="l-phone">Phone</Label>
          <Input id="l-phone" type="tel" className={field} autoComplete="tel" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="l-employees">How many staff?</Label>
        <select
          id="l-employees"
          className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          defaultValue=""
          {...register("employees")}
          aria-invalid={!!errors.employees}
        >
          <option value="" disabled>Select team size…</option>
          {EMPLOYEE_BANDS.map((b) => (
            <option key={b} value={b}>{b} staff</option>
          ))}
        </select>
        {errors.employees && <p className="mt-1 text-sm text-red-400">{errors.employees.message}</p>}
      </div>

      <div className="mt-4">
        <Label htmlFor="l-challenge">Biggest challenge right now</Label>
        <Textarea
          id="l-challenge"
          className="mt-1.5 min-h-24"
          placeholder="e.g. we can't keep up with enquiries and admin is eating our week…"
          {...register("challenge")}
          aria-invalid={!!errors.challenge}
        />
        {errors.challenge && <p className="mt-1 text-sm text-red-400">{errors.challenge.message}</p>}
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Book My Free Strategy Session <Send className="size-4" /></>}
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-2">
        <Lock className="size-3" aria-hidden /> Your details are secure · No obligation · Australian owned
      </p>
    </form>
  );
}
