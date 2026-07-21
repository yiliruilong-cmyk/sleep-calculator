import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleep Calculator: Bedtime, Wake-Up Time, Routine Plan",
  description:
    "Use this sleep calculator to find bedtime, wake-up time, sleep cycle options, a sleep habit score, and a personalized wind-down routine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
