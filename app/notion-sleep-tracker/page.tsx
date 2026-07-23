import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Notion Sleep Tracker Template: Track Bedtime and Sleep Quality",
  description:
    "Preview a Notion sleep tracker template for bedtime, wake-up time, sleep quality, caffeine, screens, and weekly trends.",
};

const templateBlocks = [
  {
    title: "Sleep log database",
    items: ["Date", "Bedtime", "Wake-up time", "Hours slept", "Sleep quality", "Notes"],
  },
  {
    title: "Habit inputs",
    items: ["Caffeine timing", "Nap timing", "Screen cutoff", "Exercise", "Evening stress"],
  },
  {
    title: "Weekly dashboard",
    items: ["Average sleep", "Best bedtime", "Sleep debt estimate", "Habit experiments", "Next week focus"],
  },
];

export default function NotionSleepTrackerPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader activePath="/notion-sleep-tracker" />
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm font-semibold text-ink/56" aria-label="Breadcrumb">
          <a href="/" className="hover:text-ink">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-ink">Notion Sleep Tracker</span>
        </nav>
        <section className="grid gap-6 rounded-lg border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur md:p-7 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Notion sleep tracker</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-6xl">
              Track your sleep patterns without building a system from scratch.
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/70 md:text-lg">
              Use this Notion sleep tracker template concept to log bedtime, wake-up time, sleep
              quality, caffeine, screens, and weekly trends.
            </p>
            <a
              href="/7-day-better-sleep-plan"
              className="mt-5 inline-flex rounded bg-ink px-4 py-3 font-bold text-white transition hover:bg-ink/90"
            >
              View the 7-day plan
            </a>
          </div>
          <div className="rounded bg-ink p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Template preview</p>
            <div className="mt-4 grid gap-3">
              {["Bedtime consistency", "Sleep quality trend", "Sleep debt review", "Weekly habit experiment"].map(
                (item) => (
                  <div key={item} className="rounded border border-white/10 bg-white/8 p-3">
                    <p className="font-bold">{item}</p>
                    <p className="mt-1 text-sm text-white/62">Included in the tracker workflow</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {templateBlocks.map((block) => (
            <article key={block.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <h2 className="text-xl font-bold text-ink">{block.title}</h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-ink/68">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">How to use it</p>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              ["1", "Log your night", "Record bedtime, wake-up time, and sleep quality each morning."],
              ["2", "Tag the inputs", "Add caffeine, screen time, naps, and stress notes."],
              ["3", "Review weekly", "Look for one pattern instead of over-reading a single night."],
              ["4", "Adjust one habit", "Pick one sleep experiment for the next seven days."],
            ].map(([number, title, detail]) => (
              <article key={title} className="rounded border border-ink/10 bg-mist p-4">
                <span className="grid h-8 w-8 place-items-center rounded bg-ink text-sm font-bold text-white">
                  {number}
                </span>
                <h2 className="mt-3 font-bold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/64">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-dusk/15 bg-ink p-5 text-white shadow-soft md:p-6">
          <h2 className="text-2xl font-bold">Pair the template with the sleep calculator</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Calculate tonight's bedtime first, then use the tracker to see whether your routine is
            actually improving over time.
          </p>
          <a
            href="/"
            className="mt-4 inline-flex rounded bg-mint px-4 py-3 font-bold text-ink transition hover:bg-mint/90"
          >
            Open Sleep Calculator
          </a>
        </section>
      </section>
    </main>
  );
}
