import { getAccessKey, isActiveAccess, verifyGoogleCredential } from "../../_shared/google-auth.js";

export async function onRequestPost({ request, env }) {
  try {
    if (!env.SLEEP_ACCESS_KV) {
      return Response.json({ error: "Access store is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const profile = await verifyGoogleCredential(body.googleCredential, env);
    const access = await env.SLEEP_ACCESS_KV.get(getAccessKey(profile), "json");

    if (!isActiveAccess(access)) {
      return Response.json({
        active: false,
        email: profile.email,
      });
    }

    return Response.json({
      active: true,
      access,
      email: profile.email,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Could not check access.",
      },
      { status: 401 },
    );
  }
}
