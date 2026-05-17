"use client";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ItemRow } from "./ItemRow";
import type { Confidence, Item, RoomReport } from "@/types/domain";
import type { PhotoUrls } from "@/lib/hooks/usePhotoUrls";

interface Props {
  room: RoomReport;
  onChange: (next: RoomReport) => void;
  onRemove: () => void;
  photoUrls?: PhotoUrls;
}

const blankItem = (): Item => ({
  name: "",
  rating: "Good",
  notes: "",
  flagged: false,
  photoRefs: [],
});

const CONFIDENCE_VARIANT: Record<Confidence, "success" | "warning" | "destructive"> = {
  high: "success",
  medium: "warning",
  low: "destructive",
};

export function RoomCard({ room, onChange, onRemove, photoUrls }: Props) {
  const updateItem = (idx: number, next: Item) => {
    const items = room.items.slice();
    items[idx] = next;
    onChange({ ...room, items });
  };
  const removeItem = (idx: number) => {
    onChange({ ...room, items: room.items.filter((_, i) => i !== idx) });
  };
  const addItem = () => {
    onChange({ ...room, items: [...room.items, blankItem()] });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <Input
            value={room.room}
            onChange={(e) => onChange({ ...room, room: e.target.value })}
            className="max-w-xs text-base font-semibold sm:text-lg"
            placeholder="Room name"
          />
          <Badge variant={CONFIDENCE_VARIANT[room.confidence]} className="capitalize">
            {room.confidence} confidence
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove} className="self-start text-destructive sm:self-auto">
          Remove room
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {room.items.map((item, idx) => (
          <ItemRow
            key={idx}
            item={item}
            onChange={(next) => updateItem(idx, next)}
            onRemove={() => removeItem(idx)}
            photoUrls={photoUrls}
          />
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          Add item
        </Button>
      </CardContent>
    </Card>
  );
}
