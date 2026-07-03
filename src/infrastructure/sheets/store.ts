import { getGoogleSheetsClient } from "@/infrastructure/sheets/google-sheets.client";
import { SHEET_SCHEMAS, type SheetName } from "@/infrastructure/sheets/schema";

export async function ensureSheetsStructure() {
  const { sheets, spreadsheetId } = getGoogleSheetsClient();
  const metadata = await sheets.spreadsheets.get({ spreadsheetId });
  const existingNames = new Set(
    metadata.data.sheets?.map((sheet) => sheet.properties?.title).filter(Boolean) as string[],
  );

  const missingNames = Object.keys(SHEET_SCHEMAS).filter((name) => !existingNames.has(name));

  if (missingNames.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: missingNames.map((title) => ({ addSheet: { properties: { title } } })),
      },
    });
  }

  for (const [name, headers] of Object.entries(SHEET_SCHEMAS)) {
    const current = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${name}!1:1`,
    });

    if (!current.data.values?.[0]?.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${name}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [[...headers]] },
      });
    }
  }
}

export async function getRows(sheetName: SheetName) {
  const { sheets, spreadsheetId } = getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  });
  return response.data.values ?? [];
}

export async function appendRows(sheetName: SheetName, rows: Array<Array<string | number | boolean>>) {
  if (rows.length === 0) return;
  const { sheets, spreadsheetId } = getGoogleSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:ZZ`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: rows },
  });
}

export async function isInitialSetupComplete() {
  await ensureSheetsStructure();
  const gyms = await getRows("GIMNASIOS");
  return gyms.some((row) => String(row[0] ?? "").trim().length > 0);
}

export async function findUserByEmail(email: string) {
  await ensureSheetsStructure();
  const users = await getRows("USUARIOS");
  const normalizedEmail = email.trim().toLowerCase();
  const row = users.find((item) => String(item[5] ?? "").trim().toLowerCase() === normalizedEmail);
  if (!row) return null;

  return {
    id: String(row[0] ?? ""),
    gymId: String(row[1] ?? ""),
    branchId: String(row[2] ?? ""),
    memberId: String(row[3] ?? ""),
    name: String(row[4] ?? ""),
    email: String(row[5] ?? ""),
    passwordHash: String(row[6] ?? ""),
    role: String(row[7] ?? ""),
    status: String(row[8] ?? ""),
    provider: String(row[9] ?? "password"),
    googleSub: String(row[10] ?? ""),
    createdAt: String(row[11] ?? ""),
  };
}
