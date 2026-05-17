import { NextRequest } from "next/server";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export class StatusError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function extractBearerToken(req: NextRequest): string {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header) throw new AuthError("Missing Authorization header");
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new AuthError("Invalid Authorization header");
  }
  return token;
}

interface GraphErrorLike {
  statusCode?: number;
  code?: string;
  message?: string;
  body?: string;
}

function translateGraphError(err: unknown): { status: number; message: string } | null {
  if (typeof err !== "object" || err === null) return null;
  const e = err as GraphErrorLike;
  const text = `${e.message ?? ""} ${e.body ?? ""}`;
  if (text.includes("SPO license") || text.includes("SharePoint")) {
    return {
      status: 400,
      message:
        "This Microsoft account doesn't have OneDrive enabled. " +
        "Sign in with a personal account (outlook.com / hotmail.com / live.com) " +
        "or a work/school account that has a Microsoft 365 license including OneDrive.",
    };
  }
  if (e.statusCode === 401 || text.includes("InvalidAuthenticationToken")) {
    return { status: 401, message: "Sign-in expired. Please sign in again." };
  }
  if (e.statusCode === 403) {
    return {
      status: 403,
      message: "Permission denied. The account may need to grant access to its files.",
    };
  }
  if (e.statusCode === 404 || e.code === "itemNotFound") {
    return { status: 404, message: "Not found in OneDrive." };
  }
  if (e.statusCode === 429 || text.includes("throttle")) {
    return { status: 429, message: "Microsoft is throttling requests. Please wait a moment and try again." };
  }
  return null;
}

export function errorResponse(err: unknown) {
  if (err instanceof AuthError || err instanceof StatusError) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.status,
      headers: { "content-type": "application/json" },
    });
  }
  if (err && typeof err === "object" && "status" in err && typeof (err as { status: unknown }).status === "number") {
    const e = err as { status: number; message?: string };
    return new Response(JSON.stringify({ error: e.message ?? "Error" }), {
      status: e.status,
      headers: { "content-type": "application/json" },
    });
  }
  const translated = translateGraphError(err);
  if (translated) {
    console.error("[api]", err);
    return new Response(JSON.stringify({ error: translated.message }), {
      status: translated.status,
      headers: { "content-type": "application/json" },
    });
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error("[api]", err);
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { "content-type": "application/json" },
  });
}
