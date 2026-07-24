import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "About Sleep Calculator",
  description:
    "Learn how Sleep Calculator turns bedtime, wake-up time, and sleep habit inputs into practical planning estimates.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="night-shell">
      <SiteHeader />
      <section className="night-content mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="healing-card p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">About</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-6xl">
            Better sleep planning without false precision.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-ink/[0.7] md:text-lg">
            Sleep Calculator helps people turn a desired bedtime or wake-up time into a practical
            evening plan. The estimates combine sleep duration, time to fall asleep, and a
            simplified sleep-cycle model.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              "Free planning tools",
              "Calculate sleep timing, compare estimated cycles, score habits, and build a wind-down routine.",
            ],
            [
              "Clear limitations",
              "Sleep cycles vary from person to person and from night to night. Results are estimates, not measurements.",
            ],
            [
              "Practical next steps",
              "Use the result as a starting point, keep a consistent wake-up time, and review patterns over several nights.",
            ],
          ].map(([title, detail]) => (
            <article key={title} className="healing-card p-5">
              <h2 className="text-xl font-bold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/[0.66]">{detail}</p>
            </article>
          ))}
        </section>

        <section className="healing-card-dark mt-6 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Important health note</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/[0.7]">
            This site provides general education and planning support. It does not diagnose or treat
            insomnia, sleep apnea, or any medical condition. Seek qualified healthcare guidance for
            persistent sleep problems, breathing interruptions, severe daytime sleepiness, or other
            health concerns.
          </p>
        </section>

        <SiteFooter />
      </section>
    </main>
  );
}
