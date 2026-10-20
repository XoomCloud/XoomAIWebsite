import { equalSecret, issueIdentity, renewIdentity, redisNonceStore, verifySubmission, type NonceStore } from './form-identity';

type Config = { signingKey: string; verifierKey: string; store: NonceStore };
export function identityConfig(): Config | null {
  const signingKey = process.env.HUBSPOT_IDENTITY_SIGNING_KEY || '';
  const verifierKey = process.env.HUBSPOT_IDENTITY_VERIFIER_KEY || '';
  const url = process.env.HUBSPOT_IDENTITY_REDIS_URL || '', token = process.env.HUBSPOT_IDENTITY_REDIS_TOKEN || '';
  if (signingKey.length < 32 || verifierKey.length < 32 || equalSecret(signingKey, verifierKey) || !url || !token) return null;
  try { return { signingKey, verifierKey, store: redisNonceStore(url, token) }; } catch { return null; }
}
function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export async function issueResponse(request: Request, config: Config | null = identityConfig()) {
  if (!config) return reply({ ok: false, error: 'Identity service not configured' }, 503);
  if (!['https://xoomai.com.au', 'https://www.xoomai.com.au'].includes(request.headers.get('origin') || '')) return reply({ ok: false }, 403);
  const raw = await request.text();
  if (raw.length > 4096) return reply({ ok: false }, 413);
  if (raw) {
    try {
      const input: unknown = JSON.parse(raw);
      if (!input || typeof input !== 'object' || !('token' in input) || typeof input.token !== 'string') return reply({ ok: false }, 422);
      const renewed = renewIdentity(input.token, config.signingKey);
      return renewed ? reply({ ok: true, ...renewed }) : reply({ ok: false }, 422);
    } catch { return reply({ ok: false }, 400); }
  }
  return reply({ ok: true, ...issueIdentity(config.signingKey) });
}
/** Only the authenticated Make relay may attest a provider-confirmed submission. */
export async function verifyResponse(request: Request, config: Config | null = identityConfig()) {
  if (!config) return reply({ verified: false }, 503);
  if (!equalSecret(request.headers.get('authorization') || '', `Bearer ${config.verifierKey}`)) return reply({ verified: false }, 401);
  const declaredLength = request.headers.get('content-length');
  if (declaredLength && Number(declaredLength) > 8192) return reply({ verified: false }, 413);
  // Read at most 8 KiB even when Content-Length is absent or dishonest.
  const reader = request.body?.getReader();
  if (!reader) return reply({ verified: false }, 400);
  const chunks: Uint8Array[] = []; let bytes = 0;
  try {
    while (true) {
      const next = await reader.read(); if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > 8192) { await reader.cancel(); return reply({ verified: false }, 413); }
      chunks.push(next.value);
    }
    const input: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const result = await verifySubmission(input, config.signingKey, config.store);
    return result ? reply(result) : reply({ verified: false }, 422);
  } catch (error) {
    return reply({ verified: false }, error instanceof SyntaxError ? 400 : 503);
  }
}
