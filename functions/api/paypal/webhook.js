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

async function verifyPayPalWebhook(request, env, event) {
  if (!env.PAYPAL_WEBHOOK_ID) {
    return { ok: false, reason: "PayPal webhook ID is not configured." };
  }

  const accessToken = await getPayPalAccessToken(env);
  const response = await fetch(`${getPayPalBaseUrl(env)}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: request.headers.get("paypal-auth-algo"),
      cert_url: request.headers.get("paypal-cert-url"),
      transmission_id: request.headers.get("paypal-transmission-id"),
      transmission_sig: request.headers.get("paypal-transmission-sig"),
      transmission_time: request.headers.get("paypal-transmission-time"),
      webhook_id: env.PAYPAL_WEBHOOK_ID,
      webhook_event: event,
    }),
  });

  if (!response.ok) {
    return { ok: false, reason: "PayPal signature verification request failed." };
  }

  const data = await response.json();
  return {
    ok: data.verification_status === "SUCCESS",
    reason: data.verification_status || "UNKNOWN",
  };
}

function getRelatedOrderId(event) {
  return (
    event.resource?.supplementary_data?.related_ids?.order_id ||
    event.resource?.custom_id ||
    event.resource?.invoice_id ||
    ""
  );
}

export async function onRequestPost({ request, env }) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);
    const verification = await verifyPayPalWebhook(request, env, event);

    if (!verification.ok) {
      return Response.json({ error: "Invalid PayPal webhook signature.", reason: verification.reason }, { status: 400 });
    }

    if (env.SLEEP_ACCESS_KV) {
      const receivedAt = Date.now();
      const eventId = event.id || crypto.randomUUID();
      const orderId = getRelatedOrderId(event);
      const record = {
        event,
        eventType: event.event_type || "",
        orderId,
        receivedAt,
      };

      await env.SLEEP_ACCESS_KV.put(`paypal-webhook:${eventId}`, JSON.stringify(record), {
        expirationTtl: 90 * 24 * 60 * 60,
      });

      if (orderId) {
        await env.SLEEP_ACCESS_KV.put(`paypal-webhook-order:${orderId}`, JSON.stringify(record), {
          expirationTtl: 90 * 24 * 60 * 60,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Could not process PayPal webhook.",
      },
      { status: 500 },
    );
  }
}
