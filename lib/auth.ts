import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

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

// 💡 AN ƘARA WANNAN DOMIN MAGANCE ERRO ƊIN TS(2305)
export const authOptions = {
  secret: process.env.JWT_SECRET || "dev-only-secret-change-me",
  session: { strategy: "jwt" as const },
};

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
  // Tabbatar an tura role din a fili zuwa JWT token
  return new SignJWT({
    sub: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      sub: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}