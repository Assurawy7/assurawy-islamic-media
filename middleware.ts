import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const roleGates: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard", roles: ["STUDENT", "ADMIN", "TEACHER"] },
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/teacher", roles: ["TEACHER", "ADMIN"] },
];

export async function middleware(req: NextRequest) {
  const gate = roleGates.find((g) => req.nextUrl.pathname.startsWith(g.prefix));
  if (!gate) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session || !gate.roles.includes(session.role)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/teacher/:path*"],
};
