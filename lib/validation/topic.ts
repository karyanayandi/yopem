import { z } from "zod"

import { LANGUAGE_TYPE } from "./language"
import { STATUS_TYPE } from "./status"

export const TOPIC_TYPE = [
  "all",
  "article",
  "review",
  "tutorial",
  "movie",
  "tv",
  "game",
] as const

export const TOPIC_VISIBILITY = ["public", "internal"] as const

export const topicType = z.enum(TOPIC_TYPE)

export const topicVisibility = z.enum(TOPIC_VISIBILITY)

const topicInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(2)
    .max(32),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  metaTitle: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  metaDescription: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
  type: z
    .enum(TOPIC_TYPE, {
      invalid_type_error:
        "only all, article, review ,tutorial, download, movie, tv, game are accepted",
    })
    .optional(),
  visibility: z
    .enum(TOPIC_VISIBILITY, {
      invalid_type_error: "only public and internal are accepted",
    })
    .optional(),
  status: z
    .enum(STATUS_TYPE, {
      invalid_type_error:
        "only published, draft, rejected and in_review are accepted",
    })
    .optional(),
  featuredImageId: z
    .string({
      invalid_type_error: "Featured Image ID must be a string",
    })
    .optional(),
  language: z.enum(LANGUAGE_TYPE, {
    invalid_type_error: "only id and en are accepted",
  }),
}

const translateTopicInput = {
  ...topicInput,
  topicTranslationId: z.string({
    required_error: "Topic Translation ID is required",
    invalid_type_error: "Topic Traslation Primary ID must be a string",
  }),
}

const updateTopicInput = {
  ...topicInput,
  id: z.string(),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
}

export const createTopicSchema = z.object({
  ...topicInput,
})

export const translateTopicSchema = z.object({
  ...translateTopicInput,
})

export const updateTopicSchema = z.object({
  ...updateTopicInput,
})

export type CreateTopicSchema = z.infer<typeof createTopicSchema>
export type UpdateTopicSchema = z.infer<typeof updateTopicSchema>
export type TopicType = z.infer<typeof topicType>
export type TopicVisibility = z.infer<typeof topicVisibility>
