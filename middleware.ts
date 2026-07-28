import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// NOTE: /api/teacher/* is intentionally NOT gated here. /api/teacher itself
// (no sub-path) is a public teacher-listing endpoint used by the public
// /live-classes page. Its sub-routes (e.g. /api/teacher/courses) already
// enforce their own requireRole(["TEACHER","ADMIN"]) checks per-route.
const roleGates: { prefix: string; roles: string[] }[] = [
  { prefix: "/api/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard", roles: ["STUDENT", "ADMIN", "TEACHER"] },
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/teacher", roles: ["TEACHER", "ADMIN"] },
];

export async function middleware(req: NextRequest) {
  const gate = roleGates.find((g) => req.nextUrl.pathname.startsWith(g.prefix));
  if (!gate) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/");

  if (!session || !gate.roles.includes(session.role)) {
    // API routes get a plain 401 JSON response — redirecting a fetch()
    // call to /login is useless to the client. Page routes still redirect.
    if (isApiRoute) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/teacher/:path*", "/api/admin/:path*"],
};
