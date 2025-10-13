"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

// Disable devtools for now to avoid QueryClient issues
// const ReactQueryDevtools = process.env.NODE_ENV === "development"
//   ? React.lazy(() =>
//       import("@tanstack/react-query-devtools").then((d) => ({
//         default: d.ReactQueryDevtools,
//       }))
//     )
//   : null;

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry on 401/403 errors
              if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
              ) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - disabled for now to avoid QueryClient issues */}
      {/* {process.env.NODE_ENV === "development" && ReactQueryDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      )} */}
    </QueryClientProvider>
  );
}
