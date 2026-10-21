import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const FORM_ID = 'd5bbb02f-27ce-4869-8428-3f9268bfe5d5';
export const SOURCE_URL = 'https://xoomai.com.au/youraiemployee';
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const TOKEN_TTL_SECONDS = 900;
export const FORM_SESSION_SECONDS = 7 * 86400;
export const RETENTION_SECONDS = 7 * 86400;
export type Claim = { v: 1; id: string; nonce: string; formId: string; sourceUrl: string; createdAt: number; iat: number; exp: number };
export type Submission = { token: string; eventUuid: string; formId: string; sourceUrl: string; submittedAt: string; email: string };
export type NonceStore = { bind(nonce: string, submissionHash: string, ttlSeconds: number): Promise<boolean> };

export function equalSecret(a: string, b: string): boolean {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function issueIdentity(secret: string, now = Date.now(), prior?: Pick<Claim, 'id' | 'nonce' | 'createdAt'>) {
  if (secret.length < 32) throw new Error('Signing key unavailable');
  const iat = Math.floor(now / 1000);
  const claim: Claim = { v: 1, id: prior?.id || randomUUID(), nonce: prior?.nonce || randomUUID(), createdAt: prior?.createdAt ?? iat, formId: FORM_ID, sourceUrl: SOURCE_URL, iat, exp: iat + TOKEN_TTL_SECONDS };
  const payload = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return { eventUuid: claim.id, token: `${payload}.${signature}`, expiresAt: claim.exp * 1000,
    validUntil: (claim.createdAt + FORM_SESSION_SECONDS) * 1000, sourceUrl: SOURCE_URL, formId: FORM_ID };
}

export function readClaim(token: string, secret: string, now = Date.now(), allowExpired = false): Claim | null {
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
      || !Number.isSafeInteger(c.createdAt) || c.createdAt > c.iat || c.iat - c.createdAt > FORM_SESSION_SECONDS
      || c.iat > seconds || (!allowExpired && c.exp <= seconds) || c.exp - c.iat !== TOKEN_TTL_SECONDS) return null;
    return c;
  } catch { return null; }
}

/** Renew the token lease, preserving the canonical event UUID and nonce. */
export function renewIdentity(token: string, secret: string, now = Date.now()) {
  const prior = readClaim(token, secret, now, true);
  if (!prior || Math.floor(now / 1000) - prior.createdAt >= FORM_SESSION_SECONDS) return null;
  return issueIdentity(secret, now, prior);
}

export async function verifySubmission(input: unknown, secret: string, store: NonceStore, now = Date.now()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const s = input as Submission;
  if (typeof s.token !== 'string' || typeof s.eventUuid !== 'string' || !UUID.test(s.eventUuid)
    || s.formId !== FORM_ID || s.sourceUrl !== SOURCE_URL || typeof s.email !== 'string'
    || s.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || typeof s.submittedAt !== 'string') return null;
  const submitted = Date.parse(s.submittedAt);
  if (!Number.isFinite(submitted) || submitted > now || now - submitted >= RETENTION_SECONDS * 1000) return null;
  // The signed identity is valid for the fixed form-session window. The
  // 15-minute deadline requests refresh; it cannot invalidate a submission
  // made while refresh is in flight with the previous token already captured.
  const claim = readClaim(s.token, secret, submitted, true);
  if (!claim || claim.id !== s.eventUuid
    || submitted < claim.iat * 1000 || submitted >= (claim.createdAt + FORM_SESSION_SECONDS) * 1000) return null;
  const eventId = `hs_form_${claim.id}`;
  const binding = createHash('sha256').update(JSON.stringify([eventId, FORM_ID, SOURCE_URL, submitted, s.email.trim().toLowerCase()])).digest('hex');
  const ttl = Math.ceil((submitted + RETENTION_SECONDS * 1000 - now) / 1000) + 60;
  if (!await store.bind(claim.nonce, binding, ttl)) return null;
  return { verified: true, eventUuid: claim.id, eventId, formId: FORM_ID, sourceUrl: SOURCE_URL, submittedAt: new Date(submitted).toISOString() };
}

/** Bind once, then permit retries of that exact submission across instances. */
export function redisNonceStore(url: string, token: string, fetcher: typeof fetch = fetch): NonceStore {
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || !token) throw new Error('Nonce store unavailable');
  async function command(args: (string | number)[]) {
    const response = await fetcher(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Nonce store unavailable');
    const body = await response.json() as { result?: unknown; error?: unknown };
    if (body.error || !Object.prototype.hasOwnProperty.call(body, 'result')) throw new Error('Nonce store unavailable');
    return body.result;
  }
  return { async bind(nonce, submissionHash, ttlSeconds) {
    const key = `xoomai:hubspot:binding:${nonce}`;
    const set = await command(['SET', key, submissionHash, 'NX', 'EX', ttlSeconds]);
    if (set === 'OK') return true;
    if (set !== null) throw new Error('Nonce store unavailable');
    // Never overwrite or extend an existing binding. A network failure after
    // SET can safely retry; different identity, time or email cannot reuse it.
    const existing = await command(['GET', key]);
    return typeof existing === 'string' && equalSecret(existing, submissionHash);
  } };
}
