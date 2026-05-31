"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import { useBootstrap } from "@/features/app/hooks/use-bootstrap";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppBootstrapper />
      {children}
    </QueryClientProvider>
  );
}

function AppBootstrapper() {
  const [hasToken] = useState(() => Boolean(getStoredAccessToken()));

  useBootstrap({ enabled: hasToken });

  return null;
}
