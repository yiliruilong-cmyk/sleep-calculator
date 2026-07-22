"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppNavigation } from "../components/AppNavigation";

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
    badge: "Best starter",
  },
  {
    id: "routine-pdf",
    title: "Personalized Sleep Routine PDF",
    price: "$5",
    description: "Turn tonight's result into a printable routine you can keep beside your bed.",
    bullets: ["Bedtime and wake-up targets", "Step-by-step routine", "Personal notes from your inputs"],
    badge: "Instant value",
  },
  {
    id: "paid-planner",
    title: "Paid Sleep Planner",
    price: "$19",
    description: "A lightweight planner for planning, tracking, and adjusting sleep week by week.",
    bullets: ["Weekly planning pages", "Habit score tracking", "Sleep debt review prompts"],
    badge: "Premium",
  },
  {
    id: "notion-template",
    title: "Notion Sleep Tracker Template",
    price: "$9",
    description: "Track bedtime, wake-up time, sleep quality, caffeine, screens, and weekly trends in Notion.",
    bullets: ["Sleep log database", "Weekly score dashboard", "Habit experiments library"],
    badge: "Template",
  },
];

function parseGoogleCredential(credential: string): GoogleUser | null {
  try {
    const payload = credential.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = JSON.parse(window.atob(padded));

    if (!decoded.email || !decoded.name) return null;

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

export function CheckoutPageClient() {
  const [selectedOffer, setSelectedOffer] = useState("7-day-plan");
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [googleCredential, setGoogleCredential] = useState("");
  const [paidAccess, setPaidAccess] = useState<PaidAccess | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "ready" | "processing" | "error">(
    "idle",
  );
  const [paymentMessage, setPaymentMessage] = useState("");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement | null>(null);

  const selectedOfferDetails = useMemo(
    () => offers.find((offer) => offer.id === selectedOffer) || offers[0],
    [selectedOffer],
  );
  const paidAccessExpiresAt = paidAccess
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(paidAccess.expiresAt))
    : "";

  useEffect(() => {
    const initialOffer = new URLSearchParams(window.location.search).get("offer");
    if (initialOffer && offers.some((offer) => offer.id === initialOffer)) {
      setSelectedOffer(initialOffer);
    }

    const savedCredential = window.localStorage.getItem(googleCredentialStorageKey);
    if (!savedCredential) {
      window.localStorage.removeItem("sleep-calculator-google-user");
      return;
    }

    const user = parseGoogleCredential(savedCredential);
    if (!user) {
      window.localStorage.removeItem(googleCredentialStorageKey);
      window.localStorage.removeItem("sleep-calculator-google-user");
      return;
    }

    setGoogleUser(user);
    setGoogleCredential(savedCredential);

    const savedAccess = window.localStorage.getItem(paidAccessStorageKey);
    if (!savedAccess) return;

    try {
      const access = JSON.parse(savedAccess) as PaidAccess;
      if (access.expiresAt > Date.now()) setPaidAccess(access);
    } catch {
      window.localStorage.removeItem(paidAccessStorageKey);
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
        size: "large",
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
            handleGoogleSignOut();
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

            window.localStorage.setItem(paidAccessStorageKey, JSON.stringify(capture.access));
            setPaidAccess(capture.access);
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
    <div ref={googleButtonRef} aria-label="Sign in with Google" />
  ) : (
    <p className="text-xs font-semibold text-ink/62">Add Google Client ID to enable sign in</p>
  );

  return (
    <main className="min-h-screen">
      <AppNavigation activePath="/checkout" authSlot={authSlot} />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="rounded-lg border border-white/70 bg-white/86 p-5 shadow-soft md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Checkout</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-5xl">
            Choose your sleep upgrade.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/66">
            Start with the $7 plan or choose a focused planner/template. This checkout is still in
            PayPal sandbox mode while we validate the product.
          </p>

          <div className="mt-6 grid gap-3">
            {offers.map((offer) => {
              const isSelected = offer.id === selectedOffer;

              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOffer(offer.id)}
                  className={`rounded border p-4 text-left transition ${
                    isSelected ? "border-dusk bg-dusk/6" : "border-ink/10 bg-white hover:border-dusk/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded bg-ink px-2 py-1 text-xs font-bold text-white">{offer.badge}</span>
                      <h2 className="mt-3 text-xl font-bold text-ink">{offer.title}</h2>
                    </div>
                    <span className="text-2xl font-bold text-ink">{offer.price}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/62">{offer.description}</p>
                  <ul className="mt-3 grid gap-1 text-sm leading-6 text-ink/68">
                    {offer.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-dusk">Secure payment</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">
            Pay {selectedOfferDetails.price} for {selectedOfferDetails.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/64">
            Sign in with Google first. After PayPal confirms the sandbox payment, the purchase is
            saved to your Google account for 30 days.
          </p>

          {paidAccess ? (
            <p className="mt-4 rounded border border-mint/25 bg-mint/10 px-3 py-2 text-sm font-semibold text-ink">
              Account access active until {paidAccessExpiresAt}.
            </p>
          ) : null}

          <div className="mt-5 rounded border border-ink/10 bg-mist p-4">
            {!googleCredential ? (
              <div className="rounded border border-dusk/15 bg-white p-4">
                <p className="font-bold text-ink">Sign in to unlock checkout</p>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  Use the Google sign-in button in the top navigation. PayPal will appear here after
                  your account is ready.
                </p>
              </div>
            ) : null}
            <div ref={paypalButtonRef} />
            {paymentMessage ? (
              <p className={`mt-3 text-sm leading-6 ${paymentStatus === "error" ? "text-coral" : "text-ink/60"}`}>
                {paymentMessage}
              </p>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
