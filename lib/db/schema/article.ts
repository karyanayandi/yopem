import { relations, sql } from "drizzle-orm"
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { ARTICLE_VISIBILITY } from "@/lib/validation/article"
import { LANGUAGE_TYPE } from "@/lib/validation/language"
import { STATUS_TYPE } from "@/lib/validation/status"
import { articleComments } from "./article-comment"
import { medias } from "./media"
import { topics } from "./topic"
import { users } from "./user"

export const articleTranslations = sqliteTable("article_translations", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  language: text("language", { enum: LANGUAGE_TYPE }).notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status", { enum: STATUS_TYPE }).notNull().default("draft"),
  visibility: text("visibility", { enum: ARTICLE_VISIBILITY })
    .notNull()
    .default("public"),
  articleTranslationId: text("article_translation_id")
    .notNull()
    .references(() => articleTranslations.id),
  featuredImageId: text("featured_image_id")
    .notNull()
    .references(() => medias.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const articlesRelations = relations(articles, ({ one, many }) => ({
  articleTranslation: one(articleTranslations, {
    fields: [articles.articleTranslationId],
    references: [articleTranslations.id],
  }),
  featuredImage: one(medias, {
    fields: [articles.featuredImageId],
    references: [medias.id],
  }),
  topics: many(articleTopics),
  authors: many(articleAuthors),
  editors: many(articleEditors),
  comments: many(articleComments),
}))

export const articleTranslationsRelations = relations(
  articleTranslations,
  ({ many }) => ({
    articles: many(articles),
  }),
)

export const articleAuthors = sqliteTable(
  "_article_authors",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articles.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.articleId, t.userId],
    }),
  }),
)

export const articleAuthorsRelations = relations(articleAuthors, ({ one }) => ({
  article: one(articles, {
    fields: [articleAuthors.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [articleAuthors.userId],
    references: [users.id],
  }),
}))

export const articleEditors = sqliteTable(
  "_article_editors",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articles.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.articleId, t.userId],
    }),
  }),
)

export const articleEditorsRelations = relations(articleEditors, ({ one }) => ({
  article: one(articles, {
    fields: [articleEditors.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [articleEditors.userId],
    references: [users.id],
  }),
}))

export const articleTopics = sqliteTable(
  "_article_topics",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articles.id),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.articleId, t.topicId],
    }),
  }),
)

export const articleTopicsRelations = relations(articleTopics, ({ one }) => ({
  article: one(articles, {
    fields: [articleTopics.articleId],
    references: [articles.id],
  }),
  topic: one(topics, {
    fields: [articleTopics.topicId],
    references: [topics.id],
  }),
}))

export type InsertArticle = typeof articles.$inferInsert
export type SelectArticle = typeof articles.$inferSelect

export type InsertArticleTranslation = typeof articleTranslations.$inferInsert
export type SelectArticleTranslation = typeof articleTranslations.$inferSelect
