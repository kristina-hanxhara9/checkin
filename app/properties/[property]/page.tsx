"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronLeft, ArrowRight, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/DeleteButton";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { buildPropertyPath, buildTenancyPath } from "@/lib/onedrive/paths";
import type { DriveItem } from "@/lib/onedrive/folders";

interface Props {
  params: Promise<{ property: string }>;
}

export default function PropertyPage({ params }: Props) {
  const { property } = use(params);
  const propertySlug = decodeURIComponent(property);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getToken } = useGraphToken();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tenancies", propertySlug],
    queryFn: async () => {
      const res = await authedFetch(
        getToken,
        `/api/onedrive/list?path=${encodeURIComponent(buildPropertyPath(propertySlug))}`
      );
      if (!res.ok) throw new Error(`Failed to list tenancies (${res.status})`);
      const json = (await res.json()) as { items: DriveItem[] };
      return json.items.filter((i) => i.folder);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/properties">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Properties
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{propertySlug.replace(/-/g, " ")}</h1>
            <p className="mt-1 text-muted-foreground">Tenancies and inspection reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <DeleteButton
              folderPath={buildPropertyPath(propertySlug)}
              label="Delete property"
              confirmMessage={`Permanently delete "${propertySlug.replace(/-/g, " ")}" and ALL its tenancies from OneDrive? This cannot be undone.`}
              onDeleted={() => {
                queryClient.invalidateQueries({ queryKey: ["properties"] });
                router.push("/properties");
              }}
            />
            <Button asChild>
              <Link href={`/properties/${encodeURIComponent(propertySlug)}/new`}>
                <Plus className="mr-1 h-4 w-4" />
                New tenancy
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
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
            <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No tenancies yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a tenancy to start the inspection.</p>
            <Button asChild className="mt-4">
              <Link href={`/properties/${encodeURIComponent(propertySlug)}/new`}>
                <Plus className="mr-1 h-4 w-4" />
                New tenancy
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {data.map((t) => (
            <Card key={t.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <Link
                    href={`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(t.name)}`}
                    className="flex flex-1 items-center justify-between"
                  >
                    <span className="truncate">{t.name.replace(/-/g, " ")}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(t.createdDateTime).toLocaleDateString("en-GB")}
                </span>
                <DeleteButton
                  folderPath={buildTenancyPath(propertySlug, t.name)}
                  label="Delete"
                  confirmMessage={`Delete tenancy "${t.name.replace(/-/g, " ")}" and all its photos/reports? This cannot be undone.`}
                  onDeleted={() =>
                    queryClient.invalidateQueries({ queryKey: ["tenancies", propertySlug] })
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
