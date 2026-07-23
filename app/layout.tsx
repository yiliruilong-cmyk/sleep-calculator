import type { Metadata } from "next";
import { AmbientAudio } from "./components/AmbientAudio";
import { MagicCursor } from "./components/MagicCursor";
import { getLanguageAlternates, siteUrl } from "./lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sleep Calculator: Bedtime, Wake-Up Time, Routine Plan",
  description:
    "Use this sleep calculator to find bedtime, wake-up time, sleep cycle options, a sleep habit score, and a personalized wind-down routine.",
  alternates: {
    canonical: "/",
    languages: getLanguageAlternates(),
  },
  openGraph: {
    title: "Sleep Calculator: Bedtime, Wake-Up Time, Routine Plan",
    description:
      "Use this sleep calculator to find bedtime, wake-up time, sleep cycle options, a sleep habit score, and a personalized wind-down routine.",
    url: "/",
    type: "website",
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
