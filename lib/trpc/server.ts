import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { createCaller } from "@/lib/api/root"
import { createTRPCContext } from "@/lib/api/trpc"

const createContext = cache(() => {
  const heads = new Headers(headers())
  heads.set("x-trpc-source", "rsc")

  return createTRPCContext({
    headers: heads,
  })
})

export const api = createCaller(createContext)
