import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Payment Successful: Sleep Calculator",
  description: "Your PayPal sandbox payment was completed successfully.",
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-mint/25 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Payment successful</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">Your monthly access is active.</h1>
          <p className="mt-4 text-sm leading-7 text-ink/66">
            Your PayPal sandbox payment has been captured. The access marker is saved to your
            Google account for 30 days, with a local browser cache for a smoother return visit.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/#seven-day-plan"
              className="rounded bg-ink px-4 py-3 text-center font-bold text-white transition hover:bg-ink/90"
            >
              Open the 7-day plan
            </a>
            <a
              href="/#sleep-products"
              className="rounded border border-ink/14 px-4 py-3 text-center font-bold text-ink transition hover:bg-mist"
            >
              Back to products
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
