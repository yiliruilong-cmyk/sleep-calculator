"use client";

import { useMemo, useState } from "react";
import { addMinutes, formatDuration, formatTime, toMinutes } from "../lib/time";

export function SleepRoutinePlanner() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepHours, setSleepHours] = useState(8);
  const [windDown, setWindDown] = useState(60);
  const [latency, setLatency] = useState(15);
  const [style, setStyle] = useState("calm");

  const plan = useMemo(() => {
    const wake = toMinutes(wakeTime, 7 * 60);
    const bedtime = addMinutes(wake, -(sleepHours * 60 + latency));
    const start = addMinutes(bedtime, -windDown);
    const middle = addMinutes(start, Math.round(windDown / 2));
    const finalCue = addMinutes(bedtime, -15);
    const styleCue =
      style === "busy"
        ? "Close open loops with a short tomorrow list."
        : style === "screen"
          ? "Move your phone away and choose a low-stimulation activity."
          : "Dim lights and keep the evening quiet.";

    return {
      bedtime,
      steps: [
        { time: formatTime(start), title: "Start wind-down", detail: styleCue },
        { time: formatTime(middle), title: "Prepare your room", detail: "Lower light, reduce noise, and set your alarm." },
        { time: formatTime(finalCue), title: "Final cue", detail: "Brush teeth, stretch lightly, or read something familiar." },
        { time: formatTime(bedtime), title: "Get in bed", detail: "Use this as your lights-out target." },
        { time: formatTime(addMinutes(bedtime, latency)), title: "Estimated sleep time", detail: "This includes your usual time to fall asleep." },
      ],
      wake,
    };
  }, [latency, sleepHours, style, wakeTime, windDown]);

  return (
    <section className="healing-card p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Wake-up time</span>
          <input
            type="time"
            value={wakeTime}
            onChange={(event) => setWakeTime(event.target.value)}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Sleep target</span>
          <select
            value={sleepHours}
            onChange={(event) => setSleepHours(Number(event.target.value))}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          >
            {[7, 7.5, 8, 8.5, 9].map((hour) => (
              <option key={hour} value={hour}>
                {hour} hours
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Wind-down</span>
          <select
            value={windDown}
            onChange={(event) => setWindDown(Number(event.target.value))}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          >
            {[30, 45, 60, 90].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Fall-asleep time</span>
          <select
            value={latency}
            onChange={(event) => setLatency(Number(event.target.value))}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          >
            {[5, 10, 15, 20, 30, 45].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Evening style</span>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          >
            <option value="calm">Calm</option>
            <option value="busy">Busy mind</option>
            <option value="screen">Screen-heavy</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="healing-card-dark p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Recommended bedtime</p>
          <p className="mt-3 text-5xl font-bold">{formatTime(plan.bedtime)}</p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            This plan gives you {formatDuration(sleepHours * 60)} of sleep before a {formatTime(plan.wake)} wake-up.
          </p>
        </div>
        <div className="grid gap-3">
          {plan.steps.map((step) => (
            <article key={`${step.time}-${step.title}`} className="grid grid-cols-[92px_1fr] gap-3 rounded border border-white/[0.36] bg-white/[0.54] p-3">
              <time className="pt-1 text-sm font-bold text-coral">{step.time}</time>
              <div>
                <h2 className="font-bold text-ink">{step.title}</h2>
                <p className="mt-1 text-sm leading-6 text-ink/[0.64]">{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
