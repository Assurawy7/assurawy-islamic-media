import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./auth";

/** Reads and verifies the session cookie inside a Route Handler or Server Component. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Throws-free guard: returns the session or null, callers decide how to respond. */
export async function requireRole(roles: SessionPayload["role"][]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) return null;
  return session;
}
