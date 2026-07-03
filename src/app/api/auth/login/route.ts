import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { setAuthCookie } from "@/lib/auth-cookie";
import { signAuthSession } from "@/lib/auth-token";
import { hasSheetsConfig } from "@/lib/env";
import { findUserByEmail } from "@/infrastructure/sheets/store";

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  if (!hasSheetsConfig()) {
    return NextResponse.json(
      { error: "Falta configurar Google Sheets en Vercel." },
      { status: 503 },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Email o contrasena invalidos." }, { status: 400 });
  }

  try {
    const user = await findUserByEmail(parsed.data.email);
    if (!user || user.status !== "active" || !user.passwordHash) {
      return NextResponse.json({ error: "Email o contrasena incorrectos." }, { status: 401 });
    }

    const validPassword = await compare(parsed.data.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Email o contrasena incorrectos." }, { status: 401 });
    }

    const token = await signAuthSession({
      userId: user.id,
      gymId: user.gymId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        gymId: user.gymId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: "/dashboard",
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "No se pudo iniciar sesion. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
