import type { MetadataRoute } from "next";

const siteUrl = "https://yz-control.top";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tech`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/teams`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/recruit`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/wall`, changeFrequency: "daily", priority: 0.7 },
  ];
}
