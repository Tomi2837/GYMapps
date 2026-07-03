import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-cookie";
import { getGoogleDriveClient } from "@/infrastructure/drive/google-drive.client";
import { updateMachineImage } from "@/infrastructure/sheets/store";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

function safeName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(request: Request) {
  const session = await getAuthenticatedUser();
  if (!session || !["admin", "superadmin"].includes(session.role)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const machineId = String(formData.get("machineId") ?? "").trim();

  if (!(file instanceof File) || !machineId) {
    return NextResponse.json({ error: "Falta la imagen o la maquina." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "El archivo debe ser una imagen JPG, PNG, WEBP o HEIC." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "La imagen supera el limite de 8 MB." }, { status: 413 });
  }

  try {
    const { drive, folderId } = getGoogleDriveClient();
    if (!folderId) {
      return NextResponse.json(
        { error: "Falta configurar la carpeta de Drive para imagenes." },
        { status: 503 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await drive.files.create({
      requestBody: {
        name: `${machineId}_${Date.now()}_${safeName(file.name)}`,
        parents: [folderId],
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: "id",
      supportsAllDrives: true,
    });

    const fileId = uploaded.data.id;
    if (!fileId) throw new Error("Drive did not return a file id");

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
      supportsAllDrives: true,
    });

    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    await updateMachineImage(session.gymId, machineId, imageUrl);

    return NextResponse.json({ ok: true, imageUrl, fileId });
  } catch (error) {
    console.error("Machine image upload failed", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen a Google Drive." },
      { status: 500 },
    );
  }
}
