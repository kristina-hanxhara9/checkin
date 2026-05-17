export type TenancyStage =
  | "EMPTY"
  | "CHECKIN_UPLOADED"
  | "CHECKIN_CATEGORISED"
  | "CHECKIN_FINALISED"
  | "CHECKOUT_UPLOADED"
  | "CHECKOUT_CATEGORISED"
  | "CHECKOUT_FINALISED"
  | "COMPARED";

export const STAGE_LABELS: Record<TenancyStage, string> = {
  EMPTY: "Not started",
  CHECKIN_UPLOADED: "Check-in photos uploaded",
  CHECKIN_CATEGORISED: "Check-in categorised — review pending",
  CHECKIN_FINALISED: "Check-in finalised",
  CHECKOUT_UPLOADED: "Check-out photos uploaded",
  CHECKOUT_CATEGORISED: "Check-out categorised — review pending",
  CHECKOUT_FINALISED: "Check-out finalised — ready to compare",
  COMPARED: "Comparison complete",
};

export const STAGE_TONE: Record<TenancyStage, "neutral" | "progress" | "ready" | "done"> = {
  EMPTY: "neutral",
  CHECKIN_UPLOADED: "progress",
  CHECKIN_CATEGORISED: "ready",
  CHECKIN_FINALISED: "progress",
  CHECKOUT_UPLOADED: "progress",
  CHECKOUT_CATEGORISED: "ready",
  CHECKOUT_FINALISED: "ready",
  COMPARED: "done",
};
