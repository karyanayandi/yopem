import { D1Database, R2Bucket } from "@cloudflare/workers-types"

interface CloudflareEnv {
  DB: D1Database
  STORAGE: R2Bucket
}
