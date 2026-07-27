import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const resolvedParams = await Promise.resolve(params);
    const certificateId = resolvedParams?.id;

    if (!certificateId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.certificate.delete({
      where: { id: certificateId },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to delete" },
      { status: 500 }
    );
  }
}