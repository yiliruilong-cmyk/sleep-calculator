import type { MetadataRoute } from "next";
import { getLanguageAlternates, locales, siteUrl } from "./lib/i18n";

export const dynamic = "force-static";

const productPaths = [
  "/sleep-routine-planner",
  "/7-day-better-sleep-plan",
  "/notion-sleep-tracker",
  "/sleep-debt-calculator",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const languageAlternates = getLanguageAlternates();

  return [
    {
      url: siteUrl,
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
      changeFrequency: path === "/privacy" || path === "/terms" ? ("yearly" as const) : ("weekly" as const),
      priority: path === "/privacy" || path === "/terms" ? 0.3 : 0.72,
    })),
  ];
}
