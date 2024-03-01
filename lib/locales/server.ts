import { createI18nServer } from "next-international/server"

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
  createI18nServer({
    id: () => import("./id"),
    en: () => import("./en"),
  })
