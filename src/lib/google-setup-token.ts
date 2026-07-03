import { SignJWT, jwtVerify } from "jose";
import { getSessionEnv } from "@/lib/env";

export const GOOGLE_SETUP_COOKIE = "gym_google_setup";

export type GoogleSetupProfile = {
  email: string;
  name: string;
  googleSub: string;
};

function getSigningKey() {
  return new TextEncoder().encode(getSessionEnv().JWT_SECRET);
}

export async function signGoogleSetupProfile(profile: GoogleSetupProfile) {
  return new SignJWT(profile)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("20m")
    .sign(getSigningKey());
}

export async function readGoogleSetupProfile(token: string): Promise<GoogleSetupProfile | null> {
  try {
    const result = await jwtVerify(token, getSigningKey());
    return result.payload as unknown as GoogleSetupProfile;
  } catch {
    return null;
  }
}
