import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleep Calculator: Find Your Best Bedtime",
  description:
    "Use this sleep calculator to find bedtime, wake-up time, sleep cycle options, and a simple wind-down routine for tonight.",
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
