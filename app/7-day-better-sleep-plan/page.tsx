"use client";

import { useEffect, useState } from "react";
import { AppNavigation } from "../components/AppNavigation";

type PlanSnapshot = {
  bedtime?: string;
  wakeTime?: string;
  sleepDuration?: string;
  routineStart?: string;
  score?: number;
  scoreLabel?: string;
  improvements?: string[];
};

const planSnapshotStorageKey = "sleep-calculator-plan-snapshot";

const previewDays = [
  ["Day 1", "Set the wake-up anchor", "Pick one wake-up time and keep the morning predictable."],
  ["Day 2", "Build the wind-down cue", "Create one repeatable signal that the night routine has started."],
  ["Day 3", "Move screens earlier", "Reduce late-night input without making the routine feel strict."],
  ["Day 4", "Protect the sleep window", "Defend the recommended bedtime from small evening delays."],
  ["Day 5", "Audit caffeine and naps", "Spot the timing choices that push sleepiness later."],
  ["Day 6", "Review the pattern", "Keep what worked and remove what felt unrealistic."],
  ["Day 7", "Make it repeatable", "Turn the week into a simple default routine."],
];

const included = [
  "Personalized bedtime, wake-up, routine start, and sleep duration targets.",
  "Seven daily action pages with evening tasks, morning reviews, and tracking prompts.",
  "Sleep habit score worksheet for weekly self-review.",
  "Printable layout that can be saved as a browser PDF.",
  "Notion sleep tracker setup guide for simple pattern tracking.",
];

export default function SevenDayBetterSleepPlanPage() {
  const [snapshot, setSnapshot] = useState<PlanSnapshot | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(planSnapshotStorageKey);
    if (!saved) return;

    try {
      setSnapshot(JSON.parse(saved) as PlanSnapshot);
    } catch {
      window.localStorage.removeItem(planSnapshotStorageKey);
    }
  }, []);

  return (
    <main className="night-shell">
      <AppNavigation activePath="/7-day-better-sleep-plan" />

      <section className="night-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="healing-card p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">7-Day Better Sleep Plan</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-ink md:text-6xl">
                Turn one sleep calculation into a practical 7-day reset.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-ink/[0.68]">
                The free calculator gives you the timing. This plan gives you the daily structure:
                what to do tonight, what to check tomorrow morning, and how to make the routine
                easier to repeat.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/checkout?offer=7-day-plan"
                  className="rounded bg-ink px-5 py-3 text-center font-bold text-white transition hover:bg-ink/90"
                >
                  Get full plan for $7
                </a>
                <a
                  href="/"
                  className="rounded border border-ink/[0.14] px-5 py-3 text-center font-bold text-ink transition hover:bg-mist"
                >
                  Recalculate first
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-mint/30 bg-white/50 p-5 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-mint">Your current result</p>
              <div className="mt-4 grid gap-3">
                {[
                  ["Bedtime", snapshot?.bedtime || "Use the calculator first"],
                  ["Wake-up", snapshot?.wakeTime || "Use the calculator first"],
                  ["Sleep target", snapshot?.sleepDuration || "Saved after calculation"],
                  ["Routine start", snapshot?.routineStart || "Saved after calculation"],
                  ["Habit score", snapshot?.score ? `${snapshot.score} ${snapshot.scoreLabel || ""}` : "Saved after calculation"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded border border-white/[0.36] bg-white/[0.62] p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">{label}</p>
                    <p className="mt-1 text-lg font-bold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <section className="healing-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-dusk">Included</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">What the $7 plan gives you</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-ink/[0.68]">
              {included.map((item) => (
                <li key={item} className="rounded border border-white/[0.36] bg-white/[0.54] p-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="healing-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Preview</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">The 7-day structure</h2>
            <div className="mt-5 grid gap-3">
              {previewDays.map(([day, title, detail]) => (
                <article key={day} className="rounded border border-white/[0.36] bg-white/[0.54] p-4">
                  <p className="text-sm font-bold text-coral">{day}</p>
                  <h3 className="mt-1 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/[0.64]">{detail}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="healing-card-dark mt-6 p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">One-time purchase</p>
              <h2 className="mt-2 text-2xl font-bold">Start tonight for $7.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/[0.68]">
                No subscription and no automatic renewal. After payment, the full delivery page is
                available on your Google account for 30 days.
              </p>
            </div>
            <a
              href="/checkout?offer=7-day-plan"
              className="rounded bg-mint px-5 py-3 text-center font-bold text-ink transition hover:bg-mint/90"
            >
              Continue to checkout
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
