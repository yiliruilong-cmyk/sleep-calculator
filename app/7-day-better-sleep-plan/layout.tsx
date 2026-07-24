import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "7-Day Better Sleep Plan: A Practical Sleep Routine Reset",
  description:
    "Turn your sleep calculator result into a practical seven-day plan with evening actions, morning reviews, and a repeatable bedtime routine.",
  path: "/7-day-better-sleep-plan",
});

export default function SevenDayPlanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
