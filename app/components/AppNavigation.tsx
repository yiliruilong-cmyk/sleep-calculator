"use client";

import type { ReactNode } from "react";
import { defaultLocale, getLocaleInfo, locales, type LocaleCode } from "../lib/i18n";

const navItems = [
  { href: "/", label: "睡眠工具" },
  { href: "/sleep-routine-planner", label: "规划师" },
  { href: "/7-day-better-sleep-plan", label: "7天计划" },
  { href: "/notion-sleep-tracker", label: "模板" },
  { href: "/checkout", label: "定价" },
];

type AppNavigationProps = {
  activePath?: string;
  authSlot?: ReactNode;
  locale?: LocaleCode;
};

export function AppNavigation({ activePath = "/", authSlot, locale = defaultLocale }: AppNavigationProps) {
  const activeLocale = getLocaleInfo(locale);

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3" aria-label="Sleep Calculator home">
          <span className="grid h-10 w-10 place-items-center rounded bg-ink text-xl font-bold text-white">
            睡
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-[0.12em] text-mint">
              改善睡眠工具
            </span>
            <span className="block text-lg font-bold text-ink">睡眠计算器</span>
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
                className={`whitespace-nowrap text-base font-bold transition hover:text-ink ${
                  isActive ? "text-ink" : "text-ink/68"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {authSlot ? <div className="min-w-[180px] max-w-[280px] overflow-hidden">{authSlot}</div> : null}

          <details className="group relative hidden sm:block">
            <summary className="list-none rounded border border-ink/10 px-3 py-2 text-sm font-bold text-ink transition hover:bg-mist">
              {activeLocale.nativeLabel}
            </summary>
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-ink/10 bg-white p-2 shadow-soft">
              {locales.map((item) => (
                <a
                  key={item.code}
                  href={item.path}
                  hrefLang={item.htmlLang}
                  className={`block rounded px-3 py-2 text-sm font-bold transition hover:bg-mist ${
                    item.code === activeLocale.code ? "text-dusk" : "text-ink/70"
                  }`}
                >
                  {item.nativeLabel}
                </a>
              ))}
            </div>
          </details>

          <details className="group relative md:hidden">
            <summary className="list-none rounded border border-ink/10 px-3 py-2 text-sm font-bold text-ink">
              Menu
            </summary>
            <div className="absolute right-0 top-full mt-2 w-[min(88vw,360px)] rounded-lg border border-ink/10 bg-white p-3 shadow-soft">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} className="rounded bg-mist p-3 text-sm font-bold text-ink">
                    {item.label}
                  </a>
                ))}
                <a href="/checkout" className="rounded bg-ink px-4 py-3 text-center text-sm font-bold text-white">
                  定价与升级
                </a>
                <div className="grid gap-2 border-t border-ink/10 pt-2">
                  {locales.map((item) => (
                    <a
                      key={item.code}
                      href={item.path}
                      hrefLang={item.htmlLang}
                      className="rounded bg-white px-3 py-2 text-sm font-bold text-ink/70"
                    >
                      {item.nativeLabel}
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
