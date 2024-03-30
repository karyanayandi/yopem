import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { AD_POSITION, AD_TYPE } from "@/lib/validation/ad"

export const ads = sqliteTable("ads", {
  id: text("id").primaryKey(),
  title: text("title").unique().notNull(),
  content: text("content").notNull(),
  type: text("type", { enum: AD_TYPE }).notNull().default("plain_ad"),
  position: text("position", { enum: AD_POSITION })
    .notNull()
    .default("home_below_header"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export type InsertAd = typeof ads.$inferInsert
export type SelectAd = typeof ads.$inferSelect
