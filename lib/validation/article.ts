import { z } from "zod"

import { LANGUAGE_TYPE } from "./language"
import { STATUS_TYPE } from "./status"

export const ARTICLE_VISIBILITY = ["public", "member"] as const

export const articleVisibility = z.enum(ARTICLE_VISIBILITY)

export const articleInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(3),
  language: z
    .enum(LANGUAGE_TYPE, {
      invalid_type_error: "only id and en are accepted",
    })
    .optional(),
  content: z
    .string({
      invalid_type_error: "Content must be a string",
    })
    .min(50),
  excerpt: z
    .string({
      invalid_type_error: "Content must be a string",
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
  status: z
    .enum(STATUS_TYPE, {
      invalid_type_error:
        "only published, draft, rejected and in_review are accepted",
    })
    .optional(),
  visibility: z
    .enum(ARTICLE_VISIBILITY, {
      invalid_type_error: "only public and member are accepted",
    })
    .optional(),
  featuredImageId: z.string({
    invalid_type_error: "Featured Image must be a string",
  }),
  topics: z
    .string({
      required_error: "Topic Id is required",
      invalid_type_error: "Topic Id must be a string",
    })
    .array(),
  authors: z
    .string({
      required_error: "Author Id is required",
      invalid_type_error: "Author Id must be a string",
    })
    .array(),
  editors: z
    .string({
      required_error: "Editor Id is required",
      invalid_type_error: "Editor Id must be a string",
    })
    .array(),
}

const translateArticleInput = {
  ...articleInput,
  articleTranslationId: z.string({
    required_error: "Article Translation ID is required",
    invalid_type_error: "Article Translation ID must be a string",
  }),
}

const updateArticleInput = {
  ...articleInput,
  id: z
    .string({
      required_error: "ID is required",
      invalid_type_error: "ID must be a string",
    })
    .min(1),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
}

export const createArticleSchema = z.object({
  ...articleInput,
})

export const translateArticleSchema = z.object({
  ...translateArticleInput,
})

export const updateArticleSchema = z.object({
  ...updateArticleInput,
})

export type ArticleVisibility = z.infer<typeof articleVisibility>
