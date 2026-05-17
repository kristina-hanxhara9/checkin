import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">This page doesn&apos;t exist.</p>
      <Button asChild className="mt-6">
        <Link href="/properties">Back to properties</Link>
      </Button>
    </main>
  );
}
