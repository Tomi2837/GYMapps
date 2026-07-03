import { hash } from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { setAuthCookie } from "@/lib/auth-cookie";
import { signAuthSession } from "@/lib/auth-token";
import { hasSheetsConfig } from "@/lib/env";
import { GOOGLE_SETUP_COOKIE, readGoogleSetupProfile } from "@/lib/google-setup-token";
import { appendRows, ensureSheetsStructure, isInitialSetupComplete } from "@/infrastructure/sheets/store";

const setupSchema = z.object({
  admin: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    password: z.string().max(128).optional().default(""),
    provider: z.enum(["password", "google"]).default("password"),
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

    let adminName = parsed.data.admin.name;
    let adminEmail = parsed.data.admin.email;
    let googleSub = "";
    const provider = parsed.data.admin.provider;

    if (provider === "google") {
      const cookieStore = await cookies();
      const pendingToken = cookieStore.get(GOOGLE_SETUP_COOKIE)?.value;
      const verifiedProfile = pendingToken ? await readGoogleSetupProfile(pendingToken) : null;

      if (!verifiedProfile) {
        return NextResponse.json(
          { error: "La verificacion con Google vencio. Vuelve a conectar la cuenta." },
          { status: 401 },
        );
      }

      adminName = verifiedProfile.name;
      adminEmail = verifiedProfile.email;
      googleSub = verifiedProfile.googleSub;
    } else if (parsed.data.admin.password.length < 8) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 8 caracteres." },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const gymId = `gym_${uuid()}`;
    const branchId = `branch_${uuid()}`;
    const userId = `user_${uuid()}`;
    const passwordHash = provider === "password"
      ? await hash(parsed.data.admin.password, 12)
      : "";
    const machineRecords = parsed.data.machines.map((machine) => ({
      catalogId: machine.id,
      machineId: `machine_${uuid()}`,
      name: machine.name,
      category: machine.category,
      imageName: machine.imageName ?? "",
    }));

    await appendRows("USUARIOS", [[
      userId,
      gymId,
      branchId,
      "",
      adminName,
      adminEmail,
      passwordHash,
      "admin",
      "active",
      provider,
      googleSub,
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
      machineRecords.map((machine) => [
        machine.machineId,
        gymId,
        machine.name,
        machine.category,
        "",
        "stock",
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
      email: adminEmail,
      name: adminName,
      role: "admin",
    });

    const response = NextResponse.json({
      ok: true,
      gymId,
      machineMap: machineRecords.map(({ catalogId, machineId }) => ({ catalogId, machineId })),
      redirectTo: "/dashboard",
    });
    setAuthCookie(response, token);
    response.cookies.set(GOOGLE_SETUP_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Initial setup failed", error);
    return NextResponse.json(
      { error: "No se pudo crear el gimnasio. Revisa la conexion con Google Sheets." },
      { status: 500 },
    );
  }
}
