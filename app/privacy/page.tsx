import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy: Sleep Calculator",
  description:
    "Read how Sleep Calculator handles Google sign-in, payment access, browser storage, and sleep-planning inputs.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information you choose to provide",
    body:
      "Calculator inputs such as bedtime, wake-up time, sleep duration, and habit answers are used to produce results. The free calculator works without an account. Some preferences and saved results may remain in your browser storage.",
  },
  {
    title: "Google sign-in",
    body:
      "When you sign in, the site receives the Google account identifier and basic profile information needed to identify your account. The sign-in credential is used to verify access to purchased content.",
  },
  {
    title: "Payments and access",
    body:
      "Payments are processed by PayPal. Payment card or bank details are entered with PayPal, not on Sleep Calculator. We retain order and access details needed to provide the purchased digital product for its stated access period.",
  },
  {
    title: "Service operation",
    body:
      "Our hosting and infrastructure providers may process standard technical information such as request time, browser type, IP address, and error logs to deliver and protect the service.",
  },
  {
    title: "Your choices",
    body:
      "You can use the free calculator without signing in, clear saved browser data through your browser settings, and request help with account access through support@sleepcalculator.life.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="night-shell">
      <SiteHeader />
      <section className="night-content mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="healing-card p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Privacy policy</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-5xl">
            How your information is handled
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/[0.62]">Last updated: July 24, 2026</p>

          <div className="mt-8 divide-y divide-ink/10">
            {sections.map((section) => (
              <section key={section.title} className="py-5 first:pt-0">
                <h2 className="text-xl font-bold text-ink">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-ink/[0.68]">{section.body}</p>
              </section>
            ))}
          </div>
        </section>

        <SiteFooter />
      </section>
    </main>
  );
}
