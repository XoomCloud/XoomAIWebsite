import { verifyResponse } from '@/lib/form-identity-http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) { return verifyResponse(request); }
