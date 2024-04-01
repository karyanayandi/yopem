import * as React from "react"
import type { Metadata } from "next"

import UploadMedia from "@/components/media/upload-media"
import { env } from "@/env"
import type { LanguageType } from "@/lib/validation/language"

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
