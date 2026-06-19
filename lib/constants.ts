export const ROOT_FOLDER = "Properties";

export const FOLDER = {
  checkin: "check-in",
  checkout: "check-out",
  photos: "photos",
} as const;

export const FILE = {
  checkinData: "checkin-data.json",
  checkoutData: "checkout-data.json",
  checkinReport: "checkin-report.pdf",
  checkoutReport: "checkout-report.pdf",
  comparisonData: "comparison-data.json",
  comparisonReport: "comparison-report.pdf",
  branding: "branding.json",
} as const;

export const LOGO_BASENAME = "logo";
export const ALLOWED_LOGO_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "webp"] as const;
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export const GRAPH_SCOPES = ["Files.ReadWrite", "User.Read"];

export const MAX_SMALL_UPLOAD = 4 * 1024 * 1024;
export const CHUNK_SIZE = 5 * 1024 * 1024;

export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export const MAX_PHOTOS_PER_PHASE = 60;

export const MAX_CATEGORISATIONS_PER_TENANCY = 10;
export const MAX_COMPARISONS_PER_TENANCY = 5;

// Override at deploy time without a code change. Set GEMINI_FLASH_MODEL /
// GEMINI_PRO_MODEL in Render's env vars to swap to a newer/different model.
export const GEMINI_FLASH = process.env.GEMINI_FLASH_MODEL ?? "gemini-3.5-flash";
export const GEMINI_PRO = process.env.GEMINI_PRO_MODEL ?? "gemini-3.5-pro";
