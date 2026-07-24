import { createPageMetadata } from "../lib/seo";
import { LoginPageClient } from "./LoginPageClient";

export const metadata = createPageMetadata({
  title: "Login: Sleep Calculator",
  description: "Sign in to Sleep Calculator with Google and continue your sleep planning flow.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginPageClient />;
}
