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
    topicTranslationPrimaryId: string
    language: LanguageType
    locale: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateTopicMetaDataProps): Promise<Metadata> {
  const { topicTranslationPrimaryId, language, locale } = params

  const topicTranslationPrimary =
    await api.topic.topicTranslationPrimaryById.query(topicTranslationPrimaryId)

  return {
    title: "Translate Topic Dashboard",
    description: "Translate Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/translate/${language}/${topicTranslationPrimary?.id}`,
    },
    openGraph: {
      title: "Translate Topic Dashboard",
      description: "Translate Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/translate/${language}/${topicTranslationPrimary?.id}`,
      locale: locale,
    },
  }
}

interface TranslateTopicDashboardProps {
  params: {
    topicTranslationPrimaryId: string
    language: LanguageType
    visibility: TopicType
    type: TopicType
  }
}

export default async function TranslateTopicDashboardPage({
  params,
}: TranslateTopicDashboardProps) {
  const { topicTranslationPrimaryId, language } = params

  const topicTranslationPrimary =
    await api.topic.topicTranslationPrimaryById.query(topicTranslationPrimaryId)

  const otherLanguageTopic = topicTranslationPrimary?.topics.find(
    (topic) => topic.language === language,
  )

  if (otherLanguageTopic) {
    redirect(`/dashboard/topic/edit/${otherLanguageTopic.id}`)
  }

  const beforeTranslatedTopic = topicTranslationPrimary?.topics.find(
    (topic) => topic.language !== language,
  )

  return (
    <TranslateTopicForm
      topicTranslationPrimaryId={topicTranslationPrimaryId}
      language={language}
      visibility={beforeTranslatedTopic?.visibility}
      type={beforeTranslatedTopic?.type}
    />
  )
}
