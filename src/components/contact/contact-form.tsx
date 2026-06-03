"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { trackEvent, ConversionEvents } from "@/lib/analytics";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";

export function ContactForm() {
  const [sent, setSent] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactValues) {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong.");
      }
      trackEvent(ConversionEvents.submitContact, { company: values.company, has_phone: !!values.phone });
      setSent(true);
    } catch (err) {
      setServerError(
        err instanceof Error
          ? `${err.message} You can also email support@xoomcloud.com.au or call 1300 040 225.`
          : "Something went wrong. Please email support@xoomcloud.com.au or call 1300 040 225.",
      );
    }
  }

  if (sent) {
    return (
      <div className="card-surface rounded-3xl p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold">Thanks — we&apos;ve got it</h3>
        <p className="mt-2 text-sm text-muted">
          Your message has been sent to our team and a member of XoomAI will be in touch shortly. Prefer to
          talk now? Book a time directly below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-surface rounded-3xl p-6 md:p-8" noValidate>
      {/* Honeypot — hidden from users, catches bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} autoComplete="name" />
          {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} autoComplete="email" />
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} autoComplete="organization" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} autoComplete="tel" />
        </div>
      </div>
      <div className="mt-5">
        <Label htmlFor="message">What would you like to automate?</Label>
        <Textarea id="message" {...register("message")} aria-invalid={!!errors.message} placeholder="e.g. We want to automate enquiry follow-up and invoice processing…" />
        {errors.message && <p className="mt-1.5 text-sm text-red-400">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /> {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"} <Send className="size-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-muted-2">
        Your message is sent securely to our Australian-based team.
      </p>
    </form>
  );
}
