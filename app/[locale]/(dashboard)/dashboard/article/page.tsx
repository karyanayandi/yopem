import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const DashboardArticleContent = dynamicFn(
  async () => {
    const DashboardArticleContent = await import("./content")
    return DashboardArticleContent
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Article Dashboard",
    description: "Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
    },
    openGraph: {
      title: "Article Dashboard",
      description: "Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
      locale: locale,
    },
  }
}

export default function DashboardArticleage() {
  return <DashboardArticleContent />
}
