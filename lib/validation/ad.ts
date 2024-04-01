import { z } from "zod"

export const AD_POSITION = [
  "home_below_header",
  "article_below_header",
  "topic_below_header",
  "single_article_above_content",
  "single_article_middle_content",
  "single_article_below_content",
  "single_article_pop_up",
  "article_below_header_amp",
  "single_article_above_content_amp",
  "single_article_middle_content_amp",
  "single_article_below_content_amp",
] as const

export const adPosition = z.enum(AD_POSITION)

export const AD_TYPE = ["adsense", "plain_ad"] as const

export const adType = z.enum(AD_TYPE)

export const adInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(2),
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(2),
  position: z.enum(AD_POSITION, {
    invalid_type_error: "Your Ad position doesnt exist on available option.",
  }),
  type: z.enum(AD_TYPE, {
    invalid_type_error: "Your Ad type doesnt exist on available option.",
  }),
  active: z
    .boolean({
      invalid_type_error: "Active must be a boolean",
    })
    .optional(),
}

const updateAdInput = {
  id: z
    .string({
      required_error: "ID is required",
      invalid_type_error: "ID must be a string",
    })
    .min(2),
  ...adInput,
}

export const createAdSchema = z.object({
  ...adInput,
})

export const updateAdSchema = z.object({
  ...updateAdInput,
})

export type AdType = z.infer<typeof adType>
export type AdPosition = z.infer<typeof adPosition>
