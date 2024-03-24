import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

import { users } from "./user"

export const userLinks = sqliteTable("user_links", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const userLinksRelations = relations(userLinks, ({ one }) => ({
  user: one(users, {
    fields: [userLinks.userId],
    references: [users.id],
  }),
}))
