import type { MetadataRoute } from "next";
import { getLanguageAlternates, locales, siteUrl } from "./lib/i18n";

export const dynamic = "force-static";

const productPaths = [
  "/sleep-routine-planner",
  "/7-day-better-sleep-plan",
  "/notion-sleep-tracker",
  "/sleep-debt-calculator",
  "/checkout",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const languageAlternates = getLanguageAlternates();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates).map(([lang, path]) => [lang, `${siteUrl}${path === "/" ? "" : path}`]),
        ),
      },
    },
    ...locales
      .filter((locale) => locale.code !== "en")
      .map((locale) => ({
        url: `${siteUrl}${locale.path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.82,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languageAlternates).map(([lang, path]) => [
              lang,
              `${siteUrl}${path === "/" ? "" : path}`,
            ]),
          ),
        },
      })),
    ...productPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/checkout" ? 0.55 : 0.72,
    })),
  ];
}
