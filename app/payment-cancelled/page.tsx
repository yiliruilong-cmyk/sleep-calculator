import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Payment Cancelled: Sleep Calculator",
  description: "Your PayPal sandbox payment was cancelled.",
};

export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-coral/20 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Payment cancelled</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">No payment was completed.</h1>
          <p className="mt-4 text-sm leading-7 text-ink/66">
            You can return to the calculator and continue using the free tools, or choose a plan
            again when you are ready.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/#sleep-products"
              className="rounded bg-ink px-4 py-3 text-center font-bold text-white transition hover:bg-ink/90"
            >
              Choose a plan
            </a>
            <a
              href="/"
              className="rounded border border-ink/14 px-4 py-3 text-center font-bold text-ink transition hover:bg-mist"
            >
              Open free calculator
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
