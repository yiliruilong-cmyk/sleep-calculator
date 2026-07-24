"use client";

import { useMemo, useState } from "react";

function formatHours(value: number) {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  if (!minutes) return `${hours} hours`;
  return `${hours} hours ${minutes} minutes`;
}

export function SleepDebtCalculator() {
  const [targetHours, setTargetHours] = useState(8);
  const [actualHours, setActualHours] = useState(6.5);
  const [days, setDays] = useState(7);

  const result = useMemo(() => {
    const dailyGap = Math.max(0, targetHours - actualHours);
    const sleepDebt = dailyGap * days;
    const recoveryNights = sleepDebt === 0 ? 0 : Math.ceil(sleepDebt / 0.5);
    const label = sleepDebt >= 10 ? "High" : sleepDebt >= 4 ? "Moderate" : sleepDebt > 0 ? "Light" : "Clear";
    const note =
      sleepDebt === 0
        ? "Your current sleep time meets your target for this window."
        : "Use this as a planning estimate. Avoid trying to repay sleep debt in one long night.";

    return { dailyGap, label, note, recoveryNights, sleepDebt };
  }, [actualHours, days, targetHours]);

  return (
    <section className="healing-card p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Target sleep per night</span>
          <select
            value={targetHours}
            onChange={(event) => setTargetHours(Number(event.target.value))}
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
          <span className="text-sm font-semibold text-ink">Average actual sleep</span>
          <select
            value={actualHours}
            onChange={(event) => setActualHours(Number(event.target.value))}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          >
            {[4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8].map((hour) => (
              <option key={hour} value={hour}>
                {hour} hours
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Days to review</span>
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="mt-2 w-full rounded border border-ink/[0.12] bg-white px-3 py-3 text-ink outline-none focus:border-dusk"
          >
            {[3, 5, 7, 14, 30].map((day) => (
              <option key={day} value={day}>
                {day} days
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="healing-card-dark p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Estimated sleep debt</p>
          <p className="mt-3 text-5xl font-bold">{formatHours(result.sleepDebt)}</p>
          <p className="mt-3 text-sm leading-6 text-white/70">{result.note}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-white/[0.36] bg-white/[0.54] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Daily gap</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatHours(result.dailyGap)}</p>
          </div>
          <div className="rounded border border-white/[0.36] bg-white/[0.54] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Level</p>
            <p className="mt-2 text-2xl font-bold text-ink">{result.label}</p>
          </div>
          <div className="rounded border border-white/[0.36] bg-white/[0.54] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Gentle repayment</p>
            <p className="mt-2 text-2xl font-bold text-ink">{result.recoveryNights} nights</p>
          </div>
        </div>
      </div>
    </section>
  );
}
