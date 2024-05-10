"use client"

import * as React from "react"

import LoadingProgress from "@/components/loading-progress"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import ArticleCardHorizontal from "./article-card-horizontal"

export type InfinteScrollArticlesDataProps = Pick<
  SelectArticle,
  "title" | "slug" | "excerpt"
> & {
  featuredImage: Pick<SelectMedia, "url">
}

interface ArticleListByTopicProps extends React.HTMLAttributes<HTMLDivElement> {
  topicId: string
  locale: LanguageType
}

const ArticleListByTopic: React.FunctionComponent<ArticleListByTopicProps> = (
  props,
) => {
  const { topicId, locale } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.article.byTopicIdInfinite.useInfiniteQuery(
      {
        topicId: topicId,
        language: locale,
        limit: 10,
      },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const handleObserver = React.useCallback(
    ([target]: IntersectionObserverEntry[]) => {
      if (target?.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage],
  )

  React.useEffect(() => {
    const lmRef = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)

    return () => {
      if (lmRef) observer.unobserve(lmRef)
    }
  }, [handleObserver])

  return (
    <div>
      {data?.pages.map((page) => {
        return page.articles.map((article) => {
          return <ArticleCardHorizontal article={article} key={article.id} />
        })
      })}
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleListByTopic
