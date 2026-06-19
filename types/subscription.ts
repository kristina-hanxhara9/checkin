export type SubscriptionPlan = "hosted" | "self-hosted" | "admin" | "trial";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "cancelled";

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  note?: string;
}

export function isActiveSubscription(sub: Subscription | null | undefined): sub is Subscription {
  if (!sub) return false;
  if (sub.status !== "active" && sub.status !== "trialing") return false;
  if (sub.expiresAt && new Date(sub.expiresAt).getTime() < Date.now()) return false;
  return true;
}
