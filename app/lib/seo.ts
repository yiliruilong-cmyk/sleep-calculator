import type { Metadata } from "next";
import { siteUrl } from "./i18n";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

const socialImage = "/login-forest.png";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Sleep Calculator",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          noarchive: true,
        }
      : {
          index: true,
          follow: true,
        },
    metadataBase: new URL(siteUrl),
  };
}
