"use client";

import type { ReactNode } from "react";

const menuGroups = [
  {
    label: "Sleep Tools",
    items: [
      {
        href: "/",
        title: "Sleep Calculator",
        description: "Find bedtime, wake-up time, and cycle-based options.",
      },
      {
        href: "/sleep-debt-calculator",
        title: "Sleep Debt Calculator",
        description: "Estimate missed sleep and plan a gentle recovery.",
      },
    ],
  },
  {
    label: "Planners",
    items: [
      {
        href: "/sleep-routine-planner",
        title: "Sleep Routine Planner",
        description: "Build a practical wind-down schedule for tonight.",
      },
      {
        href: "/#seven-day-plan",
        title: "7-Day Sleep Plan",
        description: "Follow a simple one-week reset plan.",
      },
    ],
  },
  {
    label: "Templates",
    items: [
      {
        href: "/notion-sleep-tracker",
        title: "Notion Sleep Tracker",
        description: "Track sleep quality, habits, caffeine, and trends.",
      },
      {
        href: "/checkout",
        title: "Paid Sleep Planner",
        description: "Upgrade from the calculator into a paid plan.",
      },
    ],
  },
  {
    label: "Learn",
    items: [
      {
        href: "/#faq",
        title: "Sleep FAQ",
        description: "Quick answers for common sleep timing questions.",
      },
      {
        href: "/#free-tools",
        title: "More Free Tools",
        description: "Explore focused pages around sleep routines and tracking.",
      },
    ],
  },
];

type AppNavigationProps = {
  activePath?: string;
  authSlot?: ReactNode;
};

export function AppNavigation({ activePath = "/", authSlot }: AppNavigationProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3" aria-label="Sleep Calculator home">
          <span className="grid h-9 w-9 place-items-center rounded bg-ink text-sm font-bold text-white">
            SC
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-mint">
              Better Sleep Tools
            </span>
            <span className="block text-base font-bold text-ink">Sleep Calculator</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {menuGroups.map((group) => (
            <div key={group.label} className="group relative">
              <button
                type="button"
                className="rounded px-3 py-2 text-sm font-bold text-ink/70 transition hover:bg-mist hover:text-ink"
              >
                {group.label}
              </button>
              <div className="invisible absolute left-0 top-full w-[360px] translate-y-2 rounded-lg border border-ink/10 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {group.items.map((item) => {
                  const isActive = item.href === activePath;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded p-3 transition ${
                        isActive ? "bg-ink text-white" : "hover:bg-mist"
                      }`}
                    >
                      <span className="block text-sm font-bold">{item.title}</span>
                      <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-white/72" : "text-ink/56"}`}>
                        {item.description}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
          <a
            href="/checkout"
            className="rounded px-3 py-2 text-sm font-bold text-ink/70 transition hover:bg-mist hover:text-ink"
          >
            Pricing
          </a>
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2">
          <a
            href="/checkout"
            className="hidden rounded bg-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-coral/90 sm:inline-flex"
          >
            Upgrade
          </a>
          {authSlot ? <div className="min-w-[180px] max-w-[280px] overflow-hidden">{authSlot}</div> : null}

          <details className="group relative lg:hidden">
            <summary className="list-none rounded border border-ink/10 px-3 py-2 text-sm font-bold text-ink">
              Menu
            </summary>
            <div className="absolute right-0 top-full mt-2 w-[min(88vw,360px)] rounded-lg border border-ink/10 bg-white p-3 shadow-soft">
              <div className="grid gap-2">
                {menuGroups.flatMap((group) =>
                  group.items.map((item) => (
                    <a key={`${group.label}-${item.href}`} href={item.href} className="rounded bg-mist p-3">
                      <span className="block text-sm font-bold text-ink">{item.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink/56">{item.description}</span>
                    </a>
                  )),
                )}
                <a href="/checkout" className="rounded bg-ink px-4 py-3 text-center text-sm font-bold text-white">
                  Pricing and Upgrade
                </a>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
