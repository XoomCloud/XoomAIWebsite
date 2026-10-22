/** Fixed operational metadata only. Never pass input or exceptions to the logger. */
export const TELEMETRY_MARKER = 'XOOM_FORM_IDENTITY_OPS_V1';
const PATH = '/youraiemployee';
const FORM = 'enquiry';
const MAX_BYTES = 256;
const WINDOW_MS = 60000;
const MAX_REPORTS = 12;
type Log = (line: string) => void;
export function createIdentityTelemetry(now = Date.now, log: Log = console.info) {
  let windowStart = -1, accepted = 0, healthLogged = false;
  function reset(time: number) {
    const start = Math.floor(time / WINDOW_MS) * WINDOW_MS;
    if (start !== windowStart) { windowStart = start; accepted = 0; healthLogged = false; }
  }
  function record(time: number, status: 'identity_unavailable' | 'attribution_unavailable' | 'consumer_ready', count: number) {
    log(JSON.stringify({ marker: TELEMETRY_MARKER, event: 'form_identity_status', form: FORM, source: PATH,
      time: new Date(time).toISOString(), service_status: status, failure_count: count }));
  }
  function response(status: number) {
    return new Response(null, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  }
  return {
    health() {
      const time = now(); reset(time);
      if (!healthLogged) { record(time, 'consumer_ready', 0); healthLogged = true; }
      return Response.json({ service: 'form_identity_telemetry', status: 'ready', version: 1 },
        { headers: { 'Cache-Control': 'no-store' } });
    },
    async report(request: Request) {
      // Do not accept query strings or log raw URLs, headers, bodies or cookies.
      const url = new URL(request.url);
      if (url.search || url.pathname !== '/api/telemetry/form-identity') return response(400);
      if (!['https://xoomai.com.au', 'https://www.xoomai.com.au'].includes(request.headers.get('origin') || '')) return response(403);
      if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return response(415);
      const declared = request.headers.get('content-length');
      if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BYTES)) return response(413);
      const time = now(); reset(time);
      if (accepted >= MAX_REPORTS) return response(429);
      const reader = request.body?.getReader();
      if (!reader) return response(400);
      const chunks: Uint8Array[] = []; let bytes = 0;
      let input: unknown;
      try {
        while (true) {
          const part = await reader.read(); if (part.done) break;
          bytes += part.value.byteLength;
          if (bytes > MAX_BYTES) { await reader.cancel(); return response(413); }
          chunks.push(part.value);
        }
        input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch { return response(400); }
      finally { reader.releaseLock(); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return response(422);
      const data = input as Record<string, unknown>;
      if (Object.keys(data).sort().join(',') !== 'event,form,source' || (data.event !== 'identity_unavailable' && data.event !== 'attribution_unavailable')
        || data.form !== FORM || data.source !== PATH) return response(422);
      // Recheck after stream reads, since multiple invocations can finish concurrently.
      const receivedAt = now(); reset(receivedAt);
      if (accepted >= MAX_REPORTS) return response(429);
      accepted++;
      record(receivedAt, data.event as 'identity_unavailable' | 'attribution_unavailable', 1);
      return response(204);
    },
  };
}
// Process-local throttle protects log volume without retaining visitor identifiers.
export const identityTelemetry = createIdentityTelemetry();
