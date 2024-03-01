import { z } from "zod"

const articleCommentInput = {
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(1)
    .max(600),
  articleId: z.string({
    required_error: "Article Id is required",
    invalid_type_error: "Article Id must be a string",
  }),
  replyToId: z
    .string({
      invalid_type_error: "Article Comment Id must be a string",
    })
    .optional()
    .nullish(),
}

const updateArticleCommentInput = {
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(1)
    .max(600),
}

export const createArticleCommentSchema = z.object({
  ...articleCommentInput,
})

export const updateArticleCommentSchema = z.object({
  ...updateArticleCommentInput,
})
