import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const CreateTopicForm = dynamicFn(
  async () => {
    const CreateTopicForm = await import("./form")
    return CreateTopicForm
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
    title: "Create Topic Dashboard",
    description: "Create Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/new/`,
    },
    openGraph: {
      title: "Create Topic Dashboard",
      description: "Create Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/new`,
      locale: locale,
    },
  }
}

export default function CreateTopicDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateTopicForm />
      </div>
    </div>
  )
}
