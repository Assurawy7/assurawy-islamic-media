import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getOwnedCourseByModule } from "@/lib/course-access";

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByModule(params.id, session);
  if (!owned) return NextResponse.json({ error: "Module not found or not yours." }, { status: 404 });

  const { title, order } = await req.json().catch(() => ({}));
  const updated = await prisma.module.update({
    where: { id: params.id },
    data: { title, order },
  });

  return NextResponse.json({ module: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByModule(params.id, session);
  if (!owned) return NextResponse.json({ error: "Module not found or not yours." }, { status: 404 });

  await prisma.module.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
