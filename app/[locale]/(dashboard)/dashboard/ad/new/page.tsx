import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const CreateAdForm = dynamicFn(
  async () => {
    const CreateAdForm = await import("./form")
    return CreateAdForm
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
    title: "Create Ad Dashboard",
    description: "Create Ad Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/new/`,
    },
    openGraph: {
      title: "Create Ad Dashboard",
      description: "Create Ad Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/new/`,
      locale: locale,
    },
  }
}

export default function CreateAdDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateAdForm />
      </div>
    </div>
  )
}
