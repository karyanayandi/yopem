import * as React from "react"
import NextLink from "next/link"

import { Button } from "@/components/ui/button"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

interface TopicListNavProps {
  locale: LanguageType
}

const TopicListNav: React.FunctionComponent<TopicListNavProps> = async (
  props,
) => {
  const { locale } = props

  const topics = await api.topic.byArticleCount({
    language: locale,
    page: 1,
    perPage: 10,
  })

  return (
    <div className="hidden lg:flex">
      {topics.map((topic) => (
        <Button asChild variant="ghost" key={topic.id}>
          <NextLink
            aria-label={topic.title}
            href={`/article/topic/${topic.slug}`}
          >
            {topic.title}
          </NextLink>
        </Button>
      ))}
    </div>
  )
}

export default TopicListNav
