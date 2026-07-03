import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-cookie";
import { signAuthSession } from "@/lib/auth-token";
import { hasGoogleOAuthConfig } from "@/lib/env";
import { getGoogleOAuthClient } from "@/lib/google-oauth";
import { findUserByEmail } from "@/infrastructure/sheets/store";

export const runtime = "nodejs";

const STATE_COOKIE = "gym_google_oauth_state";

function loginRedirect(request: Request, reason: string) {
  return NextResponse.redirect(new URL(`/login?google=${reason}`, request.url));
}

export async function GET(request: Request) {
  if (!hasGoogleOAuthConfig()) return loginRedirect(request, "not_configured");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return loginRedirect(request, "invalid_state");
  }

  try {
    const { client, clientId } = getGoogleOAuthClient();
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) return loginRedirect(request, "missing_identity");

    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const profile = ticket.getPayload();
    const email = profile?.email?.trim().toLowerCase();

    if (!email || profile?.email_verified === false) {
      return loginRedirect(request, "unverified_email");
    }

    const user = await findUserByEmail(email);
    if (!user || user.status !== "active") {
      return loginRedirect(request, "not_registered");
    }

    const token = await signAuthSession({
      userId: user.id,
      gymId: user.gymId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    setAuthCookie(response, token);
    response.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    return loginRedirect(request, "failed");
  }
}
