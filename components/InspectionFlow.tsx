"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Sparkles, FileDown, Camera, FileCheck2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkPhotoUploader } from "@/components/upload/BulkPhotoUploader";
import { ReviewEditor } from "@/components/review/ReviewEditor";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { useDraft } from "@/lib/hooks/useDraft";
import { useTenancyState } from "@/lib/hooks/useTenancyState";
import { usePhotoUrls } from "@/lib/hooks/usePhotoUrls";
import { buildPhotosPath, buildDataJsonPath } from "@/lib/onedrive/paths";
import type { CheckinData, InspectionKind } from "@/types/domain";

function inspectorNameFrom(account?: { name?: string; username?: string }): string | undefined {
  return account?.name?.trim() || account?.username?.trim() || undefined;
}

interface Props {
  propertySlug: string;
  tenancySlug: string;
  kind: InspectionKind;
}

type Step = "upload" | "categorise" | "review" | "done";

export function InspectionFlow({ propertySlug, tenancySlug, kind }: Props) {
  const router = useRouter();
  const { getToken, account } = useGraphToken();
  const inspectorName = inspectorNameFrom(account);
  const { data: state, refetch: refetchState } = useTenancyState(propertySlug, tenancySlug);

  const phase = kind === "checkin" ? state?.checkin : state?.checkout;
  const otherPhase = kind === "checkin" ? "check-in" : "check-out";

  const draftKey = `draft-${propertySlug}-${tenancySlug}-${kind}`;
  const [draft, setDraft, clearDraft] = useDraft<CheckinData | null>(draftKey, null);
  const [step, setStep] = useState<Step | null>(null);
  const [working, setWorking] = useState<"categorise" | "finalise" | null>(null);

  const currentStep: Step =
    step ??
    (phase?.reportPdfExists
      ? "done"
      : draft
        ? "review"
        : phase && phase.photoCount > 0
          ? "categorise"
          : "upload");

  const photosPath = buildPhotosPath(propertySlug, tenancySlug, kind);
  const { data: photoUrls } = usePhotoUrls(photosPath, Boolean(phase && phase.photoCount > 0));

  const runCategorise = async () => {
    setWorking("categorise");
    try {
      const res = await authedFetch(getToken, "/api/gemini/categorise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertySlug, tenancySlug, kind }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Categorisation failed (${res.status})`);
      }
      const { data, stats } = (await res.json()) as {
        data: CheckinData;
        stats: { uploaded: number; itemsDetected: number; photosGroupedByGemini: number };
      };
      setDraft(data);
      setStep("review");
      toast.success(
        stats.photosGroupedByGemini > 0
          ? `Found ${stats.itemsDetected} items across ${stats.uploaded} photos (${stats.photosGroupedByGemini} grouped as duplicates)`
          : `Found ${stats.itemsDetected} items across ${stats.uploaded} photos`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Categorisation failed");
    } finally {
      setWorking(null);
    }
  };

  const loadSavedJson = async () => {
    setWorking("categorise");
    try {
      const res = await authedFetch(
        getToken,
        `/api/onedrive/json?path=${encodeURIComponent(buildDataJsonPath(propertySlug, tenancySlug, kind))}`
      );
      if (!res.ok) throw new Error(`Failed to load saved JSON (${res.status})`);
      const data = (await res.json()) as CheckinData;
      setDraft(data);
      setStep("review");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load saved data");
    } finally {
      setWorking(null);
    }
  };

  const validateDraft = (d: CheckinData): string | null => {
    if (d.rooms.length === 0) return "Add at least one room before finalising.";
    for (const room of d.rooms) {
      if (!room.room.trim()) return "Every room needs a name.";
      if (room.items.length === 0) {
        return `Room "${room.room}" has no items. Add at least one or remove the room.`;
      }
      for (const item of room.items) {
        if (!item.name.trim()) return `An item in "${room.room}" has no name.`;
      }
    }
    return null;
  };

  const finalise = async () => {
    if (!draft) return;
    const validationError = validateDraft(draft);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setWorking("finalise");
    try {
      const res = await authedFetch(getToken, "/api/pdf/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: draft, inspectorName }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Finalisation failed (${res.status})`);
      }
      clearDraft();
      toast.success(`${kind === "checkin" ? "Check-in" : "Check-out"} finalised`);
      await refetchState();
      setStep("done");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Finalisation failed");
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

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{kind === "checkin" ? "Check-in" : "Check-out"} inspection</h1>
      </div>

      <Stepper currentStep={currentStep} />

      {currentStep === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload photos</CardTitle>
            <CardDescription>
              Drop all inspection photos. We&apos;ll group them by room automatically in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BulkPhotoUploader
              folderPath={photosPath}
              existingPhotoCount={phase?.photoCount ?? 0}
              onComplete={async () => {
                await refetchState();
                setStep("categorise");
              }}
            />
          </CardContent>
        </Card>
      )}

      {currentStep === "categorise" && (
        <Card>
          <CardHeader>
            <CardTitle>Run AI categorisation</CardTitle>
            <CardDescription>
              Gemini 2.5 Flash will group {phase?.photoCount ?? 0} photos by room and rate each item.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={runCategorise} disabled={working === "categorise"}>
              {working === "categorise" ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Categorising… this can take 30–60s
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-4 w-4" />
                  Run categorisation
                </>
              )}
            </Button>
            {phase?.dataJsonExists && (
              <Button variant="outline" onClick={loadSavedJson} disabled={working !== null}>
                Load saved categorisation
              </Button>
            )}
            <Button variant="ghost" onClick={() => setStep("upload")} disabled={working !== null}>
              Add more photos
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === "review" && draft && (
        <Card>
          <CardHeader>
            <CardTitle>Review & edit</CardTitle>
            <CardDescription>
              Adjust ratings or notes as needed. Click <strong>Finalise</strong> to save the report and PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewEditor data={draft} onChange={setDraft} photoUrls={photoUrls} />
            <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep("categorise")}
                disabled={working !== null}
              >
                Re-run categorisation
              </Button>
              <Button onClick={finalise} disabled={working !== null}>
                {working === "finalise" ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Finalising…
                  </>
                ) : (
                  <>
                    <FileDown className="mr-1 h-4 w-4" />
                    Finalise {otherPhase}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "done" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-600" />
              {kind === "checkin" ? "Check-in finalised" : "Check-out finalised"}
            </CardTitle>
            <CardDescription>The PDF and JSON are saved to OneDrive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild>
              <Link
                href={
                  kind === "checkin"
                    ? `/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}/check-out`
                    : `/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}/compare`
                }
              >
                {kind === "checkin" ? "Start check-out" : "Run comparison"}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => router.push(`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(tenancySlug)}`)}>
              Back to tenancy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: Step }) {
  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "upload", label: "Upload", icon: <Camera className="h-4 w-4" /> },
    { key: "categorise", label: "Categorise", icon: <Sparkles className="h-4 w-4" /> },
    { key: "review", label: "Review", icon: <FileCheck2 className="h-4 w-4" /> },
    { key: "done", label: "Done", icon: <FileDown className="h-4 w-4" /> },
  ];
  const currentIdx = steps.findIndex((s) => s.key === currentStep);
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${
              i <= currentIdx ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground"
            }`}
          >
            {s.icon}
          </div>
          <span
            className={`text-sm font-medium ${i <= currentIdx ? "text-foreground" : "text-muted-foreground"}`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div className={`h-px flex-1 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
