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

type PlanDay = {
  day: number;
  title: string;
  focus: string;
  evening: string[];
  morning: string;
};

type GoogleUser = {
  email: string;
  name: string;
  picture: string;
};

type GoogleCredentialResponse = {
  credential?: string;
};

type PayPalOrderData = {
  orderID: string;
};

type PayPalButtonsInstance = {
  render: (container: HTMLElement) => Promise<void>;
  close?: () => Promise<void>;
};

type PaidAccess = {
  offerId: string;
  orderId: string;
  expiresAt: number;
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
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: PayPalOrderData) => Promise<void>;
        onCancel: () => void;
        onError: (error: unknown) => void;
        style?: {
          color?: string;
          layout?: string;
          shape?: string;
          tagline?: boolean;
        };
      }) => PayPalButtonsInstance;
    };
  }
}

const cycleCounts = [4, 5, 6];
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const googleCredentialStorageKey = "sleep-calculator-google-credential";
const paidAccessStorageKey = "sleep-calculator-paid-access";

const offers = [
  {
    id: "7-day-plan",
    title: "7-Day Better Sleep Plan",
    price: "$7",
    description: "A simple daily reset plan built around your bedtime, wake-up time, and evening triggers.",
    bullets: ["Daily wind-down checklist", "Morning reset prompts", "Caffeine and screen timing guide"],
    cta: "Start the 7-day plan",
    badge: "Best starter",
  },
  {
    id: "routine-pdf",
    title: "Personalized Sleep Routine PDF",
    price: "$5",
    description: "Turn tonight's result into a printable routine you can keep beside your bed.",
    bullets: ["Bedtime and wake-up targets", "Step-by-step routine", "Personal notes from your inputs"],
    cta: "Save routine as PDF",
    badge: "Instant value",
  },
  {
    id: "paid-planner",
    title: "Paid Sleep Planner",
    price: "$19",
    description: "A lightweight planner for people who want to plan, track, and adjust their sleep week by week.",
    bullets: ["Weekly planning pages", "Habit score tracking", "Sleep debt review prompts"],
    cta: "Join planner waitlist",
    badge: "Premium",
  },
  {
    id: "notion-template",
    title: "Notion Sleep Tracker Template",
    price: "$9",
    description: "Track bedtime, wake-up time, sleep quality, caffeine, screens, and weekly trends in Notion.",
    bullets: ["Sleep log database", "Weekly score dashboard", "Habit experiments library"],
    cta: "Get Notion template",
    badge: "Template",
  },
];

const starterOffer = offers[0];
const upgradeOffers = offers.slice(1);

const sevenDayPlan: PlanDay[] = [
  {
    day: 1,
    title: "Set Your Anchor",
    focus: "Lock in one wake-up time and use it as the anchor for the week.",
    evening: [
      "Set tomorrow's wake-up alarm before your wind-down starts.",
      "Put your phone charger outside arm's reach.",
      "Write down one thing that could make bedtime slip later.",
    ],
    morning: "Get light within the first hour after waking, even if it is only a short walk or bright window time.",
  },
  {
    day: 2,
    title: "Build the Wind-Down Cue",
    focus: "Teach your body that the night routine has started.",
    evening: [
      "Dim lights at the start of your routine.",
      "Choose one low-effort task: shower, light stretching, or setting clothes out.",
      "Keep the final 15 minutes predictable and quiet.",
    ],
    morning: "Rate your sleep quality from 1 to 5 and note what helped you fall asleep.",
  },
  {
    day: 3,
    title: "Move Stimulation Earlier",
    focus: "Reduce the inputs that keep your brain alert late at night.",
    evening: [
      "Create a 30-minute screen cutoff before bed.",
      "Move work, email, and planning tasks out of the last hour.",
      "If you need audio, choose something familiar and calm.",
    ],
    morning: "Check whether the screen cutoff changed how quickly you felt sleepy.",
  },
  {
    day: 4,
    title: "Protect Your Sleep Window",
    focus: "Make your recommended bedtime easier to keep.",
    evening: [
      "Set a reminder 15 minutes before your routine starts.",
      "Avoid starting a new episode, task, or conversation near bedtime.",
      "Prepare water, alarm, and room temperature before getting in bed.",
    ],
    morning: "Compare your planned bedtime with your actual bedtime and write the gap in minutes.",
  },
  {
    day: 5,
    title: "Clean Up Caffeine and Naps",
    focus: "Remove common reasons your natural sleepiness arrives late.",
    evening: [
      "Use your last caffeine cutoff as an experiment, not a rule.",
      "Keep naps short and earlier in the day when possible.",
      "If you are not sleepy, stay calm and keep the room low-stimulation.",
    ],
    morning: "Note caffeine timing, nap timing, and whether your sleep felt lighter or deeper.",
  },
  {
    day: 6,
    title: "Review Your Pattern",
    focus: "Look for the one change that produced the clearest benefit.",
    evening: [
      "Pick the best habit from Days 1-5 and repeat it exactly.",
      "Remove one habit that did not help.",
      "Keep the same wake-up time tomorrow.",
    ],
    morning: "Choose your top sleep trigger: timing, screens, caffeine, naps, light, noise, or stress.",
  },
  {
    day: 7,
    title: "Make It Repeatable",
    focus: "Turn the week into a simple default routine.",
    evening: [
      "Write your default bedtime routine in three steps.",
      "Choose one backup plan for busy nights.",
      "Set your next 7-day wake-up target.",
    ],
    morning: "Keep the routine that improved your score and retest your sleep habit score next week.",
  },
];

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

async function loadPayPalSdk() {
  if (window.paypal) return;

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk="true"]');
  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Could not load PayPal SDK.")), {
        once: true,
      });
    });
    return;
  }

  const configResponse = await fetch("/api/paypal/config");
  if (!configResponse.ok) {
    throw new Error("PayPal is not configured yet.");
  }

  const config = (await configResponse.json()) as { clientId: string; currency: string };
  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
    config.clientId,
  )}&currency=${encodeURIComponent(config.currency || "USD")}&intent=capture&components=buttons`;
  script.async = true;
  script.dataset.paypalSdk = "true";

  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load PayPal SDK."));
    document.head.appendChild(script);
  });
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
  const [googleCredential, setGoogleCredential] = useState("");
  const [paidAccess, setPaidAccess] = useState<PaidAccess | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "ready" | "processing" | "error">(
    "idle",
  );
  const [paymentMessage, setPaymentMessage] = useState("");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement | null>(null);

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

  const sleepScore = useMemo(
    () => getSleepHabitScore(sleepGoal, latency, routineLength, screenUse, caffeine, nap),
    [caffeine, latency, nap, routineLength, screenUse, sleepGoal],
  );

  const [selectedOffer, setSelectedOffer] = useState("7-day-plan");
  const selectedOfferDetails = useMemo(
    () => offers.find((offer) => offer.id === selectedOffer) || starterOffer,
    [selectedOffer],
  );
  const paidAccessExpiresAt = paidAccess
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(paidAccess.expiresAt))
    : "";

  useEffect(() => {
    const savedCredential = window.localStorage.getItem(googleCredentialStorageKey);
    if (savedCredential) {
      const user = parseGoogleCredential(savedCredential);
      if (user) {
        setGoogleUser(user);
        setGoogleCredential(savedCredential);
      } else {
        window.localStorage.removeItem(googleCredentialStorageKey);
        window.localStorage.removeItem("sleep-calculator-google-user");
      }
    } else {
      window.localStorage.removeItem("sleep-calculator-google-user");
    }

    const savedAccess = window.localStorage.getItem(paidAccessStorageKey);
    if (savedAccess) {
      try {
        const access = JSON.parse(savedAccess) as PaidAccess;
        if (access.expiresAt > Date.now()) {
          setPaidAccess(access);
        } else {
          window.localStorage.removeItem(paidAccessStorageKey);
        }
      } catch {
        window.localStorage.removeItem(paidAccessStorageKey);
      }
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
          setGoogleCredential(response.credential);
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

  useEffect(() => {
    if (!googleCredential) return;

    let isCancelled = false;

    async function refreshAccess() {
      try {
        const response = await fetch("/api/access/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ googleCredential }),
        });
        const data = await response.json();

        if (isCancelled) return;

        if (!response.ok) {
          if (response.status === 401) {
            window.localStorage.removeItem(googleCredentialStorageKey);
            window.localStorage.removeItem("sleep-calculator-google-user");
            window.localStorage.removeItem(paidAccessStorageKey);
            setGoogleCredential("");
            setGoogleUser(null);
            setPaidAccess(null);
            setPaymentMessage("Please sign in with Google again before purchasing.");
          }
          return;
        }

        if (data.active && data.access) {
          window.localStorage.setItem(paidAccessStorageKey, JSON.stringify(data.access));
          setPaidAccess(data.access);
        } else {
          window.localStorage.removeItem(paidAccessStorageKey);
          setPaidAccess(null);
        }
      } catch (error) {
        console.error(error);
      }
    }

    refreshAccess();

    return () => {
      isCancelled = true;
    };
  }, [googleCredential]);

  useEffect(() => {
    let isCancelled = false;
    let buttons: PayPalButtonsInstance | null = null;

    async function renderPayPalButtons() {
      if (!paypalButtonRef.current) return;

      if (!googleCredential) {
        paypalButtonRef.current.innerHTML = "";
        setPaymentStatus("idle");
        setPaymentMessage("Sign in with Google first so your purchase can be saved to your account.");
        return;
      }

      setPaymentStatus("loading");
      setPaymentMessage("Loading secure PayPal checkout...");
      paypalButtonRef.current.innerHTML = "";

      try {
        await loadPayPalSdk();

        if (isCancelled || !paypalButtonRef.current || !window.paypal) return;

        buttons = window.paypal.Buttons({
          style: {
            color: "gold",
            layout: "vertical",
            shape: "rect",
            tagline: false,
          },
          createOrder: async () => {
            setPaymentStatus("processing");
            setPaymentMessage("Creating your PayPal order...");

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ offerId: selectedOffer }),
            });
            const data = await response.json();

            if (!response.ok || !data.id) {
              throw new Error(data.error || "Could not create PayPal order.");
            }

            return data.id;
          },
          onApprove: async (data) => {
            setPaymentStatus("processing");
            setPaymentMessage("Confirming your payment...");

            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                googleCredential,
                offerId: selectedOffer,
                orderId: data.orderID,
              }),
            });
            const capture = await response.json();

            if (!response.ok || capture.status !== "COMPLETED" || !capture.access) {
              throw new Error(capture.error || "Could not confirm PayPal payment.");
            }

            const access = capture.access as PaidAccess;
            window.localStorage.setItem(paidAccessStorageKey, JSON.stringify(access));
            setPaidAccess(access);
            window.location.assign(`/payment-success?offer=${selectedOffer}`);
          },
          onCancel: () => {
            window.location.assign(`/payment-cancelled?offer=${selectedOffer}`);
          },
          onError: (error) => {
            console.error(error);
            setPaymentStatus("error");
            setPaymentMessage("PayPal checkout is unavailable right now. Please try again.");
          },
        });

        await buttons.render(paypalButtonRef.current);

        if (!isCancelled) {
          setPaymentStatus("ready");
          setPaymentMessage("");
        }
      } catch (error) {
        console.error(error);
        if (!isCancelled) {
          setPaymentStatus("error");
          setPaymentMessage(error instanceof Error ? error.message : "Could not load PayPal checkout.");
        }
      }
    }

    renderPayPalButtons();

    return () => {
      isCancelled = true;
      buttons?.close?.();
    };
  }, [googleCredential, selectedOffer]);

  function handlePrintRoutine() {
    window.print();
  }

  function handleGoogleSignOut() {
    window.localStorage.removeItem(googleCredentialStorageKey);
    window.localStorage.removeItem("sleep-calculator-google-user");
    window.localStorage.removeItem(paidAccessStorageKey);
    window.google?.accounts.id.disableAutoSelect();
    setGoogleCredential("");
    setGoogleUser(null);
    setPaidAccess(null);
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
              onClick={() => window.location.assign("/checkout?offer=routine-pdf")}
              className="mt-4 w-full rounded bg-mint px-4 py-3 font-bold text-ink transition hover:bg-mint/90"
            >
              Save this routine as PDF
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
              onClick={() => window.location.assign("/checkout?offer=7-day-plan")}
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
          <button
            type="button"
            onClick={handlePrintRoutine}
            className="mt-4 w-full rounded bg-ink px-4 py-3 font-bold text-white transition hover:bg-ink/90"
          >
            Print or save as PDF
          </button>
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <section id="sleep-products" className="mb-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
                Sleep planning upgrades
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Start with the 7-Day Better Sleep Plan</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/66">
                Keep the free calculator open to everyone, then use the $7 plan as the first paid
                step for users who want a simple structure to follow this week.
              </p>
            </div>
            <div className="rounded border border-mint/25 bg-mint/8 px-4 py-3">
              <p className="text-sm font-bold text-ink">Selected</p>
              <p className="text-sm text-ink/62">
                {offers.find((offer) => offer.id === selectedOffer)?.title}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
            <article
              className={`flex min-h-full flex-col rounded border p-5 ${
                selectedOffer === starterOffer.id ? "border-dusk bg-dusk/6" : "border-ink/10 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded bg-ink px-2 py-1 text-xs font-bold text-white">{starterOffer.badge}</span>
                <span className="text-3xl font-bold text-ink">{starterOffer.price}</span>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink">{starterOffer.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/64">{starterOffer.description}</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-ink/68">
                {starterOffer.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => window.location.assign(`/checkout?offer=${starterOffer.id}`)}
                className="mt-auto rounded bg-ink px-4 py-3 font-bold text-white transition hover:bg-ink/90"
              >
                {starterOffer.cta}
              </button>
              <p className="mt-3 text-xs leading-5 text-ink/50">
                Early-stage validation price. Later this can become the front door to a larger bundle.
              </p>
            </article>

            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              {upgradeOffers.map((offer) => (
                <article
                  key={offer.id}
                  className={`flex min-h-full flex-col rounded border p-4 ${
                    selectedOffer === offer.id ? "border-dusk bg-dusk/6" : "border-ink/10 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded bg-ink px-2 py-1 text-xs font-bold text-white">{offer.badge}</span>
                    <span className="text-lg font-bold text-ink">{offer.price}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{offer.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/64">{offer.description}</p>
                  <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-ink/68">
                    {offer.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => window.location.assign(`/checkout?offer=${offer.id}`)}
                    className="mt-auto rounded bg-ink px-4 py-3 font-bold text-white transition hover:bg-ink/90"
                  >
                    {offer.cta}
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded border border-ink/10 bg-mist p-4">
            <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-dusk">Secure PayPal checkout</p>
                <h3 className="mt-2 text-xl font-bold text-ink">
                  Buy {selectedOfferDetails.title} for {selectedOfferDetails.price}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  This is a one-time digital purchase. Sign in first so a successful purchase can
                  unlock 30-day access on your Google account.
                </p>
                {paidAccess ? (
                  <p className="mt-3 rounded border border-mint/25 bg-mint/10 px-3 py-2 text-sm font-semibold text-ink">
                    Account access active until {paidAccessExpiresAt}.
                  </p>
                ) : null}
              </div>
              <div className="rounded border border-white bg-white p-3">
                {!googleCredential ? (
                  <div className="rounded border border-dusk/15 bg-dusk/6 p-4">
                    <p className="font-bold text-ink">Sign in to continue</p>
                    <p className="mt-2 text-sm leading-6 text-ink/62">
                      Use Google sign-in at the top of the page. The PayPal checkout button will
                      appear here after your account is ready.
                    </p>
                  </div>
                ) : null}
                <div ref={paypalButtonRef} />
                {paymentMessage ? (
                  <p
                    className={`mt-3 text-sm leading-6 ${
                      paymentStatus === "error" ? "text-coral" : "text-ink/60"
                    }`}
                  >
                    {paymentMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section id="free-tools" className="mb-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">
                More free sleep tools
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Explore focused sleep planners</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/66">
                These pages target specific sleep questions while pointing users back to the main
                calculator, 7-day plan, and paid template offers.
              </p>
            </div>
            <a
              href="/sleep-routine-planner"
              className="rounded bg-ink px-4 py-3 text-center font-bold text-white transition hover:bg-ink/90"
            >
              Start with routine planner
            </a>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/sleep-debt-calculator",
                title: "Sleep Debt Calculator",
                description:
                  "Estimate missed sleep across the week and build a realistic recovery plan.",
              },
              {
                href: "/sleep-routine-planner",
                title: "Sleep Routine Planner",
                description:
                  "Create a wind-down schedule from your wake-up time, sleep target, and evening style.",
              },
              {
                href: "/notion-sleep-tracker",
                title: "Notion Sleep Tracker",
                description:
                  "Preview a tracker template for bedtime, wake-up time, quality, caffeine, and trends.",
              },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="rounded border border-ink/10 bg-mist p-4 transition hover:border-dusk hover:bg-dusk/6"
              >
                <h3 className="text-lg font-bold text-ink">{tool.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">{tool.description}</p>
                <span className="mt-4 inline-flex text-sm font-bold text-dusk">Open tool</span>
              </a>
            ))}
          </div>
        </section>

        <section id="seven-day-plan" className="mb-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">
                Included plan
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ink">7-Day Better Sleep Plan</h2>
              <p className="mt-3 text-sm leading-7 text-ink/66">
                Use this plan with your current result: get in bed around{" "}
                <strong className="text-ink">{formatTime(best.bedtime)}</strong> and aim to wake around{" "}
                <strong className="text-ink">{formatTime(best.wakeTime)}</strong>. The plan is designed
                to improve consistency first, then reduce the habits that make bedtime slide later.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded border border-ink/10 bg-mist p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Current score</p>
                  <p className="mt-1 text-3xl font-bold text-ink">{sleepScore.score}</p>
                </div>
                <div className="rounded border border-ink/10 bg-mist p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Routine start</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{formatTime(addMinutes(best.bedtime, -routineLength))}</p>
                </div>
                <div className="rounded border border-ink/10 bg-mist p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Daily target</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{formatDuration(best.sleepMinutes)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrintRoutine}
                className="mt-4 w-full rounded bg-ink px-4 py-3 font-bold text-white transition hover:bg-ink/90"
              >
                Print the 7-day plan
              </button>
            </div>

            <div className="grid gap-3">
              {sevenDayPlan.map((day) => (
                <article key={day.day} className="rounded border border-ink/10 bg-mist p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-coral">Day {day.day}</p>
                      <h3 className="mt-1 text-xl font-bold text-ink">{day.title}</h3>
                    </div>
                    <span className="rounded bg-white px-3 py-1 text-sm font-bold text-ink/68">
                      {day.focus}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_0.78fr]">
                    <div className="rounded border border-white bg-white p-3">
                      <p className="font-bold text-ink">Tonight checklist</p>
                      <ul className="mt-2 flex flex-col gap-2 text-sm leading-6 text-ink/68">
                        {day.evening.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-white bg-white p-3">
                      <p className="font-bold text-ink">Morning note</p>
                      <p className="mt-2 text-sm leading-6 text-ink/68">{day.morning}</p>
                    </div>
                  </div>
                </article>
              ))}
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

        <section className="mt-6 rounded-lg border border-dusk/15 bg-ink p-5 text-white shadow-soft md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">
                Free lead magnet
              </p>
              <h2 className="mt-2 text-2xl font-bold">Preview the 7-day better sleep plan</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
                Capture early demand before connecting payments. Send a sample routine, then offer
                the full planner, PDF, or Notion tracker.
              </p>
            </div>
            <form className="grid gap-2 sm:grid-cols-[260px_auto]" aria-label="Sleep reset waitlist">
              <input
                type="email"
                placeholder="Email address"
                className="rounded border border-white/12 bg-white px-3 py-3 text-ink outline-none focus:border-mint"
              />
              <button
                type="button"
                className="rounded bg-mint px-4 py-3 font-bold text-ink transition hover:bg-mint/90"
              >
                Send me the preview
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-6 rounded-lg border border-ink/10 bg-white/82 p-4 text-sm leading-6 text-ink/62">
          This tool provides general sleep planning and education only. It does not diagnose or treat
          insomnia, sleep apnea, or any medical condition. Sources to review before publishing:
          CDC sleep basics, CDC adult sleep duration data, and AASM adult sleep duration guidance.
        </footer>
      </section>
    </main>
  );
}
