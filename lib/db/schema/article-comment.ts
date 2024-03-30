import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

import { articles } from "./article"
import { users } from "./user"

export const articleComments = sqliteTable("article_comments", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  replyToId: text("reply_to_id"),
  articleId: text("article_id")
    .notNull()
    .references(() => articles.id),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const articleCommentsRelations = relations(
  articleComments,
  ({ one }) => ({
    replyTo: one(articleComments, {
      fields: [articleComments.replyToId],
      references: [articleComments.id],
    }),
    author: one(users, {
      fields: [articleComments.articleId],
      references: [users.id],
    }),
    article: one(articles, {
      fields: [articleComments.articleId],
      references: [articles.id],
    }),
  }),
)

export type InsertArticleComment = typeof articleComments.$inferInsert
export type SelectArticleComment = typeof articleComments.$inferSelect
