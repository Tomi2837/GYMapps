import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GOOGLE_SETUP_COOKIE, readGoogleSetupProfile } from "@/lib/google-setup-token";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GOOGLE_SETUP_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const profile = await readGoogleSetupProfile(token);
  if (!profile) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  return NextResponse.json({
    connected: true,
    profile: {
      name: profile.name,
      email: profile.email,
    },
  });
}
