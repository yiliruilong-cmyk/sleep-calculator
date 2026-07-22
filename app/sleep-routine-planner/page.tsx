import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SleepRoutinePlanner } from "./SleepRoutinePlanner";

export const metadata: Metadata = {
  title: "Sleep Routine Planner: Build a Personalized Bedtime Routine",
  description:
    "Create a personalized sleep routine with bedtime, wind-down timing, room preparation, and morning wake-up goals.",
};

export default function SleepRoutinePlannerPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader activePath="/sleep-routine-planner" />
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm font-semibold text-ink/56" aria-label="Breadcrumb">
          <a href="/" className="hover:text-ink">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-ink">Sleep Routine Planner</span>
        </nav>
        <section className="rounded-lg border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">Sleep routine planner</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-ink md:text-6xl">
            Build a bedtime routine that starts before you feel tired.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
            Choose your wake-up time, sleep target, and evening style. The planner turns those inputs
            into a practical wind-down schedule you can follow tonight.
          </p>
        </section>

        <div className="mt-6">
          <SleepRoutinePlanner />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Start earlier", "Your routine should begin before your target bedtime, not when you are already exhausted."],
            ["Keep it repeatable", "Use the same few cues each night so the routine becomes easier to follow."],
            ["Measure the result", "Track bedtime, wake-up time, and sleep quality for a week before changing everything."],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
              <h2 className="text-lg font-bold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/66">{detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-dusk/15 bg-ink p-5 text-white shadow-soft md:p-6">
          <h2 className="text-2xl font-bold">Save this routine as a full sleep plan</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Use the main calculator to compare sleep cycles, score your habits, and print the full
            7-day better sleep plan.
          </p>
          <a
            href="/#calculator"
            className="mt-4 inline-flex rounded bg-mint px-4 py-3 font-bold text-ink transition hover:bg-mint/90"
          >
            Open the sleep calculator
          </a>
        </section>
      </section>
    </main>
  );
}
