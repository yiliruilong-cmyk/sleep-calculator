import { AppNavigation } from "./AppNavigation";
import { defaultLocale, type LocaleCode } from "../lib/i18n";

type SiteHeaderProps = {
  activePath?: string;
  locale?: LocaleCode;
};

export function SiteHeader({ activePath = "/", locale = defaultLocale }: SiteHeaderProps) {
  const authSlot = (
    <a
      href="/login"
      className="inline-flex min-h-10 items-center justify-center rounded border border-white/[0.18] bg-white/[0.08] px-4 text-sm font-bold text-white transition hover:bg-white/[0.14]"
    >
      Sign in
    </a>
  );

  return <AppNavigation activePath={activePath} authSlot={authSlot} locale={locale} />;
}
