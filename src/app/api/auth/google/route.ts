import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { hasGoogleOAuthConfig } from "@/lib/env";
import { getGoogleOAuthClient } from "@/lib/google-oauth";

export const runtime = "nodejs";

const STATE_COOKIE = "gym_google_oauth_state";

export async function GET(request: Request) {
  if (!hasGoogleOAuthConfig()) {
    return NextResponse.redirect(new URL("/login?google=not_configured", request.url));
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
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
