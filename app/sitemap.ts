import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://assurawy.org";
  const routes = [
    "",
    "/about",
    "/courses",
    "/quran-academy",
    "/articles",
    "/teachers",
    "/contact",
    "/register",
    "/login",
    "/verify",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  // Best-effort: if the database isn't reachable at build time, fall back to
  // just the static routes rather than failing the whole build.
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });
    const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
      url: `${base}/courses/${c.id}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticEntries, ...courseEntries];
  } catch {
    return staticEntries;
  }
}
