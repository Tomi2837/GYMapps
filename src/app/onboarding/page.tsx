import { redirect } from "next/navigation";
import { hasSheetsConfig } from "@/lib/env";
import { isInitialSetupComplete } from "@/infrastructure/sheets/store";
import { OnboardingWizard } from "./onboarding-wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (hasSheetsConfig() && (await isInitialSetupComplete())) {
    redirect("/login");
  }

  return <OnboardingWizard />;
}
