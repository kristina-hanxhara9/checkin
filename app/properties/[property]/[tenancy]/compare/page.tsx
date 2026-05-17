"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, FileDown, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { buildComparisonJsonPath } from "@/lib/onedrive/paths";
import { FILE } from "@/lib/constants";
import type { ComparisonReport } from "@/types/domain";
import type { DriveItem } from "@/lib/onedrive/folders";
import { buildTenancyPath } from "@/lib/onedrive/paths";

interface Props {
  params: Promise<{ property: string; tenancy: string }>;
}

export default function ComparePage({ params }: Props) {
  const { property, tenancy } = use(params);
  const propertySlug = decodeURIComponent(property);
  const tenancySlug = decodeURIComponent(tenancy);
  const { getToken, account } = useGraphToken();
  const inspectorName = account?.name?.trim() || account?.username?.trim() || undefined;
  const [working, setWorking] = useState<"run" | "pdf" | null>(null);

  const tenancyPath = buildTenancyPath(propertySlug, tenancySlug);
  const tenancyItems = useQuery({
    queryKey: ["tenancyFiles", propertySlug, tenancySlug],
    queryFn: async () => {
      const res = await authedFetch(getToken, `/api/onedrive/list?path=${encodeURIComponent(tenancyPath)}`);
      if (!res.ok) throw new Error(`Failed to list (${res.status})`);
      const json = (await res.json()) as { items: DriveItem[] };
      return json.items;
    },
  });

  const comparisonExists = tenancyItems.data?.some((i) => i.name === FILE.comparisonReport) ?? false;
  const comparisonJsonExists = tenancyItems.data?.some((i) => i.name === FILE.comparisonData) ?? false;

  const savedReport = useQuery({
    queryKey: ["comparison", propertySlug, tenancySlug, comparisonJsonExists],
    queryFn: async () => {
      const res = await authedFetch(
        getToken,
        `/api/onedrive/json?path=${encodeURIComponent(buildComparisonJsonPath(propertySlug, tenancySlug))}`
      );
      if (!res.ok) throw new Error(`Failed to load comparison (${res.status})`);
      return (await res.json()) as ComparisonReport;
    },
    enabled: comparisonJsonExists,
  });

  const [report, setReport] = useState<ComparisonReport | null>(null);
  const activeReport = report ?? savedReport.data ?? null;

  const runComparison = async () => {
    setWorking("run");
    try {
      const res = await authedFetch(getToken, "/api/gemini/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertySlug, tenancySlug }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Comparison failed: ${text}`);
      }
      const data = (await res.json()) as ComparisonReport;
      setReport(data);
      await tenancyItems.refetch();
      toast.success("Comparison complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setWorking(null);
    }
  };

  const generatePdf = async () => {
    if (!activeReport) return;
    setWorking("pdf");
    try {
      const res = await authedFetch(getToken, "/api/pdf/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: activeReport, inspectorName }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PDF generation failed: ${text}`);
      }
      await tenancyItems.refetch();
      toast.success("Comparison PDF saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "PDF generation failed");
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {tenancySlug.replace(/-/g, " ")}
        </Link>
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deposit comparison</h1>
          {comparisonExists && (
            <p className="mt-1 text-xs text-emerald-700">
              ✓ PDF saved to OneDrive — re-running will overwrite it
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!activeReport && (
            <Button onClick={runComparison} disabled={working === "run"}>
              {working === "run" ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Running comparison… 1–2 minutes
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-4 w-4" />
                  Run comparison
                </>
              )}
            </Button>
          )}
          {activeReport && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (comparisonExists && !confirm("Re-run comparison? This will overwrite the existing report.")) return;
                  runComparison();
                }}
                disabled={working !== null}
              >
                Re-run
              </Button>
              <Button
                onClick={() => {
                  if (comparisonExists && !confirm("Overwrite the existing comparison PDF in OneDrive?")) return;
                  generatePdf();
                }}
                disabled={working !== null}
              >
                {working === "pdf" ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    {comparisonExists ? "Regenerating PDF…" : "Generating PDF…"}
                  </>
                ) : (
                  <>
                    <FileDown className="mr-1 h-4 w-4" />
                    {comparisonExists ? "Regenerate PDF (overwrites)" : "Generate PDF"}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {(savedReport.isLoading || working === "run") && !activeReport && (
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      )}

      {activeReport && <ComparisonView data={activeReport} />}

      {!activeReport && !savedReport.isLoading && working !== "run" && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to compare</CardTitle>
            <CardDescription>
              Gemini 2.5 Pro will diff the check-in and check-out reports using UK Tenant Fees Act 2019 standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runComparison} disabled={working !== null}>
              <Sparkles className="mr-1 h-4 w-4" />
              Run comparison
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
