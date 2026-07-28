import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The rest of the app authenticates via a signed JWT cookie
  // (lib/session.ts), not NextAuth — this previously called NextAuth's
  // getServerSession(), which always resolved empty since there's no
  // [...nextauth] route configured. It was dead code (the `user` it
  // fetched was never even rendered) but worth fixing properly, and it
  // means this layout can now genuinely gate access.
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Content gets bottom padding on mobile so the fixed tab bar never
          overlaps the last bit of scrollable content. */}
      <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-6">{children}</main>
      <DashboardMobileNav />
    </div>
  );
}
