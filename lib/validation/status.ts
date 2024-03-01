import { z } from "zod"

export const STATUS_TYPE = [
  "published",
  "draft",
  "rejected",
  "in_review",
] as const

export const statusType = z.enum(STATUS_TYPE)
export type StatusType = z.infer<typeof statusType>
