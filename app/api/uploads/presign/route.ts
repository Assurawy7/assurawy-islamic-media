import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { isCloudStorageConfigured, createPresignedUpload } from "@/lib/storage";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!isCloudStorageConfigured()) {
    return NextResponse.json(
      { error: "Cloud storage isn't configured. Set the S3_* environment variables (see .env.example)." },
      { status: 501 }
    );
  }

  const { fileName, contentType } = await req.json().catch(() => ({}));
  if (!fileName || !contentType) {
    return NextResponse.json({ error: "fileName and contentType are required." }, { status: 400 });
  }

  const allowed = ["application/pdf", "video/mp4", "video/webm"];
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: "Only PDF, MP4, or WebM files are allowed." }, { status: 415 });
  }

  const { uploadUrl, publicUrl } = await createPresignedUpload(fileName, contentType);

  return NextResponse.json({
    uploadUrl, // PUT the raw file bytes here directly from the browser
    publicUrl, // save this as the lesson's video/attachment URL afterward
  });
}
