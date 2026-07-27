import { prisma } from "@/lib/prisma";
import LiveClassCalendar from "@/components/LiveClassCalendar";

export const metadata = { title: "Live Classes Calendar — Assurawy" };

export default async function LiveClassCalendarPage() {
  const liveClasses = await prisma.liveClass.findMany({
    select: {
      id: true,
      title: true,
      scheduledAt: true,
      status: true,
      platform: true,
      teacher: { select: { name: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  // Convert Date object to string to avoid serialization issues
  const formattedClasses = liveClasses.map((item) => ({
    ...item,
    scheduledAt: item.scheduledAt.toISOString(),
  }));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jadawalin Kalanda (Live Calendar)</h1>
        <p className="text-sm text-gray-500">Duba kwanaki da lokutan da aka tsara gudanar da azuzuwa</p>
      </div>

      <LiveClassCalendar liveClasses={formattedClasses} />
    </div>
  );
}