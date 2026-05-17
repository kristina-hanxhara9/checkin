import { FILE, FOLDER, ROOT_FOLDER } from "@/lib/constants";
import type { InspectionKind } from "@/types/domain";

export function buildBrandingJsonPath(): string {
  return `${ROOT_FOLDER}/${FILE.branding}`;
}

export function buildLogoPath(filename: string): string {
  return `${ROOT_FOLDER}/${filename}`;
}

function encodeSegment(seg: string): string {
  return encodeURIComponent(seg).replace(/'/g, "%27");
}

export function buildRoot(): string {
  return ROOT_FOLDER;
}

export function buildPropertyPath(propertySlug: string): string {
  return `${ROOT_FOLDER}/${propertySlug}`;
}

export function buildTenancyPath(propertySlug: string, tenancySlug: string): string {
  return `${ROOT_FOLDER}/${propertySlug}/${tenancySlug}`;
}

export function buildPhaseFolder(kind: InspectionKind): string {
  return kind === "checkin" ? FOLDER.checkin : FOLDER.checkout;
}

export function buildPhasePath(propertySlug: string, tenancySlug: string, kind: InspectionKind): string {
  return `${buildTenancyPath(propertySlug, tenancySlug)}/${buildPhaseFolder(kind)}`;
}

export function buildPhotosPath(propertySlug: string, tenancySlug: string, kind: InspectionKind): string {
  return `${buildPhasePath(propertySlug, tenancySlug, kind)}/${FOLDER.photos}`;
}

export function buildDataJsonPath(propertySlug: string, tenancySlug: string, kind: InspectionKind): string {
  const file = kind === "checkin" ? FILE.checkinData : FILE.checkoutData;
  return `${buildPhasePath(propertySlug, tenancySlug, kind)}/${file}`;
}

export function buildReportPdfPath(propertySlug: string, tenancySlug: string, kind: InspectionKind): string {
  const file = kind === "checkin" ? FILE.checkinReport : FILE.checkoutReport;
  return `${buildPhasePath(propertySlug, tenancySlug, kind)}/${file}`;
}

export function buildComparisonJsonPath(propertySlug: string, tenancySlug: string): string {
  return `${buildTenancyPath(propertySlug, tenancySlug)}/${FILE.comparisonData}`;
}

export function buildComparisonPdfPath(propertySlug: string, tenancySlug: string): string {
  return `${buildTenancyPath(propertySlug, tenancySlug)}/${FILE.comparisonReport}`;
}

export function graphItemPathRef(driveItemPath: string): string {
  const segments = driveItemPath.split("/").filter(Boolean).map(encodeSegment).join("/");
  return `/me/drive/root:/${segments}`;
}

export function graphContentRef(driveItemPath: string): string {
  return `${graphItemPathRef(driveItemPath)}:/content`;
}

export function graphChildrenRef(driveFolderPath: string): string {
  if (!driveFolderPath) return `/me/drive/root/children`;
  return `${graphItemPathRef(driveFolderPath)}:/children`;
}

export function graphCreateUploadSessionRef(driveItemPath: string): string {
  return `${graphItemPathRef(driveItemPath)}:/createUploadSession`;
}
