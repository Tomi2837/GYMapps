import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { hasGoogleOAuthConfig } from "@/lib/env";
import { getGoogleOAuthClient } from "@/lib/google-oauth";

export const runtime = "nodejs";

const STATE_COOKIE = "gym_google_oauth_state";
const MODE_COOKIE = "gym_google_oauth_mode";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const mode = requestUrl.searchParams.get("mode") === "setup" ? "setup" : "login";

  if (!hasGoogleOAuthConfig()) {
    const target = mode === "setup" ? "/onboarding?google=not_configured" : "/login?google=not_configured";
    return NextResponse.redirect(new URL(target, request.url));
  }

  const state = randomBytes(24).toString("hex");
  const { client } = getGoogleOAuthClient();
  const authorizationUrl = client.generateAuthUrl({
    access_type: "online",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };

  response.cookies.set(STATE_COOKIE, state, cookieOptions);
  response.cookies.set(MODE_COOKIE, mode, cookieOptions);
  return response;
}
