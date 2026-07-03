import { NextResponse } from "next/server";
import { hasGoogleOAuthConfig, hasSheetsConfig } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "gym-control",
    timestamp: new Date().toISOString(),
    configuration: {
      sheets: hasSheetsConfig(),
      googleOAuth: hasGoogleOAuthConfig(),
      machineImagesDrive: Boolean(process.env.GOOGLE_DRIVE_MACHINE_FOLDER_ID),
      sessionSecret: Boolean(process.env.JWT_SECRET),
    },
  });
}
