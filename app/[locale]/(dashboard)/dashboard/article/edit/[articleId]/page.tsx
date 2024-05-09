import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditArticleForm = dynamicFn(
  async () => {
    const EditArticleForm = await import("./form")
    return EditArticleForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { articleId: string; locale: LanguageType }
}): Promise<Metadata> {
  const { articleId, locale } = params

  const article = await api.article.byId(articleId)

  return {
    title: "Edit Article Dashboard",
    description: "Edit Article Dashboard",
    openGraph: {
      title: "Edit Article Dashboard",
      description: "Edit Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/edit/${article?.id}`,

      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/edit/${article?.id}/`,
    },
  }
}

interface EditArticlesDashboardProps {
  params: { articleId: string }
}

export default async function CreateArticlesDashboard({
  params,
}: EditArticlesDashboardProps) {
  const { articleId } = params

  const article = await api.article.byId(articleId)

  if (!article) {
    notFound()
  }

  // @ts-expect-error FIX: drizzle join return string | null
  return <EditArticleForm article={article} />
}
