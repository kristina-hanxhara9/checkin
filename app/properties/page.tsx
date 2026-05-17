"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Home as HomeIcon, ArrowRight, Settings as SettingsIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/DeleteButton";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { useBranding } from "@/lib/hooks/useBranding";
import { ROOT_FOLDER } from "@/lib/constants";
import { buildPropertyPath } from "@/lib/onedrive/paths";
import type { DriveItem } from "@/lib/onedrive/folders";

export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const { getToken } = useGraphToken();
  const { data: branding } = useBranding();
  const [dismissedBrandingNudge, setDismissedBrandingNudge] = useState(false);
  const needsBranding =
    branding && (!branding.businessName || branding.businessName === "PropertyCheck") && !branding.logoFilename;
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const ensureRes = await authedFetch(getToken, "/api/onedrive/ensure-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath: ROOT_FOLDER }),
      });
      if (!ensureRes.ok) {
        const body = (await ensureRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Failed to access OneDrive (${ensureRes.status})`);
      }
      const res = await authedFetch(
        getToken,
        `/api/onedrive/list?path=${encodeURIComponent(ROOT_FOLDER)}`
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Failed to list properties (${res.status})`);
      }
      const json = (await res.json()) as { items: DriveItem[] };
      return json.items.filter((i) => i.folder);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="mt-1 text-muted-foreground">Each property contains its tenancies and inspections.</p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-1 h-4 w-4" />
            New property
          </Link>
        </Button>
      </div>

      {needsBranding && !dismissedBrandingNudge && (
        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm">
          <SettingsIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div className="flex-1">
            <div className="font-medium text-amber-900">Add your business branding</div>
            <p className="mt-0.5 text-amber-800">
              Set your business name and logo so they appear in the app header and on every PDF
              report you produce.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-900 hover:bg-amber-100">
              <Link href="/settings">Set up branding</Link>
            </Button>
          </div>
          <button
            onClick={() => setDismissedBrandingNudge(true)}
            aria-label="Dismiss"
            className="text-amber-700 hover:text-amber-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      )}

      {data && data.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <HomeIcon className="mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No properties yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create your first property to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/properties/new">
                <Plus className="mr-1 h-4 w-4" />
                New property
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <Card key={p.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <Link
                    href={`/properties/${encodeURIComponent(p.name)}`}
                    className="flex flex-1 items-center justify-between"
                  >
                    <span className="truncate">{p.name.replace(/-/g, " ")}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(p.createdDateTime).toLocaleDateString("en-GB")}
                </span>
                <DeleteButton
                  folderPath={buildPropertyPath(p.name)}
                  label="Delete"
                  confirmMessage={`Delete property "${p.name.replace(/-/g, " ")}" and ALL its tenancies? This cannot be undone.`}
                  onDeleted={() => queryClient.invalidateQueries({ queryKey: ["properties"] })}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
