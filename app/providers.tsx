"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { MsalProviderWrapper } from "@/components/auth/MsalProviderWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <MsalProviderWrapper>{children}</MsalProviderWrapper>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
