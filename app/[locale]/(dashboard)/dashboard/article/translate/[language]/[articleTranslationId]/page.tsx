import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslateArticleForm = dynamicFn(
  async () => {
    const TranslateArticleForm = await import("./form")
    return TranslateArticleForm
  },
  {
    ssr: false,
  },
)

interface TranslateArticleMetaDataProps {
  params: {
    locale: LanguageType
    articleTranslationId: string
    language: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateArticleMetaDataProps): Promise<Metadata> {
  const { locale, articleTranslationId, language } = params

  const articleTranslation =
    await api.article.articleTranslationById(articleTranslationId)

  return {
    title: "Translate Article Dashboard",
    description: "Translate Article Dashboard",
    openGraph: {
      title: "Translate Article Dashboard",
      description: "Translate Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/translate/${language}/${articleTranslation?.id}`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/translate/${language}/${articleTranslation?.id}/`,
    },
  }
}

interface TranslateArticleDashboardProps {
  params: {
    articleTranslationId: string
    language: LanguageType
  }
}

export default async function TranslateArticleDashboardPage({
  params,
}: TranslateArticleDashboardProps) {
  const { articleTranslationId, language } = params

  const articleTranslation =
    await api.article.articleTranslationById(articleTranslationId)

  const selectedArticle = articleTranslation?.articles?.find(
    (article) => article.language !== language,
  )
  const otherLanguageArticle = articleTranslation?.articles?.find(
    (article) => article.language === language,
  )

  if (otherLanguageArticle) {
    redirect(`/dashboard/article/edit/${otherLanguageArticle.id}`)
  }

  return (
    <TranslateArticleForm
      articleTranslationId={articleTranslationId}
      // @ts-expect-error FIX: drizzle join return string | null
      initialArticleData={selectedArticle}
      language={language}
    />
  )
}
