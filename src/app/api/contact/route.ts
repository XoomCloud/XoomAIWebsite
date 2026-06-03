import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, CONTACT_TO, CONTACT_FROM } from "@/lib/contact-schema";

export const runtime = "nodejs";

function escapeHtml(s: string) {
  return s
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
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, company, phone, message, website } = parsed.data;

  // Honeypot: silently accept bots without sending.
  if (website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration — surface clearly in logs, fail gracefully for the user.
    console.error("[contact] RESEND_API_KEY is not set; cannot send email.");
    return NextResponse.json(
      { ok: false, error: "Email is not configured on the server." },
      { status: 500 },
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Phone", phone || "—"],
  ];

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6">
      <h2 style="margin:0 0 12px">New enquiry from xoomai.com.au</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#64748b">${k}</td><td style="padding:4px 0;font-weight:600">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <div style="color:#64748b;margin-bottom:4px">Message</div>
      <div style="white-space:pre-wrap;border-left:3px solid #22d3ee;padding:8px 14px;background:#f8fafc">${escapeHtml(message)}</div>
    </div>`;

  const text = `New enquiry from xoomai.com.au

Name: ${name}
Email: ${email}
Company: ${company || "—"}
Phone: ${phone || "—"}

Message:
${message}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `New website enquiry — ${name}${company ? ` (${company})` : ""}`,
      html,
      text,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }
}
