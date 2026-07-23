/**
 * Cloud file storage for lesson PDFs and videos.
 *
 * Works with ANY S3-compatible provider — AWS S3, Cloudflare R2, Supabase
 * Storage, Backblaze B2, DigitalOcean Spaces, etc. Configure:
 *
 *   S3_ENDPOINT           e.g. https://<account>.r2.cloudflarestorage.com
 *                         (omit entirely for real AWS S3)
 *   S3_REGION             e.g. "auto" for R2, "us-east-1" for AWS
 *   S3_BUCKET             bucket name
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *   S3_PUBLIC_URL_BASE    the public base URL files are served from, e.g.
 *                         https://pub-xxxx.r2.dev or a CloudFront domain
 *                         fronting the bucket
 *
 * If these aren't set, `isCloudStorageConfigured()` returns false and the
 * app falls back to writing into /public/uploads (see app/api/uploads),
 * which only works on a persistent filesystem (self-hosted/Docker) — not
 * serverless. Configure the variables above before deploying file uploads
 * to Vercel.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export function isCloudStorageConfigured() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_PUBLIC_URL_BASE
  );
}

function getClient() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT, // leave undefined for real AWS S3
    // Path-style addressing (bucket as part of the URL path, not a subdomain)
    // is required for R2/Spaces/MinIO when using their custom endpoints —
    // virtual-hosted-style (bucket.endpoint) only resolves for real AWS S3
    // or providers with wildcard DNS configured for it.
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

/** Returns a presigned PUT URL the browser can upload directly to, plus the public URL it'll live at afterward. */
export async function createPresignedUpload(originalName: string, contentType: string) {
  const client = getClient();
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `lessons/${crypto.randomUUID()}-${safeName}`;

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 60 * 5 } // 5 minutes to complete the upload
  );

  const publicUrl = `${process.env.S3_PUBLIC_URL_BASE!.replace(/\/$/, "")}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/** Directly uploads a buffer server-side (used as the local-storage fallback's cloud equivalent, if ever needed). */
export async function uploadBuffer(buffer: Buffer, originalName: string, contentType: string) {
  const client = getClient();
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `lessons/${crypto.randomUUID()}-${safeName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicUrl = `${process.env.S3_PUBLIC_URL_BASE!.replace(/\/$/, "")}/${key}`;
  return { publicUrl, key };
}

export async function deleteObject(key: string) {
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }));
}
