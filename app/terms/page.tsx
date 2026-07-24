import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Use: Sleep Calculator",
  description:
    "Review the terms for using Sleep Calculator's free planning tools and one-time digital purchases.",
  path: "/terms",
});

const sections = [
  {
    title: "Educational use",
    body:
      "Sleep Calculator provides general sleep-planning estimates and educational materials. It is not medical advice and must not be used to diagnose or treat a health condition.",
  },
  {
    title: "Accounts",
    body:
      "An account is not required for the free calculator. Google sign-in is required to associate a paid purchase with the correct user and restore access during the stated access period.",
  },
  {
    title: "Digital purchases",
    body:
      "Paid products are one-time purchases, not subscriptions, and do not renew automatically. Unless a different period is shown at checkout, access is provided for 30 days after a completed payment.",
  },
  {
    title: "Refunds and delivery issues",
    body:
      "Digital materials are delivered immediately after payment and are generally not refundable after access, except where required by law. For duplicate charges or technical delivery failures, contact support@sleepcalculator.life within 7 days for review.",
  },
  {
    title: "Acceptable use",
    body:
      "Do not misuse the site, interfere with its operation, attempt unauthorized access, or redistribute paid materials without permission.",
  },
];

export default function TermsPage() {
  return (
    <main className="night-shell">
      <SiteHeader />
      <section className="night-content mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="healing-card p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Terms of use</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-5xl">
            Clear terms for free tools and digital products
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
