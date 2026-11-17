import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/explore",
    "/library",
    "/plants",
    "/yoga",
    "/nutrition",
    "/compare",
    "/learn",
    "/schemes",
    "/community",
    "/hospitals",
    "/emergency",
    "/help",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const articles = ARTICLES.map((a) => ({
    url: `${base}/library/${a.slug}`,
    lastModified: new Date(a.lastReviewed),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...routes, ...articles];
}
