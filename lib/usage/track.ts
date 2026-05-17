import { Client } from "@microsoft/microsoft-graph-client";
import { downloadJson, saveJson } from "@/lib/onedrive/files";
import { buildTenancyPath } from "@/lib/onedrive/paths";

const USAGE_FILE = "_usage.json";

export interface TenancyUsage {
  categorise: number;
  compare: number;
  lastCategoriseAt?: string;
  lastCompareAt?: string;
  updatedAt: string;
}

const EMPTY: TenancyUsage = {
  categorise: 0,
  compare: 0,
  updatedAt: new Date(0).toISOString(),
};

function usagePath(propertySlug: string, tenancySlug: string) {
  return `${buildTenancyPath(propertySlug, tenancySlug)}/${USAGE_FILE}`;
}

async function readUsage(client: Client, propertySlug: string, tenancySlug: string): Promise<TenancyUsage> {
  try {
    return await downloadJson<TenancyUsage>(client, usagePath(propertySlug, tenancySlug));
  } catch {
    return { ...EMPTY };
  }
}

export class UsageLimitError extends Error {
  status = 429;
  constructor(message: string) {
    super(message);
  }
}

interface EnsureOpts {
  client: Client;
  propertySlug: string;
  tenancySlug: string;
  action: "categorise" | "compare";
  limit: number;
  cooldownSeconds?: number; // min time between calls
}

/**
 * Atomically (best-effort, no locks) check + increment usage for an action.
 * Throws UsageLimitError if the cap is hit or cooldown not elapsed.
 */
export async function enforceUsage(opts: EnsureOpts): Promise<TenancyUsage> {
  const { client, propertySlug, tenancySlug, action, limit, cooldownSeconds = 0 } = opts;
  const usage = await readUsage(client, propertySlug, tenancySlug);

  if (usage[action] >= limit) {
    throw new UsageLimitError(
      `This tenancy has reached the limit of ${limit} ${action === "categorise" ? "AI categorisations" : "comparisons"}. Delete the tenancy folder in OneDrive to reset, or contact support if you need a higher cap.`
    );
  }

  if (cooldownSeconds > 0) {
    const lastKey = action === "categorise" ? "lastCategoriseAt" : "lastCompareAt";
    const last = usage[lastKey];
    if (last) {
      const elapsed = (Date.now() - new Date(last).getTime()) / 1000;
      if (elapsed < cooldownSeconds) {
        const wait = Math.ceil(cooldownSeconds - elapsed);
        throw new UsageLimitError(
          `Please wait ${wait}s before running another ${action} on this tenancy.`
        );
      }
    }
  }

  const next: TenancyUsage = {
    ...usage,
    [action]: usage[action] + 1,
    [action === "categorise" ? "lastCategoriseAt" : "lastCompareAt"]: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveJson(client, usagePath(propertySlug, tenancySlug), next);
  return next;
}
