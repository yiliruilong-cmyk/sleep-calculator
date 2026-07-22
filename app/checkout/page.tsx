import type { Metadata } from "next";
import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout: Sleep Calculator",
  description: "Choose a Sleep Calculator upgrade and complete PayPal sandbox checkout.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
