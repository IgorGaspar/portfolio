// Liveness probe for the container healthcheck (Dockerfile) and Coolify.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
