"use client";

import { Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Item, Rating } from "@/types/domain";
import type { PhotoUrls } from "@/lib/hooks/usePhotoUrls";

interface Props {
  item: Item;
  onChange: (next: Item) => void;
  onRemove: () => void;
  photoUrls?: PhotoUrls;
}

export function ItemRow({ item, onChange, onRemove, photoUrls }: Props) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex flex-col gap-2 md:grid md:grid-cols-12">
        <Input
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          placeholder="Item name"
          className="md:col-span-3"
        />
        <div className="flex gap-2 md:col-span-3">
          <div className="flex-1 md:col-span-2">
            <Select value={item.rating} onValueChange={(v) => onChange({ ...item, rating: v as Rating })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange({ ...item, flagged: !item.flagged })}
              title={item.flagged ? "Unflag" : "Flag"}
            >
              <Flag className={cn("h-4 w-4", item.flagged ? "fill-amber-400 text-amber-600" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive">
              ×
            </Button>
          </div>
        </div>
        <Textarea
          value={item.notes}
          onChange={(e) => onChange({ ...item, notes: e.target.value })}
          placeholder="Notes…"
          className="md:col-span-5 min-h-[40px]"
          rows={1}
        />
        <div className="hidden items-center justify-end gap-1 md:col-span-1 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange({ ...item, flagged: !item.flagged })}
            title={item.flagged ? "Unflag" : "Flag"}
          >
            <Flag className={cn("h-4 w-4", item.flagged ? "fill-amber-400 text-amber-600" : "text-muted-foreground")} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive">
            ×
          </Button>
        </div>
      </div>
      {item.photoRefs.length > 0 && photoUrls && (
        <div className="mt-2 flex gap-1 overflow-x-auto">
          {item.photoRefs.map((ref) => {
            const url = photoUrls.byFilename[ref]?.thumb ?? photoUrls.byFilename[ref]?.full;
            if (!url) return null;
            return (
              <a
                key={ref}
                href={photoUrls.byFilename[ref]?.full ?? url}
                target="_blank"
                rel="noopener noreferrer"
                title={ref}
                className="shrink-0"
              >
                <img
                  src={url}
                  alt={ref}
                  className="h-14 w-14 rounded border object-cover transition-opacity hover:opacity-80"
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
