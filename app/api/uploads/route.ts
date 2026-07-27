import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isCloudStorageConfigured, uploadBuffer } from "@/lib/storage";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // ✅ AN QARA HOTUNA (PNG, JPG, JPEG, WEBP, SVG)
  const allowed = [
    "application/pdf", 
    "video/mp4", 
    "video/webm",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml"
  ];

  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Kawai Hotuna (PNG/JPG/WEBP), PDF, ko Bidiyo ake yarda da su." },
      { status: 415 }
    );
  }

  const maxBytes = 50 * 1024 * 1024; // 50MB
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: "Fayil din ya wuce girman 50MB." },
      { status: 413 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (isCloudStorageConfigured()) {
    const { publicUrl } = await uploadBuffer(bytes, file.name, file.type);
    return NextResponse.json({ fileName: file.name, fileUrl: publicUrl });
  }

  // Adana a public/uploads
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${crypto.randomUUID()}-${safeName}`;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);
  await writeFile(filePath, bytes);

  return NextResponse.json({
    fileName: file.name,
    fileUrl: `/uploads/${fileName}`,
  });
}