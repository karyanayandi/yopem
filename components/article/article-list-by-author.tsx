"use client"

import * as React from "react"

import LoadingProgress from "@/components/loading-progress"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import ArticleCardHorizontal from "./article-card-horizontal"

export type InfinteScrollArticlesDataProps = Pick<
  SelectArticle,
  "title" | "slug" | "excerpt"
> & {
  featuredImage: Pick<SelectMedia, "url">
}

interface ArticleListByAuthorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  authorId: string
  locale: LanguageType
}

const ArticleListByAuthor: React.FunctionComponent<ArticleListByAuthorProps> = (
  props,
) => {
  const { authorId, locale } = props

  const ts = useScopedI18n("article")

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.article.byAuthorIdInfinite.useInfiniteQuery(
      {
        authorId: authorId,
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
      {data?.pages ? (
        data?.pages.map((page) => {
          return page.articles.map((article) => {
            return <ArticleCardHorizontal article={article} key={article.id} />
          })
        })
      ) : (
        <h3 className="my-16 text-center text-3xl">{ts("not_found")}</h3>
      )}
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

export default ArticleListByAuthor
