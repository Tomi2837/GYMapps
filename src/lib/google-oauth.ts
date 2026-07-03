import { google } from "googleapis";
import { getGoogleOAuthEnv } from "@/lib/env";

export function getGoogleOAuthClient() {
  const env = getGoogleOAuthEnv();
  const redirectUri = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/auth/google/callback`;

  return {
    clientId: env.GOOGLE_OAUTH_CLIENT_ID,
    client: new google.auth.OAuth2(
      env.GOOGLE_OAUTH_CLIENT_ID,
      env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri,
    ),
  };
}
