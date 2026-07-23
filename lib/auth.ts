import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

// In production, a missing OR placeholder JWT_SECRET must fail loudly at
// startup rather than silently signing sessions with a well-known fallback
// string — anyone could forge an admin session cookie against that fallback
// if it ever shipped. This checks for the specific placeholder strings used
// in .env.example and docker-compose.yml's own `${JWT_SECRET:-...}` default,
// not just an entirely unset value — docker-compose sets the env var to that
// literal placeholder string if you don't override it, so "is it set" alone
// wouldn't catch that case.
const KNOWN_PLACEHOLDER_SECRETS = new Set([
  "replace-with-a-long-random-string",
  "dev-only-secret-change-me",
]);
if (
  process.env.NODE_ENV === "production" &&
  (!process.env.JWT_SECRET || KNOWN_PLACEHOLDER_SECRETS.has(process.env.JWT_SECRET))
) {
  throw new Error(
    "JWT_SECRET is missing or set to a known placeholder value. Refusing to start in " +
      "production with an insecure/guessable secret. Generate one with " +
      "`openssl rand -base64 32` and set it in your environment (see .env.example)."
  );
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-secret-change-me"
);

export const SESSION_COOKIE = "assurawy_session";

export type SessionPayload = {
  sub: string; // user id
  name: string;
  email: string;
  role: Role;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
