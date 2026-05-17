"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import { useChunkedUpload, type FileProgress } from "@/lib/hooks/useChunkedUpload";
import { useGraphToken } from "@/lib/hooks/useGraphToken";
import { MAX_PHOTO_BYTES, MAX_PHOTOS_PER_PHASE } from "@/lib/constants";

interface Props {
  folderPath: string;
  existingPhotoCount?: number;
  onComplete?: () => void;
}

function filterAndWarn(
  incoming: File[],
  existingCount: number
): { kept: File[]; skipped: number } {
  const tooLarge: string[] = [];
  const fitting: File[] = [];
  for (const f of incoming) {
    if (f.size > MAX_PHOTO_BYTES) tooLarge.push(f.name);
    else fitting.push(f);
  }
  const remaining = Math.max(0, MAX_PHOTOS_PER_PHASE - existingCount);
  const kept = fitting.slice(0, remaining);
  const overCap = fitting.length - kept.length;
  if (tooLarge.length) {
    toast.error(
      `Skipped ${tooLarge.length} oversized photo${tooLarge.length === 1 ? "" : "s"} (max ${MAX_PHOTO_BYTES / 1024 / 1024}MB each).`
    );
  }
  if (overCap > 0) {
    toast.warning(
      `Only ${remaining} more photos allowed in this inspection (cap is ${MAX_PHOTOS_PER_PHASE}). Skipped ${overCap}.`
    );
  }
  return { kept, skipped: tooLarge.length + overCap };
}

export function BulkPhotoUploader({ folderPath, existingPhotoCount = 0, onComplete }: Props) {
  const { getToken } = useGraphToken();
  const { upload, uploading } = useChunkedUpload();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<FileProgress[]>([]);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setFiles((prev) => {
        const { kept } = filterAndWarn(accepted, existingPhotoCount + prev.length);
        return [...prev, ...kept];
      });
    },
    [existingPhotoCount]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: uploading,
  });

  const removeAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const start = async () => {
    if (!files.length) return;
    const final = await upload({
      getToken,
      folderPath,
      files,
      onProgress: setProgress,
    });
    if (final.every((p) => p.status === "done")) onComplete?.();
  };

  const allDone = progress.length > 0 && progress.every((p) => p.status === "done");

  const totalCount = existingPhotoCount + files.length;
  const remaining = Math.max(0, MAX_PHOTOS_PER_PHASE - totalCount);

  const handleCameraFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => {
      const { kept } = filterAndWarn(Array.from(incoming), existingPhotoCount + prev.length);
      return [...prev, ...kept];
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-12",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          uploading && "cursor-not-allowed opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragActive ? "Drop photos here…" : "Drop photos here, or click to select"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG / PNG / HEIC · max {MAX_PHOTO_BYTES / 1024 / 1024}MB each · {remaining} of {MAX_PHOTOS_PER_PHASE} slots remaining
        </p>
      </div>

      <div className="flex justify-center sm:hidden">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(e) => {
            handleCameraFiles(e.target.files);
            if (cameraInputRef.current) cameraInputRef.current.value = "";
          }}
        />
        <Button
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading || remaining === 0}
          className="w-full"
        >
          <Camera className="mr-2 h-4 w-4" />
          Take photo with camera
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{files.length} photo{files.length === 1 ? "" : "s"} ready</p>
            {!uploading && !allDone && (
              <Button onClick={start} size="sm">
                Upload to OneDrive
              </Button>
            )}
            {allDone && (
              <Button onClick={() => onComplete?.()} size="sm">
                Continue
              </Button>
            )}
          </div>

          <div className="max-h-96 space-y-1 overflow-auto rounded-md border p-2">
            {files.map((file, idx) => {
              const fp = progress[idx];
              return (
                <FileRow
                  key={`${file.name}-${idx}`}
                  file={file}
                  progress={fp}
                  onRemove={!uploading ? () => removeAt(idx) : undefined}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FileRow({
  file,
  progress,
  onRemove,
}: {
  file: File;
  progress?: FileProgress;
  onRemove?: () => void;
}) {
  const sizeMb = (file.size / 1024 / 1024).toFixed(1);
  return (
    <div className="flex items-center gap-3 rounded-sm px-2 py-1.5 text-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{file.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{sizeMb} MB</span>
        </div>
        {progress && progress.status !== "pending" && (
          <div className="mt-1 flex items-center gap-2">
            <Progress value={progress.progress * 100} className="h-1 flex-1" />
            <StatusIcon status={progress.status} />
          </div>
        )}
        {progress?.error && (
          <p className="mt-1 text-xs text-destructive">{progress.error}</p>
        )}
      </div>
      {onRemove && (
        <button onClick={onRemove} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: FileProgress["status"] }) {
  if (status === "done") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === "error") return <AlertCircle className="h-4 w-4 text-destructive" />;
  if (status === "uploading") return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  return null;
}
