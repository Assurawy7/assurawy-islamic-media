import Sidebar, { NavItem } from "@/components/dashboard/Sidebar";
import IslamicPattern from "@/components/IslamicPattern";
import { getSession } from "@/lib/session";

const teacherNav: NavItem[] = [
  { href: "/teacher", label: "Overview", icon: "📊" },
  { href: "/teacher/courses", label: "My Courses", icon: "📚" },
  { href: "/teacher/courses/new", label: "New Course", icon: "➕" },
  { href: "/teacher/announcements", label: "Announcements", icon: "📣" },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-cream lg:flex-row flex-col">
      <Sidebar items={teacherNav} roleLabel="Teacher" userName={session?.name ?? "Teacher"} />
      <main className="min-w-0 flex-1">
        <IslamicPattern />
        <div className="px-5 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
