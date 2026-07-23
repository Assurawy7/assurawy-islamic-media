import Sidebar, { NavItem } from "@/components/dashboard/Sidebar";
import IslamicPattern from "@/components/IslamicPattern";
import { getSession } from "@/lib/session";

const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/courses", label: "Courses", icon: "📚" },
  { href: "/admin/students", label: "Students", icon: "🎓" },
  { href: "/admin/teachers", label: "Teachers", icon: "🧑‍🏫" },
  { href: "/admin/certificates", label: "Certificates", icon: "📜" },
  { href: "/admin/announcements", label: "Announcements", icon: "📣" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-cream lg:flex-row flex-col">
      <Sidebar items={adminNav} roleLabel="Admin" userName={session?.name ?? "Admin"} />
      <main className="min-w-0 flex-1">
        <IslamicPattern />
        <div className="px-5 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
