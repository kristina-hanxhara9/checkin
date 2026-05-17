"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "./RoomCard";
import type { CheckinData, RoomReport } from "@/types/domain";
import type { PhotoUrls } from "@/lib/hooks/usePhotoUrls";

interface Props {
  data: CheckinData;
  onChange: (next: CheckinData) => void;
  photoUrls?: PhotoUrls;
}

const blankRoom = (): RoomReport => ({
  room: "New room",
  confidence: "high",
  items: [],
});

export function ReviewEditor({ data, onChange, photoUrls }: Props) {
  const totalItems = useMemo(
    () => data.rooms.reduce((sum, r) => sum + r.items.length, 0),
    [data.rooms]
  );
  const flagged = useMemo(
    () => data.rooms.reduce((sum, r) => sum + r.items.filter((i) => i.flagged).length, 0),
    [data.rooms]
  );

  const updateRoom = (idx: number, next: RoomReport) => {
    const rooms = data.rooms.slice();
    rooms[idx] = next;
    onChange({ ...data, rooms });
  };
  const removeRoom = (idx: number) => {
    onChange({ ...data, rooms: data.rooms.filter((_, i) => i !== idx) });
  };
  const addRoom = () => {
    onChange({ ...data, rooms: [...data.rooms, blankRoom()] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-md border bg-muted/30 p-3 text-sm">
        <div>
          <span className="font-medium">{data.rooms.length}</span> rooms
        </div>
        <div>
          <span className="font-medium">{totalItems}</span> items
        </div>
        <div>
          <span className="font-medium">{flagged}</span> flagged
        </div>
      </div>

      {data.rooms.map((room, idx) => (
        <RoomCard
          key={idx}
          room={room}
          onChange={(next) => updateRoom(idx, next)}
          onRemove={() => removeRoom(idx)}
          photoUrls={photoUrls}
        />
      ))}

      <Button variant="outline" onClick={addRoom} className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        Add room
      </Button>
    </div>
  );
}
