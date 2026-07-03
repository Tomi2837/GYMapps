import { google } from "googleapis";
import { getSheetsEnv } from "@/lib/env";

export function getGoogleSheetsClient() {
  const env = getSheetsEnv();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return {
    spreadsheetId: env.GOOGLE_SHEETS_ID,
    tenantId: env.TENANT_ID,
    sheets: google.sheets({ version: "v4", auth }),
  };
}
