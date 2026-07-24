const sourceLinks = [
  {
    href: "https://www.cdc.gov/sleep/about/index.html",
    label: "CDC sleep guidance",
  },
  {
    href: "https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep",
    label: "NHLBI sleep stages",
  },
  {
    href: "https://www.nhlbi.nih.gov/health/heart-healthy-living/sleep",
    label: "NHLBI healthy sleep habits",
  },
];

export function SiteFooter() {
  return (
    <footer className="healing-card-soft mt-6 p-5 text-sm leading-6 text-ink/[0.66]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-bold text-ink">Sleep Calculator</p>
          <p className="mt-2">
            An educational planning tool for bedtime, wake-up time, sleep habits, and evening
            routines. It does not diagnose or treat insomnia, sleep apnea, or any medical condition.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-semibold" aria-label="Site information">
          <a href="/about" className="hover:text-ink">
            About
          </a>
          <a href="/privacy" className="hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="hover:text-ink">
            Terms
          </a>
        </nav>
      </div>

      <div className="mt-5 border-t border-ink/10 pt-4">
        <p className="font-semibold text-ink">Evidence and further reading</p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {sourceLinks.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
            >
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
