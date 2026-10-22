import { identityTelemetry } from '@/lib/form-identity-telemetry';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) { return identityTelemetry.report(request); }
export async function GET() { return identityTelemetry.health(); }
