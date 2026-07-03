import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { setAuthCookie } from "@/lib/auth-cookie";
import { signAuthSession } from "@/lib/auth-token";
import { hasSheetsConfig } from "@/lib/env";
import { appendRows, ensureSheetsStructure, isInitialSetupComplete } from "@/infrastructure/sheets/store";

const setupSchema = z.object({
  admin: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    password: z.string().min(8).max(128),
  }),
  gym: z.object({
    name: z.string().trim().min(2).max(120),
    address: z.string().trim().min(4).max(220),
    phone: z.string().trim().max(40).optional().default(""),
  }),
  brand: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  activities: z.array(z.string().trim().min(1).max(80)).min(1).max(50),
  machines: z.array(
    z.object({
      id: z.string().trim().min(1).max(100),
      name: z.string().trim().min(1).max(120),
      category: z.string().trim().min(1).max(80),
      imageUrl: z.string().url().optional().or(z.literal("")),
      imageName: z.string().max(180).optional(),
    }),
  ).max(200),
});

export async function GET() {
  if (!hasSheetsConfig()) {
    return NextResponse.json({ configured: false, setupComplete: false });
  }

  try {
    return NextResponse.json({
      configured: true,
      setupComplete: await isInitialSetupComplete(),
    });
  } catch {
    return NextResponse.json(
      { configured: true, setupComplete: false, error: "No se pudo consultar Google Sheets." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!hasSheetsConfig()) {
    return NextResponse.json(
      { error: "Falta configurar Google Sheets en Vercel." },
      { status: 503 },
    );
  }

  const parsed = setupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los datos ingresados.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    await ensureSheetsStructure();

    if (await isInitialSetupComplete()) {
      return NextResponse.json(
        { error: "Este gimnasio ya fue configurado." },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const gymId = `gym_${uuid()}`;
    const branchId = `branch_${uuid()}`;
    const userId = `user_${uuid()}`;
    const passwordHash = await hash(parsed.data.admin.password, 12);

    await appendRows("USUARIOS", [[
      userId,
      gymId,
      branchId,
      "",
      parsed.data.admin.name,
      parsed.data.admin.email,
      passwordHash,
      "admin",
      "active",
      "password",
      "",
      now,
    ]]);

    await appendRows("SUCURSALES", [[
      branchId,
      gymId,
      "Sucursal principal",
      parsed.data.gym.address,
      `qr_${uuid()}`,
      "active",
      now,
    ]]);

    await appendRows(
      "ACTIVIDADES",
      parsed.data.activities.map((activity) => [`activity_${uuid()}`, gymId, activity, true]),
    );

    await appendRows(
      "MAQUINAS",
      parsed.data.machines.map((machine) => [
        `machine_${uuid()}`,
        gymId,
        machine.name,
        machine.category,
        machine.imageUrl ?? "",
        machine.imageUrl ? "custom" : "stock",
        true,
        now,
      ]),
    );

    await appendRows("GIMNASIOS", [[
      gymId,
      parsed.data.gym.name,
      parsed.data.gym.address,
      parsed.data.gym.phone,
      "",
      parsed.data.brand.primary,
      parsed.data.brand.secondary,
      parsed.data.brand.background,
      "active",
      now,
    ]]);

    const token = await signAuthSession({
      userId,
      gymId,
      email: parsed.data.admin.email,
      name: parsed.data.admin.name,
      role: "admin",
    });

    const response = NextResponse.json({ ok: true, gymId, redirectTo: "/dashboard" });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Initial setup failed", error);
    return NextResponse.json(
      { error: "No se pudo crear el gimnasio. Revisa la conexion con Google Sheets." },
      { status: 500 },
    );
  }
}
