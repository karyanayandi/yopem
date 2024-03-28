import * as React from "react"

import DashboardArticleVisibilityBadge from "@/components/dashboard/dashboard-article-visibility-badge"
import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardStatusBadge from "@/components/dashboard/dashboard-status-badge"
// import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

interface ArticlesProps extends SelectArticle {
  articleTranslation: {
    articles: Partial<SelectArticle>[]
  }
  featuredImage: Partial<SelectMedia>
}

interface ArticleTableProps {
  articles: ArticlesProps[]
  paramsName: string
  page: number
  lastPage: number
  updateArticles: () => void
  updateArticlesCount: () => void
}

export default function ArticleTable(props: ArticleTableProps) {
  const {
    articles,
    paramsName,
    page,
    lastPage,
    updateArticles,
    updateArticlesCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("article")

  const { mutate: deleteArticle } = api.article.deleteByAdmin.useMutation({
    onSuccess: () => {
      updateArticles()
      updateArticlesCount()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("slug")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("visibility")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("published_date")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("last_modified")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length > 0 &&
            articles.map((article) => {
              return (
                <TableRow key={article.id}>
                  <TableCell className="max-w-[120px] align-middle">
                    <div className="flex flex-col">
                      <span className="line-clamp-3 font-medium">
                        {article.title}
                      </span>
                      <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                        <span>{article.slug}</span>
                        <span className="pr-1">,</span>
                        <span>{article.visibility}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <span className="overflow-hidden text-ellipsis font-medium">
                        {article.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <DashboardStatusBadge status={article.status}>
                        {article.status}
                      </DashboardStatusBadge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <DashboardArticleVisibilityBadge
                        visibility={article.visibility}
                      >
                        {article.visibility}
                      </DashboardArticleVisibilityBadge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(article.createdAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(article.updatedAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    {article.articleTranslation.articles.length > 1 ? (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deleteArticle(article.id)
                        }}
                        editUrl={`/dashboard/article/edit/${article.id}`}
                        viewUrl={`/article/${article.slug}`}
                        description={article.title}
                      />
                    ) : (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deleteArticle(article.id)
                        }}
                        editUrl={`/dashboard/article/edit/${article.id}`}
                        translateUrl={
                          article.language === "id"
                            ? `/dashboard/article/translate/en/${article.articleTranslationId}`
                            : `/dashboard/article/translate/id/${article.articleTranslationId}`
                        }
                        viewUrl={`/article/${article.slug}`}
                        description={article.title}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
      {lastPage ? (
        <DashboardPagination
          currentPage={page}
          lastPage={lastPage ?? 1}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
