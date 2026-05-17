export interface Branding {
  businessName: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  logoFilename?: string;
  updatedAt: string;
}

export const DEFAULT_BRANDING: Branding = {
  businessName: "PropertyCheck",
  updatedAt: new Date(0).toISOString(),
};
