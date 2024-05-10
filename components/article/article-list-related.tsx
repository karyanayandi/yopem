"use client"

import * as React from "react"

import LoadingProgress from "@/components/loading-progress"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import ArticleCardHorizontal from "./article-card-horizontal"

export type InfinteScrollRelatedArticlesDataProps = Pick<
  SelectArticle,
  "title" | "slug" | "excerpt"
> & {
  featuredImage: Pick<SelectMedia, "url">
}

interface ArticleListRelatedProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
  currentArticleId: string
  topicId: string
}

const ArticleListRelated: React.FunctionComponent<ArticleListRelatedProps> = (
  props,
) => {
  const { locale, currentArticleId, topicId } = props

  const ts = useScopedI18n("article")

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const {
    data: relatedArticles,
    hasNextPage,
    fetchNextPage,
  } = api.article.relatedInfinite.useInfiniteQuery(
    {
      language: locale,
      currentArticleId: currentArticleId,
      topicId: topicId,
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
    <div className="space-y-4">
      {/* TODO: handle dont show heading if not available related articles */}
      <span className="text-lg font-bold md:text-2xl">{ts("related")}</span>
      {relatedArticles?.pages.map((page) => {
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

export default ArticleListRelated
