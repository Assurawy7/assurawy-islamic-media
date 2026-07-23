import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isCloudStorageConfigured, uploadBuffer } from "@/lib/storage";

/**
 * Uploads a lesson PDF/video. If S3-compatible cloud storage is configured
 * (see lib/storage.ts), the file goes there and this route returns its
 * public URL. Otherwise it falls back to writing into /public/uploads on
 * the local filesystem — fine for local dev or a self-hosted/Docker
 * deployment, but NOT for serverless (Vercel), where the filesystem is
 * ephemeral. Configure S3_* env vars before deploying uploads to Vercel.
 *
 * For large video files, prefer POST /api/uploads/presign instead, which
 * has the browser upload directly to storage rather than through this
 * function (avoiding Vercel's ~4.5MB serverless request body limit).
 */
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

  const allowed = ["application/pdf", "video/mp4", "video/webm"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF, MP4, or WebM files are allowed." },
      { status: 415 }
    );
  }
  const maxBytes = 50 * 1024 * 1024; // 50MB — use /api/uploads/presign for larger video files
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: "File exceeds the 50MB limit for this route. Use presigned upload for larger files." },
      { status: 413 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (isCloudStorageConfigured()) {
    const { publicUrl } = await uploadBuffer(bytes, file.name, file.type);
    return NextResponse.json({ fileName: file.name, fileUrl: publicUrl });
  }

  // Local-disk fallback (dev / self-hosted only)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${crypto.randomUUID()}-${safeName}`;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);
  await writeFile(filePath, bytes);

  return NextResponse.json({
    fileName: file.name,
    fileUrl: `/uploads/${fileName}`,
  });
}
