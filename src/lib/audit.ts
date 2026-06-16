// In-memory audit log ring buffer. Replace with real telemetry in production.
export type AuditEvent = {
  ts: number;
  type: string;
  refId?: string;
  payload?: Record<string, unknown>;
};

const MAX = 500;
const ring: AuditEvent[] = [];

export function auditLog(type: string, payload?: Record<string, unknown>, refId?: string) {
  const ev: AuditEvent = { ts: Date.now(), type, refId, payload };
  ring.push(ev);
  if (ring.length > MAX) ring.shift();
  // eslint-disable-next-line no-console
  console.info("[AUDIT]", new Date(ev.ts).toISOString(), type, refId ?? "", payload ?? "");
  return ev;
}

export function getAuditLog(): readonly AuditEvent[] {
  return ring;
}