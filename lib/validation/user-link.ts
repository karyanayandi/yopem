import { z } from "zod"

const userLinkCore = {
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  url: z
    .string({
      required_error: "URL is required",
      invalid_type_error: "URL must be a string",
    })
    .trim(),
}

export const createUserLinkSchema = z.object({
  ...userLinkCore,
  userId: z.string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  }),
})

export const updateUserLinkSchema = z.object({
  ...userLinkCore,
  id: z.string({
    required_error: "User Link ID is required",
    invalid_type_error: "User Link ID must be a string",
  }),
})
