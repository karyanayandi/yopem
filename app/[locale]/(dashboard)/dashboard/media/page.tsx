import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const DashboardMediaContent = dynamicFn(
  async () => {
    const DashboardMediaContent = await import("./content")
    return DashboardMediaContent
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
    title: "Media Dashboard",
    description: "Media Dashboard",
    openGraph: {
      title: "Media Dashboard",
      description: "Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/`,
    },
  }
}

export default function MediasDashboard() {
  return <DashboardMediaContent />
}
