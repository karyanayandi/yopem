import type { NextRequest } from "next/server"
import { createI18nMiddleware } from "next-international/middleware"

export default function middleware(request: NextRequest) {
  const defaultLocale = "en"

  const I18nMiddleware = createI18nMiddleware({
    locales: ["id", "en"],
    defaultLocale,
    urlMappingStrategy: "rewrite",
  })

  const response = I18nMiddleware(request)

  return response
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|sw.js|feed|sitemap|robots.txt).*)",
  ],
}
