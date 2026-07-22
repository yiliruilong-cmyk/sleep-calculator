import { getAccessKey, verifyGoogleCredential } from "../../_shared/google-auth.js";

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
    if (!env.SLEEP_ACCESS_KV) {
      return Response.json({ error: "Access store is not configured." }, { status: 500 });
    }

    const body = await request.json();

    if (!body.orderId) {
      return Response.json({ error: "Missing PayPal order ID." }, { status: 400 });
    }

    const profile = await verifyGoogleCredential(body.googleCredential, env);
    const accessToken = await getPayPalAccessToken(env);
    const response = await fetch(`${getPayPalBaseUrl(env)}/v2/checkout/orders/${body.orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: "Could not capture PayPal order.", details: data }, { status: 502 });
    }

    const offerId =
      data.purchase_units?.[0]?.reference_id || data.purchase_units?.[0]?.custom_id || body.offerId || "7-day-plan";
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const access = {
      email: profile.email,
      expiresAt,
      offerId,
      orderId: data.id || body.orderId,
      paypalStatus: data.status,
      purchasedAt: Date.now(),
    };

    if (data.status === "COMPLETED") {
      await env.SLEEP_ACCESS_KV.put(getAccessKey(profile), JSON.stringify(access), {
        expirationTtl: 31 * 24 * 60 * 60,
      });
      await env.SLEEP_ACCESS_KV.put(`order:${data.id || body.orderId}`, JSON.stringify(access), {
        expirationTtl: 31 * 24 * 60 * 60,
      });
    }

    return Response.json({
      access: data.status === "COMPLETED" ? access : null,
      id: data.id,
      status: data.status,
      purchaseUnits: data.purchase_units,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Could not capture PayPal order.",
      },
      { status: 500 },
    );
  }
}
