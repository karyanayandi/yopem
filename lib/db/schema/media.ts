import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

import { articles } from "./article"
import { topics } from "./topic"
import { users } from "./user"

export const medias = sqliteTable("media", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const mediaRelations = relations(medias, ({ one, many }) => ({
  author: one(users, {
    fields: [medias.authorId],
    references: [users.id],
  }),
  articles: many(articles),
  topics: many(topics),
}))

export type InsertMedia = typeof medias.$inferInsert
export type SelectMedia = typeof medias.$inferSelect
