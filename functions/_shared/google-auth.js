export async function verifyGoogleCredential(credential, env) {
  if (!credential || typeof credential !== "string") {
    throw new Error("Missing Google credential.");
  }

  const clientId = env.GOOGLE_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Google client ID is not configured.");
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );

  if (!response.ok) {
    throw new Error("Google sign-in could not be verified.");
  }

  const profile = await response.json();
  if (profile.aud !== clientId) {
    throw new Error("Google sign-in audience does not match this site.");
  }

  if (!profile.sub || !profile.email) {
    throw new Error("Google sign-in profile is incomplete.");
  }

  return {
    sub: profile.sub,
    email: profile.email,
    name: profile.name || "",
    picture: profile.picture || "",
  };
}

export function getAccessKey(profile) {
  return `access:${profile.sub}`;
}

export function isActiveAccess(access) {
  return Boolean(access?.expiresAt && Number(access.expiresAt) > Date.now());
}
