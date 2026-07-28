"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/dashboard/UI";
export const dynamic = 'force-dynamic';
type Attachment = { id: string; fileName: string; fileUrl: string };
type Lesson = {
  id: string;
  title: string;
  order: number;
  videoUrl: string | null;
  audioUrl: string | null;
  content: string | null;
  attachments: Attachment[];
  quiz: { id: string; title: string } | null;
};
type Module = { id: string; title: string; order: number; lessons: Lesson[] };
type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  published: boolean;
  teacher: { name: string };
  modules: Module[];
};

/**
 * Shared upload helper — prefers a direct-to-storage presigned upload
 * (required for larger files, since serverless request bodies cap out
 * around ~4.5MB) and falls back to the small-file local route when cloud
 * storage isn't configured. Used for both attachments and lesson audio.
 */
async function uploadFileToStorage(file: File): Promise<{ fileName: string; fileUrl: string }> {
  const presignRes = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  });

  if (presignRes.ok) {
    const { uploadUrl, publicUrl } = await presignRes.json();
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error("Upload to cloud storage failed.");
    return { fileName: file.name, fileUrl: publicUrl };
  }

  if (presignRes.status === 501) {
    if (file.size > 50 * 1024 * 1024) {
      throw new Error(
        "This file is over 50MB and cloud storage isn't configured yet. Set the S3_* environment variables (see .env.example) to enable large uploads."
      );
    }
    const form = new FormData();
    form.append("file", file);
    const uploadRes = await fetch("/api/uploads", { method: "POST", body: form });
    const uploadData = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed.");
    return { fileName: uploadData.fileName, fileUrl: uploadData.fileUrl };
  }

  const data = await presignRes.json().catch(() => ({}));
  throw new Error(data.error || "Could not start upload.");
}

export default function CourseManagePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/courses/${id}`);
    if (!res.ok) {
      setError("Course not found.");
      return;
    }
    const data = await res.json();
    setCourse(data.course);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublish() {
    if (!course) return;
    await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    await load();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!course) return <p className="text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            Manage Course
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-deep">{course.title}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {course.level} · Instructor {course.teacher.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={course.published ? "emerald" : "neutral"}>
            {course.published ? "Published" : "Draft"}
          </Badge>
          <button
            onClick={togglePublish}
            className="focus-ring rounded-full border border-gold px-4 py-2 text-xs font-semibold text-deep hover:bg-gold"
          >
            {course.published ? "Unpublish" : "Publish"}
          </button>
          <Link
            href={`/teacher/courses/${course.id}/analytics`}
            className="focus-ring rounded-full bg-deep px-4 py-2 text-xs font-semibold text-cream hover:bg-emerald"
          >
            View Analytics
          </Link>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">{course.description}</p>

      <div className="mt-10 space-y-6">
        {course.modules
          .sort((a, b) => a.order - b.order)
          .map((m) => (
            <ModuleCard key={m.id} module={m} courseId={course.id} onChange={load} />
          ))}
      </div>

      <AddModuleForm courseId={course.id} onAdded={load} />
    </div>
  );
}

function ModuleCard({
  module: m,
  courseId,
  onChange,
}: {
  module: Module;
  courseId: string;
  onChange: () => void;
}) {
  const [addingLesson, setAddingLesson] = useState(false);

  async function deleteModule() {
    if (!confirm(`Delete module "${m.title}" and all its lessons?`)) return;
    await fetch(`/api/modules/${m.id}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-deep">
          {m.order}. {m.title}
        </h2>
        <button
          onClick={deleteModule}
          className="focus-ring rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Delete Module
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {m.lessons
          .sort((a, b) => a.order - b.order)
          .map((l) => (
            <LessonRow key={l.id} lesson={l} onChange={onChange} />
          ))}
        {m.lessons.length === 0 && (
          <p className="text-sm text-ink/45">No lessons in this module yet.</p>
        )}
      </div>

      {addingLesson ? (
        <AddLessonForm
          moduleId={m.id}
          onDone={() => {
            setAddingLesson(false);
            onChange();
          }}
          onCancel={() => setAddingLesson(false)}
        />
      ) : (
        <button
          onClick={() => setAddingLesson(true)}
          className="focus-ring mt-4 rounded-full border border-emerald px-4 py-2 text-xs font-semibold text-emerald hover:bg-emerald/10"
        >
          + Add Lesson
        </button>
      )}
    </div>
  );
}

function LessonRow({ lesson: l, onChange }: { lesson: Lesson; onChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function deleteLesson() {
    if (!confirm(`Delete lesson "${l.title}"?`)) return;
    await fetch(`/api/lessons/${l.id}`, { method: "DELETE" });
    onChange();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    try {
      const { fileName, fileUrl } = await uploadFileToStorage(file);
      await fetch(`/api/lessons/${l.id}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileUrl }),
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
      onChange();
    }
  }

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    setUploadError(null);

    try {
      const { fileUrl } = await uploadFileToStorage(file);
      await fetch(`/api/lessons/${l.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: fileUrl }),
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Audio upload failed.");
    } finally {
      setUploadingAudio(false);
      e.target.value = "";
      onChange();
    }
  }

  async function removeAudio() {
    await fetch(`/api/lessons/${l.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl: null }),
    });
    onChange();
  }

  async function removeAttachment(attId: string) {
    await fetch(`/api/attachments/${attId}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className="rounded-lg border border-deep/10 bg-cream/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="focus-ring flex items-center gap-2 text-left text-sm font-medium text-deep"
        >
          <span className="text-ink/40">{expanded ? "▾" : "▸"}</span>
          {l.order}. {l.title}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {l.videoUrl && <Badge tone="emerald">Video</Badge>}
          {l.audioUrl && <Badge tone="emerald">🎙️ Audio</Badge>}
          {l.attachments.length > 0 && <Badge tone="gold">{l.attachments.length} PDF</Badge>}
          {l.quiz ? (
            <Link
              href={`/teacher/lessons/${l.id}/quiz`}
              className="focus-ring rounded-full border border-emerald px-3 py-1 text-xs font-semibold text-emerald hover:bg-emerald/10"
            >
              Edit Quiz
            </Link>
          ) : (
            <Link
              href={`/teacher/lessons/${l.id}/quiz`}
              className="focus-ring rounded-full border border-deep/15 px-3 py-1 text-xs font-semibold text-deep hover:border-gold"
            >
              + Add Quiz
            </Link>
          )}
          <button
            onClick={deleteLesson}
            className="focus-ring rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-deep/10 pt-4">
          {l.content && <p className="text-sm text-ink/70">{l.content}</p>}
          {l.videoUrl && (
            <p className="text-xs text-ink/60">
              Video: <span className="font-mono">{l.videoUrl}</span>
            </p>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-deep">
              🎙️ Lesson Audio (recitation / lecture recording)
            </p>
            {l.audioUrl ? (
              <div className="flex items-center gap-3">
                <audio src={l.audioUrl} controls className="h-9 flex-1" preload="metadata" />
                <button
                  onClick={removeAudio}
                  className="focus-ring shrink-0 text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full border border-deep/15 px-3 py-1.5 text-xs font-semibold text-deep hover:border-gold">
                {uploadingAudio ? "Uploading…" : "＋ Upload audio recording"}
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  disabled={uploadingAudio}
                  onChange={handleAudioUpload}
                />
              </label>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-deep">
              PDF Attachments
            </p>
            <ul className="space-y-1.5">
              {l.attachments.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                  <a
                    href={a.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-emerald hover:text-deep"
                  >
                    📄 {a.fileName}
                  </a>
                  <button
                    onClick={() => removeAttachment(a.id)}
                    className="focus-ring shrink-0 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {l.attachments.length === 0 && (
                <li className="text-xs text-ink/45">No PDFs attached yet.</li>
              )}
            </ul>

            <label className="focus-ring mt-3 inline-block cursor-pointer rounded-full border border-deep/15 px-4 py-2 text-xs font-semibold text-deep hover:border-emerald hover:text-emerald">
              {uploading ? "Uploading…" : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function AddModuleForm({ courseId, onAdded }: { courseId: string; onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setSubmitting(false);
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New module title, e.g. Fasting"
        className="focus-ring flex-1 rounded-lg border border-deep/15 bg-white px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
      >
        + Add Module
      </button>
    </form>
  );
}

function AddLessonForm({
  moduleId,
  onDone,
  onCancel,
}: {
  moduleId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await fetch(`/api/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, videoUrl }),
    });
    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-emerald/30 bg-emerald/5 p-4">
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lesson title"
        className="focus-ring w-full rounded-lg border border-deep/15 bg-white px-3 py-2 text-sm"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Lesson notes / content (optional)"
        rows={2}
        className="focus-ring w-full rounded-lg border border-deep/15 bg-white px-3 py-2 text-sm"
      />
      <input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Video URL (optional — e.g. an uploaded or hosted video link)"
        className="focus-ring w-full rounded-lg border border-deep/15 bg-white px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-cream hover:bg-emeraldLight disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save Lesson"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="focus-ring rounded-full border border-deep/15 px-4 py-2 text-xs font-semibold text-deep"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
