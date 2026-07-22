import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SleepDebtCalculator } from "./SleepDebtCalculator";

export const metadata: Metadata = {
  title: "Sleep Debt Calculator: Estimate Your Sleep Deficit",
  description:
    "Use this sleep debt calculator to estimate how much sleep you have missed and plan a gentle recovery schedule.",
};

export default function SleepDebtCalculatorPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader activePath="/sleep-debt-calculator" />
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm font-semibold text-ink/56" aria-label="Breadcrumb">
          <a href="/" className="hover:text-ink">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-ink">Sleep Debt Calculator</span>
        </nav>
        <section className="rounded-lg border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Sleep debt calculator</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-ink md:text-6xl">
            Estimate your sleep debt before it becomes a pattern.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
            Compare your target sleep with your actual sleep across a few days. Then use the result to
            plan a realistic recovery instead of trying to fix everything in one night.
          </p>
        </section>

        <div className="mt-6">
          <SleepDebtCalculator />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["What counts as sleep debt?", "The estimated gap between your sleep target and the sleep you actually get."],
            ["How should I repay it?", "Add a small amount of extra sleep across several nights and keep wake-up time stable."],
            ["When should I get help?", "If sleep loss is persistent or disruptive, talk with a qualified professional."],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
              <h2 className="text-lg font-bold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/66">{detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-dusk/15 bg-ink p-5 text-white shadow-soft md:p-6">
          <h2 className="text-2xl font-bold">Turn the estimate into a 7-day recovery plan</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            After calculating your sleep debt, use the main sleep calculator to choose tonight's
            bedtime and build a routine you can repeat.
          </p>
          <a
            href="/#seven-day-plan"
            className="mt-4 inline-flex rounded bg-mint px-4 py-3 font-bold text-ink transition hover:bg-mint/90"
          >
            Get the 7-day sleep plan
          </a>
        </section>
      </section>
    </main>
  );
}
