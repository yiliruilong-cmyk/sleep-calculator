"use client";

const planDays = [
  {
    day: "Day 1",
    title: "Set one wake-up anchor",
    checklist: [
      "Choose one wake-up time for the next 7 days.",
      "Put the alarm across the room before your wind-down starts.",
      "Get light within the first hour after waking.",
    ],
  },
  {
    day: "Day 2",
    title: "Create a wind-down cue",
    checklist: [
      "Dim lights 45-60 minutes before bed.",
      "Repeat one simple cue: shower, stretch, or prepare clothes.",
      "Keep the final 15 minutes quiet and predictable.",
    ],
  },
  {
    day: "Day 3",
    title: "Move screens earlier",
    checklist: [
      "Create a 30-minute screen cutoff.",
      "Avoid email, work, and planning in the last hour.",
      "Use calm audio only if silence makes you restless.",
    ],
  },
  {
    day: "Day 4",
    title: "Protect the sleep window",
    checklist: [
      "Set a routine-start reminder.",
      "Avoid starting a new show, task, or conversation near bedtime.",
      "Prepare water, room temperature, and morning items before bed.",
    ],
  },
  {
    day: "Day 5",
    title: "Audit caffeine and naps",
    checklist: [
      "Move caffeine earlier and note the cutoff time.",
      "Keep naps short and earlier in the day.",
      "Track whether sleep feels lighter or deeper.",
    ],
  },
  {
    day: "Day 6",
    title: "Review what actually helped",
    checklist: [
      "Repeat the habit that helped most this week.",
      "Remove one habit that did not help.",
      "Write the gap between planned bedtime and actual bedtime.",
    ],
  },
  {
    day: "Day 7",
    title: "Make the routine repeatable",
    checklist: [
      "Write your default bedtime routine in three steps.",
      "Create a backup routine for busy nights.",
      "Retake your sleep habit score next week.",
    ],
  },
];

const scoreRows = [
  ["Wake-up consistency", "0-20", "Same wake-up time on most days."],
  ["Wind-down routine", "0-20", "A clear routine starts before bedtime."],
  ["Screen timing", "0-15", "Screens stop or slow down before bed."],
  ["Caffeine timing", "0-15", "Caffeine is not used late in the day."],
  ["Sleep window", "0-20", "Time in bed roughly matches your sleep target."],
  ["Morning reset", "0-10", "Morning light and movement help anchor the day."],
];

const notionFields = [
  "Date",
  "Bedtime",
  "Wake-up time",
  "Sleep quality score",
  "Caffeine cutoff",
  "Screen cutoff",
  "Nap length",
  "Mood on waking",
  "Notes",
];

export function PaymentSuccessContent() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-mint/25 bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Payment successful</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">Your 30-day sleep access is active.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/66">
          Your payment was captured and your access is saved to your Google account for 30 days. Use
          the materials below as your first paid sleep planning bundle.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded bg-ink px-4 py-3 text-center font-bold text-white transition hover:bg-ink/90"
          >
            Print or save as PDF
          </button>
          <a
            href="/checkout"
            className="rounded border border-ink/14 px-4 py-3 text-center font-bold text-ink transition hover:bg-mist"
          >
            Back to checkout
          </a>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.86fr]">
        <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
            7-Day Better Sleep Plan
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Follow one small reset each day.</h2>
          <div className="mt-5 grid gap-3">
            {planDays.map((day) => (
              <article key={day.day} className="rounded border border-ink/10 bg-mist p-4">
                <p className="text-sm font-bold text-dusk">{day.day}</p>
                <h3 className="mt-1 text-xl font-bold text-ink">{day.title}</h3>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/68">
                  {day.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">
              Personalized Routine PDF
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Save tonight's routine beside your bed.</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-ink/68">
              <p>1. Return to the calculator and set your wake-up time, sleep goal, and wind-down length.</p>
              <p>2. Open your routine result and use the browser print dialog to save it as PDF.</p>
              <p>3. Add one personal note: the trigger that most often pushes bedtime later.</p>
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-dusk">Sleep Habit Score</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Score your routine once per week.</h2>
            <div className="mt-4 overflow-hidden rounded border border-ink/10">
              {scoreRows.map(([name, points, detail]) => (
                <div key={name} className="grid gap-2 border-b border-ink/10 p-3 last:border-b-0 sm:grid-cols-[1fr_70px]">
                  <div>
                    <p className="font-bold text-ink">{name}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/62">{detail}</p>
                  </div>
                  <p className="font-bold text-dusk">{points}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-pollen">Notion tracker</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Build a simple sleep database.</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {notionFields.map((field) => (
                <span key={field} className="rounded border border-ink/10 bg-mist px-3 py-2 text-sm font-semibold text-ink/72">
                  {field}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/62">
              Create one Notion table with these fields, then add a weekly view grouped by sleep
              quality score. This is enough to spot caffeine, screen, and bedtime patterns.
            </p>
          </section>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-6 text-sm leading-7 text-ink/66 shadow-soft">
        <h2 className="text-2xl font-bold text-ink">Important note</h2>
        <p className="mt-3">
          This product is for general sleep planning and education only. It is not medical advice and
          does not diagnose, prevent, or treat insomnia, sleep apnea, anxiety, depression, or any
          medical condition. If sleep problems persist or affect daily life, speak with a qualified
          professional.
        </p>
        <p className="mt-3">
          Need help with access or a duplicate charge? Contact support@sleepcalculator.life within 7
          days and include your PayPal order ID.
        </p>
      </section>
    </section>
  );
}
