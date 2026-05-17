"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { buildTenancyPath } from "@/lib/onedrive/paths";
import { slugify } from "@/lib/utils/slug";

interface Props {
  params: Promise<{ property: string }>;
}

export default function NewTenancyPage({ params }: Props) {
  const { property } = use(params);
  const propertySlug = decodeURIComponent(property);
  const router = useRouter();
  const { getToken } = useGraphToken();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const slug = slugify(name);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    try {
      const res = await authedFetch(getToken, "/api/onedrive/ensure-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath: buildTenancyPath(propertySlug, slug) }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      toast.success("Tenancy created");
      router.push(`/properties/${encodeURIComponent(propertySlug)}/${encodeURIComponent(slug)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create tenancy");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/properties/${encodeURIComponent(propertySlug)}`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New tenancy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tenancy name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Smith Tenancy 2025-05"
                autoFocus
                required
              />
              {slug && (
                <p className="text-xs text-muted-foreground">
                  Folder: <code className="rounded bg-muted px-1 py-0.5">Properties/{propertySlug}/{slug}</code>
                </p>
              )}
            </div>
            <Button type="submit" disabled={!slug || submitting}>
              {submitting ? "Creating…" : "Create tenancy"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
