import { z } from "zod";

const sessionEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
});

const sheetsEnvSchema = z.object({
  TENANT_ID: z.string().min(1),
  GOOGLE_SHEETS_ID: z.string().min(1),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GOOGLE_PRIVATE_KEY: z.string().min(1),
  GOOGLE_DRIVE_MACHINE_FOLDER_ID: z.string().min(1).optional(),
});

const googleOAuthEnvSchema = z.object({
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export function getSessionEnv() {
  return sessionEnvSchema.parse({
    JWT_SECRET: process.env.JWT_SECRET,
  });
}

export function hasSheetsConfig(): boolean {
  return Boolean(
    process.env.TENANT_ID &&
      process.env.GOOGLE_SHEETS_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY,
  );
}

export function getSheetsEnv() {
  return sheetsEnvSchema.parse({
    TENANT_ID: process.env.TENANT_ID,
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    GOOGLE_DRIVE_MACHINE_FOLDER_ID: process.env.GOOGLE_DRIVE_MACHINE_FOLDER_ID,
  });
}

export function hasGoogleOAuthConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.NEXT_PUBLIC_APP_URL,
  );
}

export function getGoogleOAuthEnv() {
  return googleOAuthEnvSchema.parse({
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
}
