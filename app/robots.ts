import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],

    sitemap: "https://soebar-design.netlify.app/sitemap.xml",

    host: "https://soebar-design.netlify.app",
  };
}