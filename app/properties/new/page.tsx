"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { buildPropertyPath } from "@/lib/onedrive/paths";
import { slugify } from "@/lib/utils/slug";

export default function NewPropertyPage() {
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
        body: JSON.stringify({ folderPath: buildPropertyPath(slug) }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      toast.success("Property created");
      router.push(`/properties/${encodeURIComponent(slug)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create property");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/properties">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property name or address</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="12a Thornton Road"
                autoFocus
                required
              />
              {slug && (
                <p className="text-xs text-muted-foreground">
                  Folder: <code className="rounded bg-muted px-1 py-0.5">Properties/{slug}</code>
                </p>
              )}
            </div>
            <Button type="submit" disabled={!slug || submitting}>
              {submitting ? "Creating…" : "Create property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
