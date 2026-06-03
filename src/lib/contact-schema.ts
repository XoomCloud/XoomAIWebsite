import { z } from "zod";

/** Shared contact schema — used by the client form and the server API route. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(160),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little about what you'd like to automate")
    .max(4000),
  /** Honeypot — hidden from real users; checked in the route, not rejected here. */
  website: z.string().max(200).optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const CONTACT_TO = process.env.CONTACT_TO || "support@xoomcloud.com.au";
export const CONTACT_FROM = process.env.CONTACT_FROM || "XoomAI Website <noreply@xoomai.com.au>";
