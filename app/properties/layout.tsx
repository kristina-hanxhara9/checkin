import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageHeader } from "@/components/PageHeader";

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PageHeader />
      <main className="container py-8">{children}</main>
      <footer className="container mt-12 border-t py-6 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/help" className="hover:underline">Help</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <span>·</span>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </div>
      </footer>
    </AuthGuard>
  );
}
