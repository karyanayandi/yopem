import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import env from "@/env.mjs"
import * as schema from "./schema"

export const sqlite = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
})

export const initializeDB = drizzle(sqlite)
export const db = drizzle(sqlite, { schema })
