import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const FORM_ID = 'd5bbb02f-27ce-4869-8428-3f9268bfe5d5';
export const SOURCE_URL = 'https://xoomai.com.au/youraiemployee';
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const TOKEN_TTL_SECONDS = 900;
export type Claim = { v: 1; id: string; nonce: string; formId: string; sourceUrl: string; iat: number; exp: number };
export type Submission = { token: string; eventUuid: string; formId: string; sourceUrl: string; submittedAt: string; email: string };
export type NonceStore = { consume(nonce: string, eventId: string, ttlSeconds: number): Promise<boolean> };

export function equalSecret(a: string, b: string): boolean {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function issueIdentity(secret: string, now = Date.now()) {
  if (secret.length < 32) throw new Error('Signing key unavailable');
  const iat = Math.floor(now / 1000);
  const claim: Claim = { v: 1, id: randomUUID(), nonce: randomUUID(), formId: FORM_ID, sourceUrl: SOURCE_URL, iat, exp: iat + TOKEN_TTL_SECONDS };
  const payload = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return { eventUuid: claim.id, token: `${payload}.${signature}`, expiresAt: claim.exp * 1000, sourceUrl: SOURCE_URL, formId: FORM_ID };
}

export function readClaim(token: string, secret: string, now = Date.now()): Claim | null {
  if (secret.length < 32 || token.length > 2048) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every(p => /^[A-Za-z0-9_-]+$/.test(p))) return null;
  const signature = createHmac('sha256', secret).update(parts[0]).digest('base64url');
  if (!equalSecret(parts[1], signature)) return null;
  try {
    const c = JSON.parse(Buffer.from(parts[0], 'base64url').toString()) as Claim;
    const seconds = Math.floor(now / 1000);
    if (c.v !== 1 || typeof c.id !== 'string' || !UUID.test(c.id) || typeof c.nonce !== 'string' || !UUID.test(c.nonce)
      || c.formId !== FORM_ID || c.sourceUrl !== SOURCE_URL || !Number.isSafeInteger(c.iat) || !Number.isSafeInteger(c.exp)
      || c.iat > seconds || c.exp <= seconds || c.exp - c.iat !== TOKEN_TTL_SECONDS) return null;
    return c;
  } catch { return null; }
}

export async function verifySubmission(input: unknown, secret: string, store: NonceStore, now = Date.now()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const s = input as Submission;
  if (typeof s.token !== 'string' || typeof s.eventUuid !== 'string' || !UUID.test(s.eventUuid)
    || s.formId !== FORM_ID || s.sourceUrl !== SOURCE_URL || typeof s.email !== 'string'
    || s.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || typeof s.submittedAt !== 'string') return null;
  const claim = readClaim(s.token, secret, now);
  const submitted = Date.parse(s.submittedAt);
  if (!claim || claim.id !== s.eventUuid || !Number.isFinite(submitted) || submitted > now
    || submitted < claim.iat * 1000 || submitted >= claim.exp * 1000) return null;
  const eventId = `hs_form_${claim.id}`;
  if (!await store.consume(claim.nonce, eventId, Math.max(1, claim.exp - Math.floor(now / 1000)))) return null;
  return { verified: true, eventUuid: claim.id, eventId, formId: FORM_ID, sourceUrl: SOURCE_URL, submittedAt: new Date(submitted).toISOString() };
}

/** Shared atomic NX storage is mandatory; process memory is not safe on Vercel. */
export function redisNonceStore(url: string, token: string, fetcher: typeof fetch = fetch): NonceStore {
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || !token) throw new Error('Nonce store unavailable');
  return { async consume(nonce, eventId, ttlSeconds) {
    const response = await fetcher(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['SET', `xoomai:hubspot:used:${nonce}`, eventId, 'NX', 'EX', ttlSeconds]),
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Nonce store unavailable');
    const body = await response.json() as { result?: unknown; error?: unknown };
    if (body.error || (body.result !== 'OK' && body.result !== null)) throw new Error('Nonce store unavailable');
    return body.result === 'OK';
  } };
}
