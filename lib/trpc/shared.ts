import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import superjson from "superjson"

import { type AppRouter } from "@/lib/api/root"

export const transformer = superjson

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.SITE_URL) return `${process.env.SITE_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc"
}

export type RouterInputs = inferRouterInputs<AppRouter>

export type RouterOutputs = inferRouterOutputs<AppRouter>
