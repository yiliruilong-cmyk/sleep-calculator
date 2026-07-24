import { createPageMetadata } from "../lib/seo";
import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata = createPageMetadata({
  title: "Checkout: Sleep Calculator",
  description: "Choose a Sleep Calculator upgrade and complete secure PayPal checkout.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
