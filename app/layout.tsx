import type { Metadata } from "next";
import { AmbientAudio } from "./components/AmbientAudio";
import { MagicCursor } from "./components/MagicCursor";
import { getLanguageAlternates, siteUrl } from "./lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Sleep Calculator",
  title: "Sleep Calculator: Bedtime, Wake-Up Time, Routine Plan",
  description:
    "Use this sleep calculator to find bedtime, wake-up time, sleep cycle options, a sleep habit score, and a personalized wind-down routine.",
  category: "health",
  alternates: {
    canonical: "/",
    languages: getLanguageAlternates(),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sleep Calculator: Bedtime, Wake-Up Time, Routine Plan",
    description:
      "Use this sleep calculator to find bedtime, wake-up time, sleep cycle options, a sleep habit score, and a personalized wind-down routine.",
    url: "/",
    siteName: "Sleep Calculator",
    locale: "en_US",
    type: "website",
    images: ["/login-forest.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleep Calculator: Bedtime, Wake-Up Time, Routine Plan",
    description:
      "Find bedtime, wake-up time, sleep cycle options, a sleep habit score, and a personalized wind-down routine.",
    images: ["/login-forest.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MagicCursor />
        <AmbientAudio />
      </body>
    </html>
  );
}
