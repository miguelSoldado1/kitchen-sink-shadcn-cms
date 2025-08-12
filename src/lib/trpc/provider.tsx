"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "./client";
import type { QueryClientConfig } from "@tanstack/react-query";

const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0,
    },
  },
};

const trpcCreateClientOptions = {
  links: [
    httpBatchLink({
      url: typeof window !== "undefined" ? `${window.location.origin}/api/trpc` : "http://localhost:3000/api/trpc",
      transformer: superjson,
    }),
  ],
};

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));
  const [trpcClient] = useState(() => trpc.createClient(trpcCreateClientOptions));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
