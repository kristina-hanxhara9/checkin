import { FILE, ROOT_FOLDER } from "@/lib/constants";

export function buildSubscriptionPath(): string {
  return `${ROOT_FOLDER}/${FILE.subscription}`;
}
