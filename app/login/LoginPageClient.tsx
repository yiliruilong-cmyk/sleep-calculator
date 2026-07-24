"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
              locale?: string;
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

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const googleCredentialStorageKey = "sleep-calculator-google-credential";

const fireflies = [
  ["12%", "18%", "8s", "0s"],
  ["24%", "72%", "11s", "1.2s"],
  ["36%", "38%", "9s", "2.1s"],
  ["50%", "58%", "12s", "0.5s"],
  ["64%", "26%", "10s", "1.7s"],
  ["78%", "68%", "13s", "2.8s"],
  ["88%", "20%", "9.5s", "1.1s"],
  ["18%", "48%", "14s", "3.2s"],
  ["70%", "46%", "8.5s", "0.9s"],
  ["92%", "78%", "12.5s", "2.4s"],
] as const;

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

export function LoginPageClient() {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/") ? next : "/";
  }, []);

  const signInHref = useMemo(() => {
    const params = new URLSearchParams({ signin: "1" });
    if (nextPath !== "/") params.set("next", nextPath);
    return `/login?${params.toString()}`;
  }, [nextPath]);

  useEffect(() => {
    const savedCredential = window.localStorage.getItem(googleCredentialStorageKey);
    const params = new URLSearchParams(window.location.search);
    if (params.get("signin") === "1") setIsSignInOpen(true);

    if (!savedCredential) {
      window.localStorage.removeItem("sleep-calculator-google-user");
      return;
    }

    const user = parseGoogleCredential(savedCredential);
    if (user) {
      setGoogleUser(user);
      window.localStorage.setItem("sleep-calculator-google-user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem(googleCredentialStorageKey);
      window.localStorage.removeItem("sleep-calculator-google-user");
    }
  }, []);

  useEffect(() => {
    if (!googleClientId || googleUser || !isSignInOpen) return;

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
          window.location.assign(nextPath);
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        locale: "en",
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
  }, [googleUser, isSignInOpen, nextPath]);

  function signOut() {
    window.localStorage.removeItem(googleCredentialStorageKey);
    window.localStorage.removeItem("sleep-calculator-google-user");
    window.google?.accounts.id.disableAutoSelect();
    setGoogleUser(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-white">
      <div className="login-scene" aria-hidden="true" />
      <div className="login-waterlight" aria-hidden="true" />
      <div className="login-vignette" aria-hidden="true" />
      {fireflies.map(([left, top, duration, delay], index) => (
        <span
          key={`${left}-${top}`}
          className="login-firefly"
          style={{
            left,
            top,
            animationDuration: duration,
            animationDelay: delay,
            width: index % 3 === 0 ? "9px" : "6px",
            height: index % 3 === 0 ? "9px" : "6px",
          }}
          aria-hidden="true"
        />
      ))}

      <section className="relative z-10 grid min-h-screen place-items-center px-5 pb-28 pt-12 md:pb-36 md:pt-8">
        <div className="w-full max-w-[540px] text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pollen/76">Member login</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white/88 md:text-4xl">
            Continue your sleep plan
          </h1>
          <p className="mx-auto mt-3 max-w-[440px] text-sm leading-6 text-white/54">
            Sign in with Google to access your purchased plans, PDFs, and templates.
          </p>

          <div className="mx-auto mt-6 max-w-[300px]">
            {googleUser ? (
              <div className="rounded-tool border border-white/18 bg-ink/58 p-4 text-left text-white shadow-lift backdrop-blur-md">
                <div className="flex items-center gap-3">
                  {googleUser.picture ? (
                    <img src={googleUser.picture} alt="" className="h-10 w-10 rounded-full" />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/12 font-bold">
                      {googleUser.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-bold">{googleUser.name}</p>
                    <p className="truncate text-sm text-white/58">{googleUser.email}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <a href={nextPath} className="btn-primary">
                    Continue
                  </a>
                  <button type="button" onClick={signOut} className="btn-secondary">
                    Switch account
                  </button>
                </div>
              </div>
            ) : (
              <a
                href={signInHref}
                onClick={(event) => {
                  event.preventDefault();
                  window.history.replaceState(null, "", signInHref);
                  setIsSignInOpen(true);
                }}
                className="inline-flex w-full items-center justify-center rounded-full border border-pollen/38 bg-ink/36 px-10 py-4 text-lg font-bold text-white/92 shadow-[0_0_26px_rgba(255,210,91,0.14)] backdrop-blur-md transition hover:border-pollen/70 hover:bg-ink/54 focus:outline-none focus:ring-2 focus:ring-pollen/60"
              >
                Sign in
              </a>
            )}
          </div>

          {!googleUser && isSignInOpen ? (
            <div
              className="fixed inset-0 z-30 grid place-items-center bg-ink/72 px-5 backdrop-blur-md"
              role="dialog"
              aria-modal="true"
              aria-label="Google sign in"
            >
              <div className="relative w-full max-w-[380px] rounded-tool border border-white/18 bg-ink/92 p-5 text-center text-white shadow-lift">
                <button
                  type="button"
                  onClick={() => {
                    window.history.replaceState(null, "", "/login");
                    setIsSignInOpen(false);
                  }}
                  className="absolute right-4 top-3 text-sm font-bold text-white/58 transition hover:text-white"
                >
                  Close
                </button>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-pollen">Google sign in</p>
                <h2 className="mt-2 text-2xl font-bold">Choose your account</h2>
                <div className="mt-5 rounded-tool border border-white/14 bg-white/92 p-4 text-ink">
                  {googleClientId ? (
                    <div ref={googleButtonRef} className="min-h-11" aria-label="Sign in with Google" />
                  ) : (
                    <p className="rounded border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-slate">
                      Google sign-in is unavailable in this local preview.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
