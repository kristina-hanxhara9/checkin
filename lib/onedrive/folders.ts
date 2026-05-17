import { Client } from "@microsoft/microsoft-graph-client";
import { graphChildrenRef, graphItemPathRef } from "./paths";

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ThumbnailSet {
  small?: Thumbnail;
  medium?: Thumbnail;
  large?: Thumbnail;
}

export interface DriveItem {
  id: string;
  name: string;
  folder?: { childCount: number };
  file?: { mimeType: string };
  size: number;
  lastModifiedDateTime: string;
  createdDateTime: string;
  "@microsoft.graph.downloadUrl"?: string;
  parentReference?: { path?: string };
  thumbnails?: ThumbnailSet[];
}

interface ChildrenResponse {
  value: DriveItem[];
  "@odata.nextLink"?: string;
}

export async function listChildren(
  client: Client,
  folderPath: string,
  opts: { withThumbnails?: boolean } = {}
): Promise<DriveItem[]> {
  const items: DriveItem[] = [];
  let request = client.api(graphChildrenRef(folderPath));
  if (opts.withThumbnails) request = request.expand("thumbnails");
  let response: ChildrenResponse = await request.get();
  items.push(...(response.value ?? []));
  while (response["@odata.nextLink"]) {
    response = await client.api(response["@odata.nextLink"]).get();
    items.push(...(response.value ?? []));
  }
  return items;
}

export async function tryListChildren(
  client: Client,
  folderPath: string,
  opts: { withThumbnails?: boolean } = {}
): Promise<DriveItem[]> {
  try {
    return await listChildren(client, folderPath, opts);
  } catch (err) {
    if (isNotFound(err)) return [];
    throw err;
  }
}

export async function getItem(client: Client, itemPath: string): Promise<DriveItem | null> {
  try {
    return await client.api(graphItemPathRef(itemPath)).get();
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

export async function ensureFolder(client: Client, folderPath: string): Promise<void> {
  const segments = folderPath.split("/").filter(Boolean);
  let current = "";
  for (const seg of segments) {
    const parent = current;
    current = current ? `${current}/${seg}` : seg;
    const existing = await getItem(client, current);
    if (existing?.folder) continue;
    const createUrl = parent ? graphChildrenRef(parent) : "/me/drive/root/children";
    await client.api(createUrl).post({
      name: seg,
      folder: {},
      "@microsoft.graph.conflictBehavior": "replace",
    });
  }
}

function isNotFound(err: unknown): boolean {
  if (typeof err === "object" && err !== null) {
    const e = err as { statusCode?: number; code?: string };
    if (e.statusCode === 404) return true;
    if (e.code === "itemNotFound") return true;
  }
  return false;
}
