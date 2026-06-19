import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowUnsubscribed>{children}</AuthGuard>;
}
