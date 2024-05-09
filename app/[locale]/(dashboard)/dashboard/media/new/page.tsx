import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const UploadMedia = dynamicFn(
  async () => {
    const UploadMedia = await import("@/components/media/upload-media")
    return UploadMedia
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
    title: "Upload Media Dashboard",
    description: "Upload Media Dashboard",
    openGraph: {
      title: "Upload Media Dashboard",
      description: "Upload Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new/`,
    },
  }
}

export default function UploadMediasDashboardPage() {
  return <UploadMedia toggleUpload={true} />
}
