import { google } from "googleapis";
import { getSheetsEnv } from "@/lib/env";

export function getGoogleDriveClient() {
  const env = getSheetsEnv();
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return {
    drive: google.drive({ version: "v3", auth }),
    folderId: env.GOOGLE_DRIVE_MACHINE_FOLDER_ID,
  };
}
