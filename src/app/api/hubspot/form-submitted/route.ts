import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { sendFormLeadToMetaCapi } from "@/lib/meta-capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FORM_ID = "d5bbb02f-27ce-4869-8428-3f9268bfe5d5";
const SOURCE_URL = "https://xoomai.com.au/youraiemployee";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Only a trusted HubSpot submission relay may invoke this endpoint. */
export async function POST(request: Request) {
  const secret = process.env.HUBSPOT_FORM_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Form relay not configured." }, { status: 503 });
  const provided = request.headers.get("x-webhook-secret") || "";
  const expectedBytes = Buffer.from(secret);
  const providedBytes = Buffer.from(provided);
  if (providedBytes.length !== expectedBytes.length || !crypto.timingSafeEqual(providedBytes, expectedBytes)) {
    return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  }
  const raw = await request.text();
  if (raw.length > 16384) return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw); } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Expected confirmed submission." }, { status: 400 });
  }
  const data = body as Record<string, unknown>;
  if (data.formId !== FORM_ID || typeof data.submissionId !== "string" || !UUID.test(data.submissionId)
    || typeof data.email !== "string" || data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    || typeof data.submittedAt !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid confirmed submission." }, { status: 422 });
  }
  const eventTimeMs = Date.parse(data.submittedAt);
  if (!Number.isFinite(eventTimeMs) || eventTimeMs > Date.now() || eventTimeMs < Date.now() - 7 * 86400000) {
    return NextResponse.json({ ok: false, error: "Invalid submission time." }, { status: 422 });
  }
  const result = await sendFormLeadToMetaCapi({
    eventId: `hs_form_${data.submissionId.toLowerCase()}`,
    email: data.email,
    eventTimeMs,
    eventSourceUrl: SOURCE_URL,
  });
  if (!result.sent) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 503 });
  }
  return NextResponse.json({ ok: true, eventId: result.eventId, events_received: 1, ...(result.traceId ? { traceId: result.traceId } : {}) });
}
