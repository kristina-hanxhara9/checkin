import { Client } from "@microsoft/microsoft-graph-client";
import { graphContentRef, graphCreateUploadSessionRef, graphItemPathRef } from "./paths";

export interface UploadSession {
  uploadUrl: string;
  expirationDateTime: string;
}

export async function uploadSmallFile(
  client: Client,
  filePath: string,
  body: ArrayBuffer | Buffer,
  contentType = "application/octet-stream"
): Promise<{ id: string; downloadUrl?: string }> {
  const res = await client
    .api(graphContentRef(filePath))
    .header("Content-Type", contentType)
    .put(body);
  return {
    id: res.id,
    downloadUrl: res["@microsoft.graph.downloadUrl"],
  };
}

export async function createUploadSession(
  client: Client,
  filePath: string,
  conflictBehavior: "rename" | "replace" | "fail" = "replace"
): Promise<UploadSession> {
  const res = await client.api(graphCreateUploadSessionRef(filePath)).post({
    item: {
      "@microsoft.graph.conflictBehavior": conflictBehavior,
    },
  });
  return {
    uploadUrl: res.uploadUrl,
    expirationDateTime: res.expirationDateTime,
  };
}

export async function downloadJson<T>(client: Client, filePath: string): Promise<T> {
  const item = await client.api(graphItemPathRef(filePath)).get();
  const downloadUrl = item["@microsoft.graph.downloadUrl"];
  if (!downloadUrl) throw new Error(`No downloadUrl for ${filePath}`);
  const res = await fetch(downloadUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${filePath}: ${res.status}`);
  return (await res.json()) as T;
}

export async function saveJson(client: Client, filePath: string, data: unknown): Promise<void> {
  const body = Buffer.from(JSON.stringify(data, null, 2));
  await client
    .api(graphContentRef(filePath))
    .header("Content-Type", "application/json")
    .put(body);
}

export async function savePdf(client: Client, filePath: string, pdf: Buffer): Promise<void> {
  if (pdf.byteLength <= 4 * 1024 * 1024) {
    await uploadSmallFile(client, filePath, pdf, "application/pdf");
    return;
  }
  const session = await createUploadSession(client, filePath);
  const chunkSize = 5 * 1024 * 1024;
  let offset = 0;
  while (offset < pdf.byteLength) {
    const end = Math.min(offset + chunkSize, pdf.byteLength);
    const chunk = pdf.subarray(offset, end);
    const body = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
    const res = await fetch(session.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Length": String(body.byteLength),
        "Content-Range": `bytes ${offset}-${end - 1}/${pdf.byteLength}`,
      },
      body: body as ArrayBuffer,
    });
    if (!res.ok && res.status !== 202) {
      throw new Error(`Chunk upload failed: ${res.status} ${await res.text()}`);
    }
    offset = end;
  }
}
