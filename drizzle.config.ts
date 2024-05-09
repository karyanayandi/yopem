import type { Config } from "drizzle-kit"

import env from "@/env.mjs"

export default {
  schema: "./lib/db/schema",
  out: "./lib/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config
