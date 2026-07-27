import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let session = null;

  try {
    session = await getServerSession();

    if (session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }
  } catch (error) {
    console.error("Error fetching session or user:", error);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Shafin da ke buɗewa (Dashboard, Profile, ko Leaderboard) ba tare da Sidebar ba */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}