import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import { getSession } from "@/lib/auth/utils"
import type { LanguageType } from "@/lib/validation/language"

const CreateArticleForm = dynamicFn(
  async () => {
    const CreateArticleForm = await import("./form")
    return CreateArticleForm
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
    title: "Create Article Dashboard",
    description: "Create Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/new/`,
    },
    openGraph: {
      title: "Create Article Dashboard",
      description: "Create Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/new`,
      locale: locale,
    },
  }
}

export default async function CreateArticlesDashboard() {
  const { session } = await getSession()

  return <CreateArticleForm session={session} />
}
