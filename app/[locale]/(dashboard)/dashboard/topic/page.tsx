import * as React from "react"
import type { Metadata } from "next"

import { env } from "@/env"
import type { LanguageType } from "@/lib/validation/language"
import DashboardTopicContent from "./content"

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Topic Dashboard",
    description: "Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
    },
    openGraph: {
      title: "Topic Dashboard",
      description: "Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
      locale: locale,
    },
  }
}

export default function DashboardTopicPage() {
  return <DashboardTopicContent />
}
