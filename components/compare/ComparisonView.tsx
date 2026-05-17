"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { ComparisonReport, Verdict } from "@/types/domain";

const VERDICT_VARIANT: Record<Verdict, "outline" | "info" | "destructive" | "warning"> = {
  no_change: "outline",
  fair_wear: "info",
  tenant_liable: "destructive",
  pre_existing: "warning",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  no_change: "No change",
  fair_wear: "Fair wear",
  tenant_liable: "Tenant liable",
  pre_existing: "Pre-existing",
};

function gbp(n: number | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

export function ComparisonView({ data }: { data: ComparisonReport }) {
  const totalCost = data.rooms.reduce(
    (sum, room) => sum + room.items.reduce((s, i) => s + (i.estimatedCost ?? 0), 0),
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div>
              <div className="text-muted-foreground">Items flagged</div>
              <div className="text-2xl font-semibold">{data.summary.totalFlagged}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Tenant liable</div>
              <div className="text-2xl font-semibold">{data.summary.tenantLiableCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Recommended deduction</div>
              <div className="text-2xl font-semibold">{gbp(totalCost)}</div>
            </div>
          </div>
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            {data.summary.depositRecommendation}
          </div>
        </CardContent>
      </Card>

      {data.rooms.map((room, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="text-lg">{room.room}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {room.items.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-md border p-3",
                    item.verdict === "tenant_liable" && "border-destructive/40 bg-destructive/5"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">{item.itemName}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={VERDICT_VARIANT[item.verdict]}>{VERDICT_LABEL[item.verdict]}</Badge>
                      {item.estimatedCost != null && (
                        <span className="text-sm font-medium">{gbp(item.estimatedCost)}</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase text-muted-foreground">Check-in</div>
                      <div>{item.before}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-muted-foreground">Check-out</div>
                      <div>{item.after}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{item.reason}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
