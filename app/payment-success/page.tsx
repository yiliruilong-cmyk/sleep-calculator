import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { PaymentSuccessContent } from "./PaymentSuccessContent";

export const metadata: Metadata = {
  title: "Payment Successful: Sleep Calculator",
  description: "Your sleep planning access is active with a 7-day plan, PDF routine, habit score, and tracker template.",
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PaymentSuccessContent />
    </main>
  );
}
