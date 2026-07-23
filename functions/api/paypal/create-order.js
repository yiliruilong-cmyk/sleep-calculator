const products = {
  "7-day-plan": {
    title: "7-Day Better Sleep Plan - One-Time Digital Access",
    value: "7.00",
  },
};

function getPayPalBaseUrl(env) {
  return env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken(env) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are not configured.");
  }

  const credentials = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
  const response = await fetch(`${getPayPalBaseUrl(env)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Could not authenticate with PayPal.");
  }

  const data = await response.json();
  return data.access_token;
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const product = products[body.offerId];

    if (!product) {
      return Response.json({ error: "Unknown product." }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken(env);
    const response = await fetch(`${getPayPalBaseUrl(env)}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: body.offerId,
            custom_id: body.offerId,
            description: product.title,
            amount: {
              currency_code: "USD",
              value: product.value,
            },
          },
        ],
        application_context: {
          brand_name: "Sleep Calculator",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: "https://sleepcalculator.life/payment-success",
          cancel_url: "https://sleepcalculator.life/payment-cancelled",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: "Could not create PayPal order.", details: data }, { status: 502 });
    }

    return Response.json({ id: data.id });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Could not create PayPal order.",
      },
      { status: 500 },
    );
  }
}
