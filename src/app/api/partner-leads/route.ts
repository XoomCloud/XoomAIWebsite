import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { CONTACT_FROM } from "@/lib/contact-schema";

export const runtime = "nodejs";

const partnerLeadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  company: z.string().trim().min(1).max(140),
  email: z.string().trim().email().max(180),
  managedClients: z.enum(["1-19", "20-49", "50-99", "100+"]),
  aiCapability: z.enum(["none", "ad-hoc", "referral", "in-house"]),
  website: z.string().max(200).optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = partnerLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 422 });
  }

  const lead = parsed.data;
  if (lead.website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[partner-leads] RESEND_API_KEY is not set.");
    return NextResponse.json({ error: "Email is not configured on the server." }, { status: 500 });
  }

  const name = `${lead.firstName} ${lead.lastName}`;
  const rows: [string, string][] = [
    ["Name", name],
    ["Company", lead.company],
    ["Work email", lead.email],
    ["Managed clients", lead.managedClients],
    ["AI capability today", lead.aiCapability],
  ];
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6">
      <h2 style="margin:0 0 12px">New MSP Partner Program lead</h2>
      <p style="margin:0 0 16px;color:#64748b">This contact unlocked the 28-page MSP Partner Information Pack on xoomai.com.au.</p>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([key, value]) =>
              `<tr><td style="padding:5px 18px 5px 0;color:#64748b">${key}</td><td style="padding:5px 0;font-weight:600">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = `New MSP Partner Program lead

Name: ${name}
Company: ${lead.company}
Work email: ${lead.email}
Managed clients: ${lead.managedClients}
AI capability today: ${lead.aiCapability}
`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: "ai@xoomai.com.au",
      replyTo: lead.email,
      subject: `New MSP partnership lead - ${lead.company}`,
      html,
      text,
    });

    if (error) {
      console.error("[partner-leads] Resend error:", error);
      return NextResponse.json({ error: "We could not process your request." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[partner-leads] Unexpected error:", error);
    return NextResponse.json({ error: "We could not process your request." }, { status: 500 });
  }
}
