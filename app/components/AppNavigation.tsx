"use client";

import type { ReactNode } from "react";
import { defaultLocale, getLocaleInfo, locales, type LocaleCode } from "../lib/i18n";

const navItems = [
  { href: "/", label: "Sleep Tools" },
  { href: "/sleep-routine-planner", label: "Planner" },
  { href: "/7-day-better-sleep-plan", label: "7-Day Plan" },
  { href: "/notion-sleep-tracker", label: "Templates" },
  { href: "/checkout", label: "Pricing" },
];

type AppNavigationProps = {
  activePath?: string;
  authSlot?: ReactNode;
  locale?: LocaleCode;
};

export function AppNavigation({ activePath = "/", authSlot, locale = defaultLocale }: AppNavigationProps) {
  const activeLocale = getLocaleInfo(locale);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/[0.76] text-white backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Sleep Calculator home">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-white text-lg font-bold text-ink sm:h-10 sm:w-10 sm:text-xl">
            S
          </span>
          <span className="leading-tight">
            <span className="hidden text-sm font-bold tracking-[0.12em] text-mint sm:block">
              Better Sleep Tools
            </span>
            <span className="block whitespace-nowrap text-sm font-bold text-white sm:text-lg">Sleep Calculator</span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 md:flex xl:gap-8" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = item.href === activePath;

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap text-base font-bold transition hover:text-white ${
                  isActive ? "text-white" : "text-white/[0.66]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {authSlot ? <div className="shrink-0">{authSlot}</div> : null}

          <details className="group relative hidden sm:block">
            <summary className="list-none rounded border border-white/[0.14] bg-white/[0.08] px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.12]">
              {activeLocale.label}
            </summary>
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-white/[0.14] bg-ink/[0.94] p-2 shadow-soft backdrop-blur-xl">
              {locales.map((item) => (
                <a
                  key={item.code}
                  href={item.path}
                  hrefLang={item.htmlLang}
                  className={`block rounded px-3 py-2 text-sm font-bold transition hover:bg-white/10 ${
                    item.code === activeLocale.code ? "text-pollen" : "text-white/70"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>

          <details className="group relative md:hidden">
            <summary className="list-none rounded border border-white/[0.14] bg-white/[0.08] px-3 py-2 text-sm font-bold text-white">
              Menu
            </summary>
            <div className="absolute right-0 top-full mt-2 w-[min(88vw,360px)] rounded-lg border border-white/[0.14] bg-ink/[0.94] p-3 shadow-soft backdrop-blur-xl">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} className="rounded bg-white/[0.08] p-3 text-sm font-bold text-white">
                    {item.label}
                  </a>
                ))}
                <div className="grid gap-2 border-t border-white/10 pt-2">
                  {locales.map((item) => (
                    <a
                      key={item.code}
                      href={item.path}
                      hrefLang={item.htmlLang}
                      className="rounded bg-white/[0.08] px-3 py-2 text-sm font-bold text-white/70"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
