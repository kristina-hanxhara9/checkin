"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authedFetch, useGraphToken } from "@/lib/hooks/useGraphToken";

interface Props {
  folderPath: string;
  label?: string;
  confirmMessage: string;
  onDeleted: () => void;
}

export function DeleteButton({ folderPath, label = "Delete", confirmMessage, onDeleted }: Props) {
  const { getToken } = useGraphToken();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    try {
      const res = await authedFetch(getToken, "/api/onedrive/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Delete failed (${res.status})`);
      }
      toast.success("Deleted");
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handle} disabled={loading} className="text-destructive">
      {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1 h-4 w-4" />}
      {label}
    </Button>
  );
}
