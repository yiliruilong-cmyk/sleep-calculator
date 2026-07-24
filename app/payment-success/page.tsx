import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata } from "../lib/seo";
import { PaymentSuccessContent } from "./PaymentSuccessContent";

export const metadata = createPageMetadata({
  title: "Payment Successful: Sleep Calculator",
  description: "Your sleep planning access is active with a 7-day plan, PDF routine, habit score, and tracker template.",
  path: "/payment-success",
  noIndex: true,
});

export default function PaymentSuccessPage() {
  return (
    <main className="night-shell">
      <SiteHeader />
      <PaymentSuccessContent />
    </main>
  );
}
