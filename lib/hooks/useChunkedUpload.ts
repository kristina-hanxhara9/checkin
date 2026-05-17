"use client";

import { useCallback, useState } from "react";
import { CHUNK_SIZE, MAX_SMALL_UPLOAD } from "@/lib/constants";
import { authedFetch, type GetTokenFn } from "./useGraphToken";

export type FileStatus = "pending" | "uploading" | "done" | "error";

export interface FileProgress {
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
}

export interface UploadOptions {
  getToken: GetTokenFn;
  folderPath: string;
  files: File[];
  onProgress?: (progress: FileProgress[]) => void;
}

const MAX_CHUNK_RETRIES = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function uploadSmall(getToken: GetTokenFn, folderPath: string, file: File, onChunkDone: () => void) {
  const arrayBuf = await file.arrayBuffer();
  let attempt = 0;
  for (;;) {
    const res = await authedFetch(getToken, "/api/onedrive/upload-small", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-File-Path": `${folderPath}/${file.name}`,
        "X-Mime-Type": file.type || "image/jpeg",
      },
      body: arrayBuf,
    });
    if (res.ok) {
      onChunkDone();
      return;
    }
    if (attempt < 2 && res.status >= 500) {
      attempt++;
      await sleep(500 * 2 ** attempt);
      continue;
    }
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
}

async function createSession(
  getToken: GetTokenFn,
  filePath: string
): Promise<{ uploadUrl: string }> {
  const sessionRes = await authedFetch(getToken, "/api/onedrive/upload-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath }),
  });
  if (!sessionRes.ok) {
    throw new Error(`Could not create upload session (${sessionRes.status})`);
  }
  return (await sessionRes.json()) as { uploadUrl: string };
}

async function putChunk(uploadUrl: string, arrayBuf: ArrayBuffer, offset: number, total: number) {
  return fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Length": String(arrayBuf.byteLength),
      "Content-Range": `bytes ${offset}-${offset + arrayBuf.byteLength - 1}/${total}`,
    },
    body: arrayBuf,
  });
}

async function uploadLarge(
  getToken: GetTokenFn,
  folderPath: string,
  file: File,
  onProgress: (uploaded: number) => void
) {
  const filePath = `${folderPath}/${file.name}`;
  let { uploadUrl } = await createSession(getToken, filePath);

  let offset = 0;
  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const arrayBuf = await file.slice(offset, end).arrayBuffer();

    let attempt = 0;
    for (;;) {
      let res: Response;
      try {
        res = await putChunk(uploadUrl, arrayBuf, offset, file.size);
      } catch (networkErr) {
        if (attempt < MAX_CHUNK_RETRIES) {
          attempt++;
          await sleep(500 * 2 ** attempt);
          continue;
        }
        throw networkErr;
      }

      if (res.ok || res.status === 202) break;

      // Session expired (404/410) → make a new one and retry the same chunk.
      if (res.status === 404 || res.status === 410) {
        if (attempt < MAX_CHUNK_RETRIES) {
          attempt++;
          const fresh = await createSession(getToken, filePath);
          uploadUrl = fresh.uploadUrl;
          await sleep(300);
          continue;
        }
      }

      // Transient server errors → exponential backoff retry.
      if ((res.status >= 500 || res.status === 429) && attempt < MAX_CHUNK_RETRIES) {
        attempt++;
        await sleep(500 * 2 ** attempt);
        continue;
      }

      const body = await res.text().catch(() => "");
      throw new Error(`Chunk failed: ${res.status} ${body}`);
    }

    offset = end;
    onProgress(offset / file.size);
  }
}

export function useChunkedUpload() {
  const [progress, setProgress] = useState<FileProgress[]>([]);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async ({ getToken, folderPath, files, onProgress }: UploadOptions) => {
    setUploading(true);
    let working: FileProgress[] = files.map((f) => ({ file: f, status: "pending", progress: 0 }));
    setProgress(working);
    onProgress?.(working);

    await authedFetch(getToken, "/api/onedrive/ensure-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderPath }),
    });

    const updateOne = (idx: number, patch: Partial<FileProgress>) => {
      working = working.slice();
      working[idx] = { ...working[idx], ...patch };
      setProgress(working);
      onProgress?.(working);
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      updateOne(i, { status: "uploading", progress: 0 });
      try {
        if (file.size <= MAX_SMALL_UPLOAD) {
          await uploadSmall(getToken, folderPath, file, () => updateOne(i, { progress: 1 }));
        } else {
          await uploadLarge(getToken, folderPath, file, (p) => updateOne(i, { progress: p }));
        }
        updateOne(i, { status: "done", progress: 1 });
      } catch (err) {
        updateOne(i, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
      }
    }
    setUploading(false);
    return working;
  }, []);

  return { upload, progress, uploading };
}
