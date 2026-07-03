import { SignJWT, jwtVerify } from "jose";
import { getSessionEnv } from "@/lib/env";

export type AuthSession = {
  userId: string;
  gymId: string;
  email: string;
  name: string;
  role: string;
};

function getSigningKey() {
  return new TextEncoder().encode(getSessionEnv().JWT_SECRET);
}

export async function signAuthSession(session: AuthSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSigningKey());
}

export async function readAuthSession(token: string): Promise<AuthSession | null> {
  try {
    const result = await jwtVerify(token, getSigningKey());
    return result.payload as unknown as AuthSession;
  } catch {
    return null;
  }
}
