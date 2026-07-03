import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth-cookie";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  removeAuthCookie(response);
  return response;
}
