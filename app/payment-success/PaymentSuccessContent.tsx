"use client";

import { useEffect, useState } from "react";

type PlanSnapshot = {
  bedtime?: string;
  wakeTime?: string;
  sleepDuration?: string;
  timeInBed?: string;
  routineStart?: string;
  score?: number;
  scoreLabel?: string;
  improvements?: string[];
  notes?: string[];
};

const planSnapshotStorageKey = "sleep-calculator-plan-snapshot";

const defaultSnapshot: Required<PlanSnapshot> = {
  bedtime: "10:30 PM",
  wakeTime: "7:00 AM",
  sleepDuration: "7h 30m",
  timeInBed: "7h 45m",
  routineStart: "9:30 PM",
  score: 74,
  scoreLabel: "Good",
  improvements: [
    "Keep the same wake-up time for the next 7 days.",
    "Create a 30-minute screen cutoff before bed.",
    "Start winding down before you feel tired.",
  ],
  notes: ["Use this as a planning guide, not a medical rule."],
};

const planDays = [
  {
    day: "Day 1",
    title: "Set the Wake-Up Anchor",
    goal: "Make tomorrow morning predictable.",
    tonight: [
      "Set one wake-up alarm and keep it unchanged tomorrow.",
      "Move the alarm away from the bed before your wind-down starts.",
      "Write one sentence: what usually makes bedtime slip later?",
    ],
    morning: "Get light within the first hour after waking. A bright window counts.",
    tracking: "Actual wake-up time, morning energy 1-5, one friction point.",
  },
  {
    day: "Day 2",
    title: "Build the Wind-Down Cue",
    goal: "Teach your body when the night routine begins.",
    tonight: [
      "Start your routine at the routine start time shown above.",
      "Choose one cue you can repeat: shower, stretch, dim lights, or prepare clothes.",
      "Keep the final 15 minutes boring and predictable.",
    ],
    morning: "Write whether the cue made it easier to stop the evening.",
    tracking: "Routine start time, cue used, minutes to feel sleepy.",
  },
  {
    day: "Day 3",
    title: "Move Screens Earlier",
    goal: "Reduce the late-night input that keeps the brain alert.",
    tonight: [
      "Set a 30-minute screen cutoff before bedtime.",
      "Move work, email, and planning outside the last hour.",
      "If silence feels uncomfortable, use familiar calm audio instead of scrolling.",
    ],
    morning: "Score how hard the cutoff was from 1-5 and keep the easiest part.",
    tracking: "Screen cutoff time, actual bedtime, sleep quality 1-5.",
  },
  {
    day: "Day 4",
    title: "Protect the Sleep Window",
    goal: "Make your recommended bedtime easier to keep.",
    tonight: [
      "Set a reminder 15 minutes before the wind-down routine starts.",
      "Avoid starting a new episode, task, or conversation near bedtime.",
      "Prepare water, room temperature, and morning items before getting in bed.",
    ],
    morning: "Compare planned bedtime with actual bedtime and write the gap in minutes.",
    tracking: "Bedtime gap, wake-up time, one cause of delay.",
  },
  {
    day: "Day 5",
    title: "Clean Up Caffeine and Naps",
    goal: "Remove common reasons sleepiness arrives late.",
    tonight: [
      "Record your last caffeine time today.",
      "Keep naps short and earlier in the day when possible.",
      "If you are not sleepy, stay low-stimulation instead of forcing sleep.",
    ],
    morning: "Notice whether sleep felt lighter, deeper, or unchanged.",
    tracking: "Caffeine cutoff, nap length, sleep quality 1-5.",
  },
  {
    day: "Day 6",
    title: "Review the Pattern",
    goal: "Find the one change that gave the clearest benefit.",
    tonight: [
      "Repeat the habit that helped most from Days 1-5.",
      "Remove one rule that felt unrealistic.",
      "Keep the same wake-up anchor tomorrow.",
    ],
    morning: "Choose your strongest sleep trigger: timing, screens, caffeine, naps, light, noise, or stress.",
    tracking: "Best habit, weakest habit, top trigger.",
  },
  {
    day: "Day 7",
    title: "Make It Repeatable",
    goal: "Turn the week into a routine you can actually keep.",
    tonight: [
      "Write your default bedtime routine in three steps.",
      "Create a backup routine for busy nights.",
      "Choose your wake-up target for the next 7 days.",
    ],
    morning: "Retake your habit score and keep the two habits that moved the score most.",
    tracking: "Final score, next wake-up target, two habits to keep.",
  },
];

const scoreRows = [
  ["Wake-up consistency", "20", "Same wake-up time on most days."],
  ["Wind-down routine", "20", "A repeatable routine starts before bedtime."],
  ["Screen timing", "15", "Screens stop or become passive before bed."],
  ["Caffeine timing", "15", "Caffeine is not used late in the day."],
  ["Sleep window", "20", "Time in bed roughly matches the sleep target."],
  ["Morning reset", "10", "Light and movement anchor the next day."],
];

const notionFields = [
  ["Date", "Date"],
  ["Bedtime", "Time"],
  ["Wake-up time", "Time"],
  ["Sleep quality", "Select 1-5"],
  ["Caffeine cutoff", "Time"],
  ["Screen cutoff", "Time"],
  ["Nap length", "Number"],
  ["Mood on waking", "Select"],
  ["Notes", "Text"],
];

export function PaymentSuccessContent() {
  const [snapshot, setSnapshot] = useState<Required<PlanSnapshot>>(defaultSnapshot);

  useEffect(() => {
    const saved = window.localStorage.getItem(planSnapshotStorageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as PlanSnapshot;
      setSnapshot({
        bedtime: parsed.bedtime || defaultSnapshot.bedtime,
        wakeTime: parsed.wakeTime || defaultSnapshot.wakeTime,
        sleepDuration: parsed.sleepDuration || defaultSnapshot.sleepDuration,
        timeInBed: parsed.timeInBed || defaultSnapshot.timeInBed,
        routineStart: parsed.routineStart || defaultSnapshot.routineStart,
        score: parsed.score || defaultSnapshot.score,
        scoreLabel: parsed.scoreLabel || defaultSnapshot.scoreLabel,
        improvements: parsed.improvements?.length ? parsed.improvements : defaultSnapshot.improvements,
        notes: parsed.notes?.length ? parsed.notes : defaultSnapshot.notes,
      });
    } catch {
      window.localStorage.removeItem(planSnapshotStorageKey);
    }
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-mint/25 bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Payment successful</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">
          Your 7-Day Better Sleep Plan is ready.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/66">
          This is your paid delivery page. Print it, save it as a PDF, or keep it open while you
          follow the plan this week. Access is saved to your Google account for 30 days.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Bedtime target", snapshot.bedtime],
            ["Wake-up target", snapshot.wakeTime],
            ["Sleep duration", snapshot.sleepDuration],
            ["Routine starts", snapshot.routineStart],
            ["Habit score", `${snapshot.score} ${snapshot.scoreLabel}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded border border-ink/10 bg-mist p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">{label}</p>
              <p className="mt-1 text-xl font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded bg-ink px-4 py-3 text-center font-bold text-white transition hover:bg-ink/90"
          >
            Print or save as PDF
          </button>
          <a
            href="/"
            className="rounded border border-ink/14 px-4 py-3 text-center font-bold text-ink transition hover:bg-mist"
          >
            Back to calculator
          </a>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Your focus</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Start with the highest-leverage fixes.</h2>
          <div className="mt-5 grid gap-3">
            {snapshot.improvements.map((item) => (
              <p key={item} className="rounded border border-ink/10 bg-mist p-3 text-sm leading-6 text-ink/68">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-5 rounded border border-pollen/35 bg-pollen/12 p-4">
            <p className="font-bold text-ink">Tonight&apos;s rule</p>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              Start winding down at <strong>{snapshot.routineStart}</strong>, get in bed around{" "}
              <strong>{snapshot.bedtime}</strong>, and protect <strong>{snapshot.timeInBed}</strong> in bed.
            </p>
          </div>
          <div className="mt-5 rounded border border-ink/10 bg-mist p-4">
            <p className="font-bold text-ink">Personal notes</p>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-ink/64">
              {snapshot.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-dusk">7-day plan</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">One daily reset, then one morning review.</h2>
          <div className="mt-5 grid gap-4">
            {planDays.map((day) => (
              <article key={day.day} className="rounded border border-ink/10 bg-mist p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-coral">{day.day}</p>
                    <h3 className="mt-1 text-xl font-bold text-ink">{day.title}</h3>
                  </div>
                  <span className="rounded bg-white px-3 py-1 text-sm font-bold text-ink/68">{day.goal}</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_0.8fr]">
                  <div className="rounded border border-white bg-white p-3">
                    <p className="font-bold text-ink">Tonight</p>
                    <ul className="mt-2 grid gap-2 text-sm leading-6 text-ink/68">
                      {day.tonight.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded border border-white bg-white p-3">
                      <p className="font-bold text-ink">Morning review</p>
                      <p className="mt-2 text-sm leading-6 text-ink/68">{day.morning}</p>
                    </div>
                    <div className="rounded border border-white bg-white p-3">
                      <p className="font-bold text-ink">Track</p>
                      <p className="mt-2 text-sm leading-6 text-ink/68">{day.tracking}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-dusk">Sleep Habit Score</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Use this worksheet once per week.</h2>
          <div className="mt-4 overflow-hidden rounded border border-ink/10">
            {scoreRows.map(([name, points, detail]) => (
              <div key={name} className="grid gap-2 border-b border-ink/10 p-3 last:border-b-0 sm:grid-cols-[1fr_72px]">
                <div>
                  <p className="font-bold text-ink">{name}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/62">{detail}</p>
                </div>
                <p className="font-bold text-dusk">{points} pts</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pollen">Notion tracker</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Create a simple sleep database.</h2>
          <div className="mt-4 overflow-hidden rounded border border-ink/10">
            {notionFields.map(([field, type]) => (
              <div key={field} className="grid grid-cols-[1fr_0.75fr] border-b border-ink/10 p-3 text-sm last:border-b-0">
                <p className="font-bold text-ink">{field}</p>
                <p className="text-ink/62">{type}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/62">
            Add one weekly view grouped by sleep quality, then compare caffeine cutoff, screen cutoff,
            and actual bedtime. The goal is pattern recognition, not perfect tracking.
          </p>
        </section>
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
