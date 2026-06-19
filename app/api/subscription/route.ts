import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { loadSubscription, saveSubscription } from "@/lib/subscription/load";
import type { Subscription } from "@/types/subscription";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const email = req.headers.get("x-user-email");
    const client = createGraphClient(token);
    const sub = await loadSubscription(client, email);
    return NextResponse.json({ subscription: sub });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const body = (await req.json()) as Partial<Subscription>;
    if (!body.plan || !body.status) {
      return NextResponse.json(
        { error: "plan and status are required" },
        { status: 400 }
      );
    }
    const now = new Date().toISOString();
    const subscription: Subscription = {
      plan: body.plan,
      status: body.status,
      startedAt: body.startedAt ?? now,
      expiresAt: body.expiresAt,
      stripeCustomerId: body.stripeCustomerId,
      stripeSubscriptionId: body.stripeSubscriptionId,
      note: body.note,
    };
    const client = createGraphClient(token);
    await saveSubscription(client, subscription);
    return NextResponse.json({ subscription });
  } catch (err) {
    return errorResponse(err);
  }
}
