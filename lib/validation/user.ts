import { z } from "zod"

export const USER_ROLE = ["user", "member", "author", "admin"] as const

export const userRole = z.enum(USER_ROLE)

const userCore = {
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .trim()
    .regex(new RegExp(/^[a-z0-9]{3,16}$/), {
      message:
        "Username should be 3-20 characters without spaces, symbol or any special characters.",
    })
    .min(3),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1),
  phoneNumber: z
    .string({ invalid_type_error: "Phone Number must be a string" })
    .optional()
    .nullish(),
  about: z
    .string({ invalid_type_error: "About must be a string" })
    .optional()
    .nullish(),
}

export const updateUserSchema = z.object({
  ...userCore,
  id: z.string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  }),
})

export const updateUserByAdminSchema = z.object({
  ...userCore,
  id: z.string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  }),
  role: z.enum(USER_ROLE, {
    invalid_type_error: "only user, member, author, and admin are accepted",
  }),
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
export type UserRole = z.infer<typeof userRole>
