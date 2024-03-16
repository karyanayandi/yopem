import * as React from "react"
import type { Metadata } from "next"

import { env } from "@/env"
import type { LanguageType } from "@/lib/validation/language"
import DashboardArticleContent from "./content"

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
