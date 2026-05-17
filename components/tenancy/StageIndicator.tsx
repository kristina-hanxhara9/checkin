import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS, STAGE_TONE, type TenancyStage } from "@/types/tenancy-stage";

const TONE_VARIANT: Record<"neutral" | "progress" | "ready" | "done", "secondary" | "info" | "warning" | "success"> = {
  neutral: "secondary",
  progress: "info",
  ready: "warning",
  done: "success",
};

export function StageIndicator({ stage }: { stage: TenancyStage }) {
  return <Badge variant={TONE_VARIANT[STAGE_TONE[stage]]}>{STAGE_LABELS[stage]}</Badge>;
}
