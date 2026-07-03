import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "gym-control",
    timestamp: new Date().toISOString(),
  });
}
