"use client";

import { use } from "react";
import { InspectionFlow } from "@/components/InspectionFlow";

interface Props {
  params: Promise<{ property: string; tenancy: string }>;
}

export default function CheckinPage({ params }: Props) {
  const { property, tenancy } = use(params);
  return (
    <InspectionFlow
      propertySlug={decodeURIComponent(property)}
      tenancySlug={decodeURIComponent(tenancy)}
      kind="checkin"
    />
  );
}
