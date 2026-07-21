"use client";

import { useMemo, useState } from "react";

type Mode = "wake" | "bed" | "duration";

type CycleOption = {
  cycles: number;
  bedtime: number;
  wakeTime: number;
  sleepMinutes: number;
  timeInBed: number;
  label: string;
  note: string;
};

const cycleCounts = [4, 5, 6];

const modeCopy: Record<Mode, string> = {
  wake: "I want to wake up at...",
  bed: "I want to go to bed at...",
  duration: "I want to sleep for...",
};

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function wrapMinutes(value: number) {
  const day = 24 * 60;
  return ((value % day) + day) % day;
}

function formatTime(totalMinutes: number) {
  const minutes = wrapMinutes(Math.round(totalMinutes));
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!minutes) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function addMinutes(time: number, delta: number) {
  return wrapMinutes(time + delta);
}

function getOptionLabel(cycles: number, sleepMinutes: number, goalMinutes: number) {
  if (sleepMinutes < 420) return "Short sleep";
  if (Math.abs(sleepMinutes - goalMinutes) <= 45) return "Best match";
  if (cycles >= 6) return "Longer option";
  return "Flexible option";
}

function getOptionNote(cycles: number, sleepMinutes: number) {
  if (sleepMinutes < 420) {
    return "Useful when time is tight, but below the usual adult sleep target.";
  }
  if (cycles === 5) {
    return "A common full-night option built around five sleep cycles.";
  }
  if (cycles === 6) {
    return "A generous option when recovery matters more than an early start.";
  }
  return "A lighter option that may work for occasional short nights.";
}

function buildRoutine(
  recommendedBedtime: number,
  latency: number,
  routineLength: number,
  screenUse: boolean,
  caffeine: string,
  nap: string,
) {
  const getInBed = recommendedBedtime;
  const estimatedSleep = addMinutes(getInBed, latency);
  const start = addMinutes(getInBed, -routineLength);
  const midpoint = addMinutes(start, Math.max(15, Math.round(routineLength / 2)));
  const screenCutoff = addMinutes(getInBed, -30);

  const steps = [
    {
      time: formatTime(start),
      title: "Start winding down",
      detail: "Lower the lights and move into a calmer part of the evening.",
    },
    {
      time: formatTime(midpoint),
      title: screenUse ? "Switch away from scrolling" : "Keep stimulation low",
      detail: screenUse
        ? "Put your phone away or choose something slow and non-interactive."
        : "Keep the room quiet and avoid work-like tasks.",
    },
    {
      time: formatTime(screenCutoff),
      title: "Prepare your sleep environment",
      detail: "Cool the room, reduce noise, and set anything you need for morning.",
    },
    {
      time: formatTime(getInBed),
      title: "Get in bed",
      detail: "Use this as your lights-out target, with a small buffer to settle in.",
    },
    {
      time: formatTime(estimatedSleep),
      title: "Estimated sleep time",
      detail: "This includes your usual time to fall asleep.",
    },
  ];

  const notes = [];
  if (caffeine === "late") {
    notes.push("Late caffeine may make it harder to fall asleep tonight.");
  } else if (caffeine === "afternoon") {
    notes.push("Afternoon caffeine can still affect some people at bedtime.");
  }
  if (nap === "late") {
    notes.push("A late nap may push your natural sleepiness later.");
  }
  if (latency >= 30) {
    notes.push("Because you usually need extra time to fall asleep, start the routine earlier.");
  }

  return { steps, notes };
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("wake");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("22:30");
  const [sleepGoal, setSleepGoal] = useState(8);
  const [latency, setLatency] = useState(15);
  const [routineLength, setRoutineLength] = useState(60);
  const [ageGroup, setAgeGroup] = useState("adult");
  const [caffeine, setCaffeine] = useState("none");
  const [nap, setNap] = useState("none");
  const [screenUse, setScreenUse] = useState(true);

  const results = useMemo(() => {
    const wake = toMinutes(wakeTime);
    const bed = toMinutes(bedTime);
    const goalMinutes = sleepGoal * 60;

    return cycleCounts.map((cycles) => {
      const sleepMinutes = cycles * 90;
      const bedtime =
        mode === "wake"
          ? addMinutes(wake, -(sleepMinutes + latency))
          : mode === "duration"
            ? addMinutes(wake, -(goalMinutes + latency))
            : bed;
      const wakeTarget =
        mode === "bed"
          ? addMinutes(bed, sleepMinutes + latency)
          : mode === "duration"
            ? wake
            : wake;
      const computedSleep = mode === "duration" ? goalMinutes : sleepMinutes;
      const computedCycles = mode === "duration" ? Math.round(goalMinutes / 90) : cycles;

      return {
        cycles: computedCycles,
        bedtime,
        wakeTime: wakeTarget,
        sleepMinutes: computedSleep,
        timeInBed: computedSleep + latency,
        label: getOptionLabel(computedCycles, computedSleep, goalMinutes),
        note: getOptionNote(computedCycles, computedSleep),
      };
    });
  }, [bedTime, latency, mode, sleepGoal, wakeTime]);

  const best = useMemo(() => {
    return [...results].sort((a, b) => {
      const goalMinutes = sleepGoal * 60;
      const aDiff = Math.abs(a.sleepMinutes - goalMinutes);
      const bDiff = Math.abs(b.sleepMinutes - goalMinutes);
      return aDiff - bDiff;
    })[0];
  }, [results, sleepGoal]);

  const routine = useMemo(
    () => buildRoutine(best.bedtime, latency, routineLength, screenUse, caffeine, nap),
    [best.bedtime, caffeine, latency, nap, routineLength, screenUse],
  );

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5">
          <header className="flex items-center justify-between gap-3">
            <a href="#calculator" className="flex items-center gap-3" aria-label="Sleep Calculator home">
              <span className="grid h-10 w-10 place-items-center rounded bg-ink text-lg font-bold text-white">
                SC
              </span>
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-mint">
                  Better Sleep Tools
                </span>
                <span className="block text-lg font-bold text-ink">Sleep Calculator</span>
              </span>
            </a>
            <nav className="hidden items-center gap-4 text-sm font-semibold text-ink/70 sm:flex">
              <a className="hover:text-ink" href="#calculator">
                Calculator
              </a>
              <a className="hover:text-ink" href="#routine">
                Routine
              </a>
              <a className="hover:text-ink" href="#faq">
                FAQ
              </a>
            </nav>
          </header>

          <section className="rounded-lg border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur md:p-7">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink/65">
              <span className="rounded bg-mint/12 px-3 py-1 text-mint">Sleep cycles</span>
              <span className="rounded bg-coral/12 px-3 py-1 text-coral">Wind-down plan</span>
              <span className="rounded bg-pollen/18 px-3 py-1 text-ink">No signup</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink md:text-6xl">
              Find your best bedtime for tonight.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
              Calculate bedtime, wake-up time, sleep cycle options, and a practical wind-down routine
              you can follow before lights out.
            </p>
          </section>

          <section id="calculator" className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ink">Sleep Calculator</h2>
                <p className="mt-1 text-sm text-ink/60">Choose a mode and adjust the details.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 rounded bg-mist p-1 sm:grid-cols-3" role="tablist">
                {(Object.keys(modeCopy) as Mode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded px-3 py-2 text-sm font-semibold transition ${
                      mode === item ? "bg-ink text-white" : "text-ink/70 hover:bg-white"
                    }`}
                    aria-pressed={mode === item}
                  >
                    {modeCopy[item]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Wake-up time</span>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(event) => setWakeTime(event.target.value)}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-lg font-semibold text-ink outline-none focus:border-dusk"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Bedtime</span>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(event) => setBedTime(event.target.value)}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-lg font-semibold text-ink outline-none focus:border-dusk"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Sleep goal</span>
                <select
                  value={sleepGoal}
                  onChange={(event) => setSleepGoal(Number(event.target.value))}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
                >
                  <option value={6}>6 hours</option>
                  <option value={7}>7 hours</option>
                  <option value={7.5}>7.5 hours</option>
                  <option value={8}>8 hours</option>
                  <option value={9}>9 hours</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Time to fall asleep</span>
                <select
                  value={latency}
                  onChange={(event) => setLatency(Number(event.target.value))}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Age group</span>
                <select
                  value={ageGroup}
                  onChange={(event) => setAgeGroup(event.target.value)}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
                >
                  <option value="adult">Adult</option>
                  <option value="teen">Teen</option>
                  <option value="older-adult">Older adult</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Wind-down length</span>
                <select
                  value={routineLength}
                  onChange={(event) => setRoutineLength(Number(event.target.value))}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Caffeine today</span>
                <select
                  value={caffeine}
                  onChange={(event) => setCaffeine(event.target.value)}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
                >
                  <option value="none">None or morning only</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="late">Evening or late day</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Nap today</span>
                <select
                  value={nap}
                  onChange={(event) => setNap(event.target.value)}
                  className="mt-2 w-full rounded border border-ink/12 bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
                >
                  <option value="none">No nap</option>
                  <option value="early">Early short nap</option>
                  <option value="late">Late or long nap</option>
                </select>
              </label>
            </div>

            <label className="mt-4 flex items-start gap-3 rounded border border-ink/10 bg-mist px-3 py-3">
              <input
                type="checkbox"
                checked={screenUse}
                onChange={(event) => setScreenUse(event.target.checked)}
                className="mt-1 h-4 w-4 accent-dusk"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">I usually use screens before bed</span>
                <span className="block text-sm text-ink/60">Adds a simple cutoff suggestion to the plan.</span>
              </span>
            </label>
          </section>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-mint">Best match</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-white/58">Bedtime</p>
                <p className="mt-1 text-3xl font-bold">{formatTime(best.bedtime)}</p>
              </div>
              <div>
                <p className="text-sm text-white/58">Wake-up</p>
                <p className="mt-1 text-3xl font-bold">{formatTime(best.wakeTime)}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded bg-white/8 px-2 py-3">
                <p className="text-xl font-bold">{best.cycles}</p>
                <p className="text-xs text-white/58">cycles</p>
              </div>
              <div className="rounded bg-white/8 px-2 py-3">
                <p className="text-xl font-bold">{formatDuration(best.sleepMinutes)}</p>
                <p className="text-xs text-white/58">sleep</p>
              </div>
              <div className="rounded bg-white/8 px-2 py-3">
                <p className="text-xl font-bold">{formatDuration(best.timeInBed)}</p>
                <p className="text-xs text-white/58">in bed</p>
              </div>
            </div>
            <p className="mt-4 rounded bg-mint/16 p-3 text-sm leading-6 text-white/82">
              {ageGroup === "adult"
                ? "Most adults are commonly guided toward at least 7 hours of sleep. This tool is for planning, not diagnosis."
                : "Sleep needs vary by age and person. Use this as a planning guide, not a medical rule."}
            </p>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
            <h2 className="text-xl font-bold text-ink">Sleep cycle options</h2>
            <div className="mt-4 flex flex-col gap-3">
              {results.map((option, index) => (
                <article
                  key={`${option.cycles}-${index}`}
                  className={`rounded border p-4 ${
                    option.label === "Best match" ? "border-dusk bg-dusk/6" : "border-ink/10 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded bg-ink px-2 py-1 text-xs font-bold text-white">
                      {option.label}
                    </span>
                    <span className="text-sm font-semibold text-ink/60">
                      {formatDuration(option.sleepMinutes)}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                        Bedtime
                      </p>
                      <p className="mt-1 text-xl font-bold text-ink">{formatTime(option.bedtime)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                        Wake-up
                      </p>
                      <p className="mt-1 text-xl font-bold text-ink">{formatTime(option.wakeTime)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/62">{option.note}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section id="routine" className="mx-auto grid max-w-7xl gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <h2 className="text-2xl font-bold text-ink">Tonight&apos;s wind-down routine</h2>
          <div className="mt-5 flex flex-col gap-3">
            {routine.steps.map((step) => (
              <div key={`${step.time}-${step.title}`} className="grid grid-cols-[88px_1fr] gap-3">
                <time className="pt-1 text-sm font-bold text-coral">{step.time}</time>
                <div className="rounded border border-ink/10 bg-mist p-3">
                  <p className="font-bold text-ink">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/62">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <h2 className="text-2xl font-bold text-ink">What to know tonight</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-mint/25 bg-mint/8 p-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-mint">Cycle basis</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                The calculator uses 90-minute sleep cycles and your usual time to fall asleep.
              </p>
            </div>
            <div className="rounded border border-coral/25 bg-coral/8 p-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-coral">Health boundary</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                It offers general planning guidance and does not diagnose sleep disorders.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded border border-ink/10 bg-mist p-4">
            <p className="font-bold text-ink">Personal notes</p>
            {routine.notes.length ? (
              <ul className="mt-2 space-y-2 text-sm leading-6 text-ink/68">
                {routine.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Your current settings do not add any extra caution notes for tonight.
              </p>
            )}
          </div>
          <div className="mt-4 rounded border border-pollen/30 bg-pollen/12 p-4">
            <p className="font-bold text-ink">Simple sleep tip</p>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              A consistent wake-up time often makes bedtime easier to predict than chasing a perfect
              lights-out time every night.
            </p>
          </div>
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
            <h2 className="text-2xl font-bold text-ink">How this calculator works</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              Start with either a wake-up time or a bedtime. The calculator adds your estimated time
              to fall asleep and maps the night into 90-minute cycles. It then highlights the option
              closest to your sleep goal and builds a practical routine around it.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                ["Sleep latency", "Your usual time to fall asleep is added as a buffer."],
                ["Sleep cycles", "The MVP uses 4, 5, and 6 cycle options."],
                ["Routine timing", "The wind-down plan starts before your recommended bedtime."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded border border-ink/10 bg-mist p-3">
                  <p className="font-bold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/62">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
            <h2 className="text-2xl font-bold text-ink">FAQ</h2>
            <div className="mt-4 divide-y divide-ink/10">
              {[
                [
                  "What is a sleep calculator?",
                  "It is a planning tool that estimates bedtime or wake-up time from sleep cycles and your usual time to fall asleep.",
                ],
                [
                  "Is 7.5 hours of sleep enough?",
                  "For many adults, 7.5 hours fits five 90-minute cycles, but personal needs vary. Many adult sleep recommendations point to at least 7 hours.",
                ],
                [
                  "Can this diagnose insomnia?",
                  "No. It is not a diagnostic tool. Persistent sleep problems should be discussed with a qualified professional.",
                ],
                [
                  "What if I wake up during the night?",
                  "Use the results as a starting point, then adjust your routine and environment. If the problem continues, consider professional guidance.",
                ],
              ].map(([question, answer]) => (
                <details key={question} className="group py-3">
                  <summary className="cursor-pointer list-none font-bold text-ink">
                    {question}
                    <span className="float-right text-dusk group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-6 rounded-lg border border-ink/10 bg-white/82 p-4 text-sm leading-6 text-ink/62">
          This tool provides general sleep planning and education only. It does not diagnose or treat
          insomnia, sleep apnea, or any medical condition. Sources to review before publishing:
          CDC sleep basics, CDC adult sleep duration data, and AASM adult sleep duration guidance.
        </footer>
      </section>
    </main>
  );
}
