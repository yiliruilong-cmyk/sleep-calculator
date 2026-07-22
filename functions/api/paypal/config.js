export function onRequestGet({ env }) {
  if (!env.PAYPAL_CLIENT_ID) {
    return Response.json({ error: "PayPal client ID is not configured." }, { status: 500 });
  }

  return Response.json(
    {
      clientId: env.PAYPAL_CLIENT_ID,
      currency: "USD",
      environment: env.PAYPAL_ENVIRONMENT || "sandbox",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
