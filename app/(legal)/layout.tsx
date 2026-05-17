import Link from "next/link";
import { Home } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            PropertyCheck
          </Link>
        </div>
      </header>
      <main className="container max-w-3xl py-10 text-sm leading-relaxed">{children}</main>
    </div>
  );
}
