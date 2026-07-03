import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-cookie";
import { signAuthSession } from "@/lib/auth-token";
import { hasGoogleOAuthConfig } from "@/lib/env";
import { getGoogleOAuthClient } from "@/lib/google-oauth";
import { GOOGLE_SETUP_COOKIE, signGoogleSetupProfile } from "@/lib/google-setup-token";
import { findUserByEmail, isInitialSetupComplete } from "@/infrastructure/sheets/store";

export const runtime = "nodejs";

const STATE_COOKIE = "gym_google_oauth_state";
const MODE_COOKIE = "gym_google_oauth_mode";

function authRedirect(request: Request, mode: string, reason: string) {
  const target = mode === "setup" ? `/onboarding?google=${reason}` : `/login?google=${reason}`;
  return NextResponse.redirect(new URL(target, request.url));
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(MODE_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const mode = cookieStore.get(MODE_COOKIE)?.value === "setup" ? "setup" : "login";

  if (!hasGoogleOAuthConfig()) return authRedirect(request, mode, "not_configured");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return authRedirect(request, mode, "invalid_state");
  }

  try {
    const { client, clientId } = getGoogleOAuthClient();
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) return authRedirect(request, mode, "missing_identity");

    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const profile = ticket.getPayload();
    const email = profile?.email?.trim().toLowerCase();
    const googleSub = profile?.sub;
    const name = profile?.name?.trim() || email?.split("@")[0] || "Administrador";

    if (!email || !googleSub || profile?.email_verified === false) {
      return authRedirect(request, mode, "unverified_email");
    }

    if (mode === "setup") {
      if (await isInitialSetupComplete()) {
        return authRedirect(request, mode, "setup_closed");
      }

      const pendingToken = await signGoogleSetupProfile({ email, name, googleSub });
      const response = NextResponse.redirect(new URL("/onboarding?google=connected", request.url));
      response.cookies.set(GOOGLE_SETUP_COOKIE, pendingToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 20,
      });
      clearOAuthCookies(response);
      return response;
    }

    const user = await findUserByEmail(email);
    if (!user || user.status !== "active") {
      return authRedirect(request, mode, "not_registered");
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
    clearOAuthCookies(response);
    return response;
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    return authRedirect(request, mode, "failed");
  }
}
