import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNavigation } from "../components/AppNavigation";
import {
  getLanguageAlternates,
  getLocaleInfo,
  isLocaleCode,
  localizedLandingCopy,
  localeCodes,
  siteUrl,
  type LocaleCode,
} from "../lib/i18n";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localeCodes.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocaleCode(locale) || locale === "en") notFound();

  const localeInfo = getLocaleInfo(locale);
  const copy = localizedLandingCopy[locale];

  return {
    title: copy.title,
    description: copy.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: localeInfo.path,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: localeInfo.path,
      type: "website",
    },
  };
}

export default async function LocalizedLandingPage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocaleCode(locale) || locale === "en") notFound();

  const typedLocale = locale as Exclude<LocaleCode, "en">;
  const localeInfo = getLocaleInfo(typedLocale);
  const copy = localizedLandingCopy[typedLocale];

  return (
    <main className="night-shell" lang={localeInfo.htmlLang}>
      <AppNavigation activePath="/" locale={typedLocale} />

      <section className="night-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="healing-card p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">{copy.eyebrow}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-ink md:text-6xl">
                {copy.headline}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-ink/[0.68] md:text-lg">
                {copy.intro}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/#calculator"
                  className="rounded bg-ink px-5 py-3 text-center font-bold text-white transition hover:bg-ink/90"
                >
                  {copy.calculatorCta}
                </a>
                <a
                  href="/7-day-better-sleep-plan"
                  className="rounded border border-ink/[0.14] px-5 py-3 text-center font-bold text-ink transition hover:bg-mist"
                >
                  {copy.planCta}
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-mint/30 bg-white/50 p-5 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-mint">
                Sleep Calculator
              </p>
              <div className="mt-4 grid gap-3">
                {["10:30 PM", "7:00 AM", "5 cycles", "7h 30m"].map((item, index) => (
                  <div key={item} className="rounded border border-white/[0.36] bg-white/[0.62] p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">
                      {["Bedtime", "Wake-up", "Cycles", "Sleep"][index]}
                    </p>
                    <p className="mt-1 text-lg font-bold text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="healing-card p-6">
            <h2 className="text-2xl font-bold text-ink">{copy.benefitsTitle}</h2>
            <div className="mt-5 grid gap-3">
              {copy.benefits.map((benefit) => (
                <p key={benefit} className="rounded border border-white/[0.36] bg-white/[0.54] p-3 text-sm leading-6 text-ink/[0.68]">
                  {benefit}
                </p>
              ))}
            </div>
          </section>

          <section className="healing-card p-6">
            <h2 className="text-2xl font-bold text-ink">{copy.workflowTitle}</h2>
            <div className="mt-5 grid gap-3">
              {copy.workflow.map((step, index) => (
                <article key={step} className="rounded border border-white/[0.36] bg-white/[0.54] p-4">
                  <span className="grid h-8 w-8 place-items-center rounded bg-ink text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-3 text-sm leading-6 text-ink/[0.68]">{step}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="healing-card mt-6 p-6">
          <h2 className="text-2xl font-bold text-ink">{copy.faqTitle}</h2>
          <div className="mt-4 divide-y divide-ink/10">
            {copy.faqs.map(([question, answer]) => (
              <details key={question} className="group py-3">
                <summary className="cursor-pointer list-none font-bold text-ink">
                  {question}
                  <span className="float-right text-dusk group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-6 text-ink/[0.65]">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
