import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"
import type { TopicType } from "@/lib/validation/topic"
import TranslateTopicForm from "./form"

interface TranslateTopicMetaDataProps {
  params: {
    topicTranslationId: string
    language: LanguageType
    locale: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateTopicMetaDataProps): Promise<Metadata> {
  const { topicTranslationId, language, locale } = params

  const topicTranslation =
    await api.topic.topicTranslationById(topicTranslationId)

  return {
    title: "Translate Topic Dashboard",
    description: "Translate Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/translate/${language}/${topicTranslation?.id}`,
    },
    openGraph: {
      title: "Translate Topic Dashboard",
      description: "Translate Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/translate/${language}/${topicTranslation?.id}`,
      locale: locale,
    },
  }
}

interface TranslateTopicDashboardProps {
  params: {
    topicTranslationId: string
    language: LanguageType
    visibility: TopicType
    type: TopicType
  }
}

export default async function TranslateTopicDashboardPage({
  params,
}: TranslateTopicDashboardProps) {
  const { topicTranslationId, language } = params

  const topicTranslation =
    await api.topic.topicTranslationById(topicTranslationId)

  const otherLanguageTopic = topicTranslation?.topics.find(
    (topic) => topic.language === language,
  )

  if (otherLanguageTopic) {
    redirect(`/dashboard/topic/edit/${otherLanguageTopic.id}`)
  }

  const beforeTranslatedTopic = topicTranslation?.topics.find(
    (topic) => topic.language !== language,
  )

  return (
    <TranslateTopicForm
      topicTranslationId={topicTranslationId}
      language={language}
      visibility={beforeTranslatedTopic?.visibility}
      type={beforeTranslatedTopic?.type}
    />
  )
}
