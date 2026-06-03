"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { trackEvent, ConversionEvents } from "@/lib/analytics";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a little about what you'd like to automate"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Analytics-ready: emit a conversion event. Wire to an endpoint/CRM later.
    trackEvent(ConversionEvents.submitContact, { company: values.company, has_phone: !!values.phone });
    // Simulate async submit; replace with API route or form provider when available.
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card-surface rounded-3xl p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold">Thanks — we&apos;ve got it</h3>
        <p className="mt-2 text-sm text-muted">
          A member of the XoomAI team will be in touch shortly. Prefer to talk now? Book a time directly below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-surface rounded-3xl p-6 md:p-8" noValidate>
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
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"} <Send className="size-4" />
      </Button>
    </form>
  );
}
