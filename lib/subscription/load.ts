import { Client } from "@microsoft/microsoft-graph-client";
import { downloadJson, saveJson } from "@/lib/onedrive/files";
import { ensureFolder } from "@/lib/onedrive/folders";
import { ROOT_FOLDER, isAdminEmail } from "@/lib/constants";
import { buildSubscriptionPath } from "./path";
import type { Subscription } from "@/types/subscription";

function adminSubscription(): Subscription {
  return {
    plan: "admin",
    status: "active",
    startedAt: new Date(0).toISOString(),
    note: "Founder/admin override via ADMIN_EMAILS env var.",
  };
}

/** Read subscription record from the user's OneDrive. Returns null if missing. */
export async function loadSubscription(
  client: Client,
  email: string | null | undefined
): Promise<Subscription | null> {
  // Admin bypass — founder accounts skip the paywall entirely.
  if (isAdminEmail(email)) return adminSubscription();

  try {
    return await downloadJson<Subscription>(client, buildSubscriptionPath());
  } catch {
    return null;
  }
}

/** Write a subscription record to the user's OneDrive. */
export async function saveSubscription(
  client: Client,
  subscription: Subscription
): Promise<void> {
  await ensureFolder(client, ROOT_FOLDER);
  await saveJson(client, buildSubscriptionPath(), subscription);
}
