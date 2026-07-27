import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = 'force-dynamic';
export default async function LiveClassesPage() {
  const liveClasses = await prisma.liveClass.findMany({
    orderBy: {
      scheduledAt: "desc",
    },
    include: {
      teacher: true,
      course: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#0B132B] rounded-2xl p-8 text-white border border-[#D4AF37]/30 shadow-lg">

        <div className="flex justify-between items-center">

          <div>
            <span className="text-xs text-[#F5D77F] font-bold tracking-widest">
              LIVE CLASS MANAGEMENT
            </span>

            <h1 className="text-3xl font-bold mt-2">
              Manage Live Classes
            </h1>

            <p className="text-slate-300 mt-2 text-sm">
              Create and manage online Islamic lessons.
            </p>
          </div>


          <Link
            href="/admin/live-classes/create"
            className="bg-[#D4AF37] text-[#1B2A4A] px-5 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            + Create Class
          </Link>

        </div>

      </div>



      {/* Classes List */}
      <div className="grid gap-5">

        {liveClasses.length === 0 ? (

          <div className="bg-white rounded-xl p-8 text-center border">
            No Live Classes Created Yet.
          </div>

        ) : (

          liveClasses.map((live) => (

            <div
              key={live.id}
              className="bg-white rounded-2xl p-6 border shadow-sm"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-xl font-bold text-slate-800">
                    {live.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    Course: {live.course?.title ?? "General"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Teacher: {live.teacher.name}
                  </p>

                  <p className="text-sm mt-2">
                    📅 {new Date(live.scheduledAt).toLocaleString()}
                  </p>

                </div>


                <div>

                  {live.status === "LIVE" ? (

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                      LIVE NOW
                    </span>

                  ) : (

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      UPCOMING
                    </span>

                  )}

                </div>


              </div>


              <div className="mt-5">

                <a
                  href={live.meetingUrl}
                  target="_blank"
                  className="inline-block bg-[#1B2A4A] text-white px-5 py-2 rounded-lg text-sm"
                >
                  Join Meeting
                </a>

              </div>


            </div>

          ))

        )}

      </div>


    </div>
  );
}