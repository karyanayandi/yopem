"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"

import { type AppRouter } from "@/lib/api/root"
import { getUrl, transformer } from "./shared"

export const api = createTRPCReact<AppRouter>()

const TRPCReactProvider = (props: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient())

  const [trpcClient] = React.useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.APP === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}

export default TRPCReactProvider
