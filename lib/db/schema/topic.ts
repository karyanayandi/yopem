import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

import { LANGUAGE_TYPE } from "@/lib/validation/language"
import { STATUS_TYPE } from "@/lib/validation/status"
import { TOPIC_TYPE, TOPIC_VISIBILITY } from "@/lib/validation/topic"
import { articleTopics } from "./article"
import { medias } from "./media"

export const topicTranslations = sqliteTable("topic_translations", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const topics = sqliteTable("topics", {
  id: text("id").primaryKey(),
  language: text("language", { enum: LANGUAGE_TYPE }).notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  type: text("type", { enum: TOPIC_TYPE }).notNull().default("all"),
  status: text("status", { enum: STATUS_TYPE }).notNull().default("draft"),
  visibility: text("visibility", { enum: TOPIC_VISIBILITY })
    .notNull()
    .default("public"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  topicTranslationId: text("topic_translation_id")
    .notNull()
    .references(() => topicTranslations.id),
  featuredImageId: text("featured_image_id").references(() => medias.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const topicsRelations = relations(topics, ({ one, many }) => ({
  topicTranslation: one(topicTranslations, {
    fields: [topics.topicTranslationId],
    references: [topicTranslations.id],
  }),
  featuredImage: one(medias, {
    fields: [topics.featuredImageId],
    references: [medias.id],
  }),
  articles: many(articleTopics),
}))

export const topicTranslationsRelations = relations(
  topicTranslations,
  ({ many }) => ({
    topics: many(topics),
  }),
)

export type InsertTopic = typeof topics.$inferInsert
export type SelectTopic = typeof topics.$inferSelect

export type InsertTopicTranslation = typeof topicTranslations.$inferInsert
export type SelectTopicTranslation = typeof topicTranslations.$inferSelect
