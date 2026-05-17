import { Client } from "@microsoft/microsoft-graph-client";
import { FILE } from "@/lib/constants";
import { tryListChildren } from "./folders";
import { buildPhasePath, buildPhotosPath, buildTenancyPath } from "./paths";
import type { TenancyStage } from "@/types/tenancy-stage";

export interface TenancyState {
  stage: TenancyStage;
  checkin: PhaseState;
  checkout: PhaseState;
  comparisonExists: boolean;
}

export interface PhaseState {
  photoCount: number;
  dataJsonExists: boolean;
  reportPdfExists: boolean;
}

async function readPhaseState(
  client: Client,
  propertySlug: string,
  tenancySlug: string,
  kind: "checkin" | "checkout"
): Promise<PhaseState> {
  const phaseFolderItems = await tryListChildren(client, buildPhasePath(propertySlug, tenancySlug, kind));
  const photoFolderItems = await tryListChildren(client, buildPhotosPath(propertySlug, tenancySlug, kind));
  const photoCount = photoFolderItems.filter((i) => i.file).length;
  const dataName = kind === "checkin" ? FILE.checkinData : FILE.checkoutData;
  const reportName = kind === "checkin" ? FILE.checkinReport : FILE.checkoutReport;
  return {
    photoCount,
    dataJsonExists: phaseFolderItems.some((i) => i.name === dataName),
    reportPdfExists: phaseFolderItems.some((i) => i.name === reportName),
  };
}

export async function deriveTenancyState(
  client: Client,
  propertySlug: string,
  tenancySlug: string
): Promise<TenancyState> {
  const tenancyItems = await tryListChildren(client, buildTenancyPath(propertySlug, tenancySlug));
  const comparisonExists = tenancyItems.some((i) => i.name === FILE.comparisonReport);
  const [checkin, checkout] = await Promise.all([
    readPhaseState(client, propertySlug, tenancySlug, "checkin"),
    readPhaseState(client, propertySlug, tenancySlug, "checkout"),
  ]);
  const stage = computeStage({ checkin, checkout, comparisonExists });
  return { stage, checkin, checkout, comparisonExists };
}

function computeStage(input: {
  checkin: PhaseState;
  checkout: PhaseState;
  comparisonExists: boolean;
}): TenancyStage {
  const { checkin, checkout, comparisonExists } = input;
  if (comparisonExists) return "COMPARED";
  if (checkout.reportPdfExists) return "CHECKOUT_FINALISED";
  if (checkout.dataJsonExists) return "CHECKOUT_CATEGORISED";
  if (checkout.photoCount > 0) return "CHECKOUT_UPLOADED";
  if (checkin.reportPdfExists) return "CHECKIN_FINALISED";
  if (checkin.dataJsonExists) return "CHECKIN_CATEGORISED";
  if (checkin.photoCount > 0) return "CHECKIN_UPLOADED";
  return "EMPTY";
}
