import { z } from "zod"

export const LANGUAGE_TYPE = ["id", "en"] as const

export const languageType = z.enum(LANGUAGE_TYPE)
export type LanguageType = z.infer<typeof languageType>
