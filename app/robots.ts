import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/portal/", "/admin/", "/login"],
    },
    sitemap: "https://yz-control.top/sitemap.xml",
    host: "https://yz-control.top",
  };
}
