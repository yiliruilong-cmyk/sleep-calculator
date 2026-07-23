"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppNavigation } from "./components/AppNavigation";

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

type SleepScore = {
  score: number;
  label: string;
  insight: string;
  improvements: string[];
};

type GoogleUser = {
  email: string;
  name: string;
  picture: string;
};

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          disableAutoSelect: () => void;
          initialize: (config: {
            callback: (response: GoogleCredentialResponse) => void;
            client_id: string;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              shape?: string;
              size?: string;
              text?: string;
              theme?: string;
            },
          ) => void;
        };
      };
    };
  }
}

const cycleCounts = [4, 5, 6];
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const googleCredentialStorageKey = "sleep-calculator-google-credential";
const planSnapshotStorageKey = "sleep-calculator-plan-snapshot";

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

function parseGoogleCredential(credential: string): GoogleUser | null {
  try {
    const payload = credential.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = JSON.parse(window.atob(padded));

    if (!decoded.email || !decoded.name) {
      return null;
    }

    return {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture || "",
    };
  } catch {
    return null;
  }
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

function getSleepHabitScore(
  sleepGoal: number,
  latency: number,
  routineLength: number,
  screenUse: boolean,
  caffeine: string,
  nap: string,
): SleepScore {
  let score = 82;
  const improvements = [];

  if (sleepGoal < 7) {
    score -= 14;
    improvements.push("Aim for at least 7 hours when your schedule allows.");
  }
  if (latency >= 30) {
    score -= 12;
    improvements.push("Start winding down earlier to account for longer sleep latency.");
  } else if (latency <= 10) {
    score += 4;
  }
  if (routineLength >= 45) {
    score += 6;
  } else {
    score -= 6;
    improvements.push("Give yourself at least 45 minutes of wind-down time.");
  }
  if (screenUse) {
    score -= 8;
    improvements.push("Create a 30-minute screen cutoff before bed.");
  }
  if (caffeine === "late") {
    score -= 18;
    improvements.push("Move caffeine earlier in the day for a cleaner sleep window.");
  } else if (caffeine === "afternoon") {
    score -= 8;
    improvements.push("Test a caffeine cutoff 8 hours before bedtime.");
  }
  if (nap === "late") {
    score -= 12;
    improvements.push("Keep naps earlier and shorter when nighttime sleep matters.");
  } else if (nap === "early") {
    score -= 3;
  }

  const bounded = Math.max(35, Math.min(98, score));
  const label = bounded >= 85 ? "Strong" : bounded >= 70 ? "Good" : bounded >= 55 ? "Needs work" : "At risk";
  const insight =
    bounded >= 85
      ? "Your inputs suggest a solid sleep setup. Keep the timing consistent."
      : bounded >= 70
        ? "You have a workable routine, with a few changes that could make it easier to follow."
        : "Your routine has a few friction points that may make sleep timing harder to keep.";

  return {
    score: bounded,
    label,
    insight,
    improvements: improvements.slice(0, 3),
  };
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
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

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

  const sleepScore = useMemo(
    () => getSleepHabitScore(sleepGoal, latency, routineLength, screenUse, caffeine, nap),
    [caffeine, latency, nap, routineLength, screenUse, sleepGoal],
  );

  useEffect(() => {
    const savedCredential = window.localStorage.getItem(googleCredentialStorageKey);
    if (savedCredential) {
      const user = parseGoogleCredential(savedCredential);
      if (user) {
        setGoogleUser(user);
      } else {
        window.localStorage.removeItem(googleCredentialStorageKey);
        window.localStorage.removeItem("sleep-calculator-google-user");
      }
    } else {
      window.localStorage.removeItem("sleep-calculator-google-user");
    }
  }, []);

  useEffect(() => {
    if (!googleClientId || googleUser) return;

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (!response.credential) return;

          const user = parseGoogleCredential(response.credential);
          if (!user) return;

          window.localStorage.setItem(googleCredentialStorageKey, response.credential);
          window.localStorage.setItem("sleep-calculator-google-user", JSON.stringify(user));
          setGoogleUser(user);
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        shape: "rectangular",
        size: "medium",
        text: "signin_with",
        theme: "outline",
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [googleUser]);

  function savePlanSnapshot() {
    window.localStorage.setItem(
      planSnapshotStorageKey,
      JSON.stringify({
        bedtime: formatTime(best.bedtime),
        wakeTime: formatTime(best.wakeTime),
        sleepDuration: formatDuration(best.sleepMinutes),
        timeInBed: formatDuration(best.timeInBed),
        routineStart: formatTime(addMinutes(best.bedtime, -routineLength)),
        score: sleepScore.score,
        scoreLabel: sleepScore.label,
        improvements: sleepScore.improvements,
        savedAt: Date.now(),
      }),
    );
  }

  function openSevenDayPlan() {
    savePlanSnapshot();
    window.location.assign("/7-day-better-sleep-plan");
  }

  function handleGoogleSignOut() {
    window.localStorage.removeItem(googleCredentialStorageKey);
    window.localStorage.removeItem("sleep-calculator-google-user");
    window.google?.accounts.id.disableAutoSelect();
    setGoogleUser(null);
  }

  const authSlot = googleUser ? (
    <div className="flex items-center gap-2">
      {googleUser.picture ? (
        <img src={googleUser.picture} alt="" className="h-8 w-8 rounded-full border border-ink/10" />
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-mist text-sm font-bold text-ink">
          {googleUser.name.charAt(0)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{googleUser.name}</p>
        <p className="truncate text-xs text-ink/52">{googleUser.email}</p>
      </div>
      <button
        type="button"
        onClick={handleGoogleSignOut}
        className="rounded border border-ink/10 px-2 py-1 text-xs font-bold text-ink transition hover:bg-mist"
      >
        Sign out
      </button>
    </div>
  ) : googleClientId ? (
    <div ref={googleButtonRef} className="min-h-10 min-w-[180px]" aria-label="Sign in with Google" />
  ) : (
    <p className="text-xs font-semibold text-ink/62">Add Google Client ID to enable sign in</p>
  );

  return (
    <main className="min-h-screen">
      <AppNavigation activePath="/" authSlot={authSlot} />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5">
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
            <button
              type="button"
              onClick={openSevenDayPlan}
              className="mt-4 w-full rounded bg-mint px-4 py-3 font-bold text-ink transition hover:bg-mint/90"
            >
              View the 7-day plan
            </button>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-dusk">Sleep habit score</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">{sleepScore.label}</h2>
              </div>
              <div className="grid h-20 w-20 place-items-center rounded-full border-[8px] border-mint bg-mist text-2xl font-bold text-ink">
                {sleepScore.score}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/66">{sleepScore.insight}</p>
            <div className="mt-4 flex flex-col gap-2">
              {sleepScore.improvements.length ? (
                sleepScore.improvements.map((item) => (
                  <p key={item} className="rounded border border-ink/10 bg-mist px-3 py-2 text-sm text-ink/68">
                    {item}
                  </p>
                ))
              ) : (
                <p className="rounded border border-ink/10 bg-mist px-3 py-2 text-sm text-ink/68">
                  Keep your wake-up time consistent for the next 7 days.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={openSevenDayPlan}
              className="mt-4 w-full rounded border border-ink/14 px-4 py-3 font-bold text-ink transition hover:bg-mist"
            >
              Improve my score
            </button>
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

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <section id="seven-day-plan" className="mb-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
                7-day plan
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Turn tonight&apos;s result into a simple week.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/66">
                Your current result suggests getting in bed around{" "}
                <strong className="text-ink">{formatTime(best.bedtime)}</strong> and waking around{" "}
                <strong className="text-ink">{formatTime(best.wakeTime)}</strong>. The 7-day plan turns
                that timing into daily actions for consistency, screen timing, caffeine, naps, and morning reset.
              </p>
            </div>
            <div className="lg:w-[240px]">
              <button
                type="button"
                onClick={openSevenDayPlan}
                className="rounded bg-ink px-4 py-3 text-center font-bold text-white transition hover:bg-ink/90"
              >
                Preview the 7-day plan
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
                Recommended sleep setup
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Make the bedtime easier to follow</h2>
              <p className="mt-3 text-sm leading-7 text-ink/66">
                The calculator gives the time. Your room and evening cues make the plan easier to
                keep. Use this area later for clearly labeled affiliate recommendations.
              </p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
              {[
                ["Light", "Dim lights 60 minutes before bed"],
                ["Sound", "Reduce noise or use steady background audio"],
                ["Temperature", "Keep the room comfortably cool"],
              ].map(([title, detail]) => (
                <div key={title} className="rounded border border-ink/10 bg-mist p-4">
                  <p className="font-bold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/62">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
