"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TenancyStage } from "@/types/tenancy-stage";

interface Props {
  propertySlug: string;
  tenancySlug: string;
  stage: TenancyStage;
}

export function TenancyActions({ propertySlug, tenancySlug, stage }: Props) {
  const base = `/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}`;

  switch (stage) {
    case "EMPTY":
      return <PrimaryLink href={`${base}/check-in`}>Start check-in</PrimaryLink>;
    case "CHECKIN_UPLOADED":
    case "CHECKIN_CATEGORISED":
      return <PrimaryLink href={`${base}/check-in`}>Continue check-in</PrimaryLink>;
    case "CHECKIN_FINALISED":
      return <PrimaryLink href={`${base}/check-out`}>Start check-out</PrimaryLink>;
    case "CHECKOUT_UPLOADED":
    case "CHECKOUT_CATEGORISED":
      return <PrimaryLink href={`${base}/check-out`}>Continue check-out</PrimaryLink>;
    case "CHECKOUT_FINALISED":
      return <PrimaryLink href={`${base}/compare`}>Run comparison</PrimaryLink>;
    case "COMPARED":
      return (
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`${base}/compare`}>View comparison</Link>
          </Button>
        </div>
      );
  }
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button asChild>
      <Link href={href}>
        {children}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </Button>
  );
}
