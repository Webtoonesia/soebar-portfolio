import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lfwcyavmwpjfwuiemdjv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd2N5YXZtd3BqZnd1aWVtZGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NzQ5ODYsImV4cCI6MjA5ODU1MDk4Nn0.nwPI9m16c0OwF0LfkLI3IeJJwf_eSdv-lkhY-TX0-vI"
);

const BASE_URL = "https://soebar-design.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from("portfolios")
    .select("slug, updated_at");

  const portfolioPages =
    data?.map((item) => ({
      url: `${BASE_URL}/portfolio/${item.slug}`,
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...portfolioPages,
  ];
}