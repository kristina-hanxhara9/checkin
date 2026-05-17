"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Image as ImageIcon, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StageIndicator } from "@/components/tenancy/StageIndicator";
import { TenancyActions } from "@/components/tenancy/TenancyActions";
import { useTenancyState } from "@/lib/hooks/useTenancyState";

interface Props {
  params: Promise<{ property: string; tenancy: string }>;
}

export default function TenancyPage({ params }: Props) {
  const { property, tenancy } = use(params);
  const propertySlug = decodeURIComponent(property);
  const tenancySlug = decodeURIComponent(tenancy);
  const { data, isLoading, error } = useTenancyState(propertySlug, tenancySlug);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href={`/properties/${encodeURIComponent(propertySlug)}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {propertySlug.replace(/-/g, " ")}
          </Link>
        </Button>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{tenancySlug.replace(/-/g, " ")}</h1>
            {data && (
              <div className="mt-2">
                <StageIndicator stage={data.stage} />
              </div>
            )}
          </div>
          {data && <TenancyActions propertySlug={propertySlug} tenancySlug={tenancySlug} stage={data.stage} />}
        </div>
      </div>

      {isLoading && <Skeleton className="h-40" />}

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PhaseCard
            kind="checkin"
            title="Check-in"
            photoCount={data.checkin.photoCount}
            categorised={data.checkin.dataJsonExists}
            finalised={data.checkin.reportPdfExists}
            href={`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}/check-in`}
          />
          <PhaseCard
            kind="checkout"
            title="Check-out"
            photoCount={data.checkout.photoCount}
            categorised={data.checkout.dataJsonExists}
            finalised={data.checkout.reportPdfExists}
            disabled={!data.checkin.reportPdfExists}
            href={`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}/check-out`}
          />

          {data.checkout.reportPdfExists && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileBarChart className="h-5 w-5" />
                  Deposit comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {data.comparisonExists
                    ? "Comparison report is ready."
                    : "Both check-in and check-out are finalised. Generate the comparison report next."}
                </p>
                <Button asChild className="mt-3">
                  <Link href={`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}/compare`}>
                    {data.comparisonExists ? "View comparison" : "Run comparison"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function PhaseCard({
  kind,
  title,
  photoCount,
  categorised,
  finalised,
  disabled,
  href,
}: {
  kind: "checkin" | "checkout";
  title: string;
  photoCount: number;
  categorised: boolean;
  finalised: boolean;
  disabled?: boolean;
  href: string;
}) {
  return (
    <Card className={disabled ? "opacity-60" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          {photoCount} photo{photoCount === 1 ? "" : "s"}
        </div>
        <div className="text-muted-foreground">
          {finalised ? "✓ Finalised" : categorised ? "Review pending" : photoCount > 0 ? "Categorise next" : "Not started"}
        </div>
        <Button variant={finalised ? "outline" : "default"} size="sm" asChild disabled={disabled} className="mt-2">
          <Link href={href}>{finalised ? "View" : photoCount > 0 ? "Continue" : "Start"}</Link>
        </Button>
        {disabled && (
          <p className="text-xs text-muted-foreground">Finalise check-in first.</p>
        )}
      </CardContent>
    </Card>
  );
}
