export type Rating = "Good" | "Fair" | "Poor";

export type Confidence = "high" | "medium" | "low";

export type Verdict = "no_change" | "fair_wear" | "tenant_liable" | "pre_existing";

export type InspectionKind = "checkin" | "checkout";

export interface Item {
  name: string;
  rating: Rating;
  notes: string;
  flagged: boolean;
  photoRefs: string[];
}

export interface RoomReport {
  room: string;
  confidence: Confidence;
  items: Item[];
}

export interface CheckinData {
  propertySlug: string;
  tenancySlug: string;
  kind: InspectionKind;
  generatedAt: string;
  rooms: RoomReport[];
}

export interface ItemComparison {
  room: string;
  itemName: string;
  before: string;
  after: string;
  verdict: Verdict;
  reason: string;
  estimatedCost: number | null;
}

export interface ComparisonSummary {
  totalFlagged: number;
  tenantLiableCount: number;
  depositRecommendation: string;
}

export interface ComparisonReport {
  generatedAt: string;
  propertySlug: string;
  tenancySlug: string;
  summary: ComparisonSummary;
  rooms: { room: string; items: ItemComparison[] }[];
}

export interface Property {
  slug: string;
  displayName: string;
  createdAt: string;
}

export interface Tenancy {
  slug: string;
  displayName: string;
  propertySlug: string;
  createdAt: string;
}
