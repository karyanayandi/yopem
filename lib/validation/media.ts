import { z } from "zod"

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const mediaInput = {
  name: z.string({
    invalid_type_error: "Name must be a string",
    required_error: "Name Required",
  }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  url: z.string({
    invalid_type_error: "Url must be a string",
    required_error: "Url Required",
  }),
  type: z.string({
    invalid_type_error: "Type must be a string",
    required_error: "Type Required",
  }),
}

const mediaImageUpload = {
  image: z
    .any()
    .refine((files) => files?.length === 0, "Image is required.")
    .refine(
      (files) => files?.[0]?.size >= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type as string),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    ),
}

export const uploadMediaSchema = z.object({
  ...mediaInput,
})

export const uploadImageMediaSchema = z.object({
  ...mediaImageUpload,
})

export const updateMediaSchema = z.object({
  id: z.string({
    invalid_type_error: "ID must be a string",
    required_error: "ID Required",
  }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
})

export type UploadMediaSchema = z.infer<typeof uploadMediaSchema>
export type UpdateMediaSchema = z.infer<typeof updateMediaSchema>
