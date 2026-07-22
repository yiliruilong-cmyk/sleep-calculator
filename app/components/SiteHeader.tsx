const toolLinks = [
  { href: "/", label: "Calculator" },
  { href: "/sleep-debt-calculator", label: "Sleep Debt" },
  { href: "/sleep-routine-planner", label: "Routine Planner" },
  { href: "/notion-sleep-tracker", label: "Notion Tracker" },
];

type SiteHeaderProps = {
  activePath?: string;
};

export function SiteHeader({ activePath = "/" }: SiteHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <a href="/" className="flex items-center gap-3" aria-label="Sleep Calculator home">
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
      <nav className="flex flex-wrap gap-2 text-sm font-semibold text-ink/70">
        {toolLinks.map((link) => {
          const isActive = link.href === activePath;

          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded border px-3 py-2 transition ${
                isActive
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 bg-white/78 hover:bg-white hover:text-ink"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
