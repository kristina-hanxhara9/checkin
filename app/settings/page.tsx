"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageHeader } from "@/components/PageHeader";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";
import { useBranding, useLogoUrl } from "@/lib/hooks/useBranding";
import type { Branding } from "@/types/branding";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <PageHeader />
      <main className="container max-w-2xl py-8">
        <SettingsContent />
      </main>
    </AuthGuard>
  );
}

function SettingsContent() {
  const { getToken } = useGraphToken();
  const queryClient = useQueryClient();
  const { data, isLoading } = useBranding();
  const [form, setForm] = useState<Branding | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  const { data: logoUrl } = useLogoUrl(form?.logoFilename);

  if (isLoading || !form) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const update = <K extends keyof Branding>(key: K, value: Branding[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await authedFetch(getToken, "/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Save failed (${res.status})`);
      }
      const saved = (await res.json()) as Branding;
      setForm(saved);
      queryClient.invalidateQueries({ queryKey: ["branding"] });
      toast.success("Branding saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const res = await authedFetch(getToken, "/api/branding/logo", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: await file.arrayBuffer(),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Upload failed (${res.status})`);
      }
      const { logoFilename } = (await res.json()) as { logoFilename: string };
      const next = { ...form, logoFilename };
      setForm(next);
      // immediately persist so subsequent header/PDF reads can find it
      await authedFetch(getToken, "/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      queryClient.invalidateQueries({ queryKey: ["branding"] });
      queryClient.invalidateQueries({ queryKey: ["logoUrl"] });
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = async () => {
    if (!confirm("Remove the current logo?")) return;
    const next = { ...form, logoFilename: undefined };
    setForm(next);
    await authedFetch(getToken, "/api/branding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    queryClient.invalidateQueries({ queryKey: ["branding"] });
    toast.success("Logo removed");
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/properties">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Properties
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Branding & business details</h1>
        <p className="mt-1 text-muted-foreground">
          Your business name and logo appear in the app header and on every PDF report.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>PNG, JPG, SVG, or WebP. Max 2MB. Shown small in the header and at the top of PDFs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border bg-muted/40">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="max-h-16 max-w-16 object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">No logo</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadLogo(file);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-4 w-4" /> {form.logoFilename ? "Replace logo" : "Upload logo"}
                  </>
                )}
              </Button>
              {form.logoFilename && (
                <Button variant="ghost" onClick={removeLogo} className="text-destructive">
                  <Trash2 className="mr-1 h-4 w-4" /> Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
          <CardDescription>
            Used in PDF report headers and footers. Only Business name is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business name *</Label>
              <Input
                id="businessName"
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="Smith Property Management"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail ?? ""}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  placeholder="hello@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={form.contactPhone ?? ""}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  placeholder="+44 …"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address ?? ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder="123 High Street, London, SW1A 1AA"
                rows={2}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
