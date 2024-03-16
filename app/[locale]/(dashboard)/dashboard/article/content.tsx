"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardArticleHeader from "./header"
import ArticleTable from "./table"

export default function DashboardArticleContent() {
  const searchParams = useSearchParams()

  const articleLangIdPage = searchParams.get("articleLangIdPage")
  const articleLangEnPage = searchParams.get("articleLangEnPage")

  const ts = useScopedI18n("article")

  const { data: articlesCountLangId, refetch: updateArticlesCountLangId } =
    api.article.countByLanguage.useQuery("id")
  const { data: articlesCountLangEn, refetch: updateArticlesCountLangEn } =
    api.article.countByLanguage.useQuery("en")

  const perPage = 10

  const articleLangIdLastPage =
    articlesCountLangId && Math.ceil(articlesCountLangId / perPage)
  const articleLangEnLastPage =
    articlesCountLangEn && Math.ceil(articlesCountLangEn / perPage)

  const {
    data: articlesLangId,
    isLoading: articlesLangIdIsLoading,
    refetch: updateArticlesLangId,
  } = api.article.dashboard.useQuery({
    language: "id",
    page: articleLangIdPage ? parseInt(articleLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: articlesLangEn,
    isLoading: articlesLangEnIsLoading,
    refetch: updateArticlesLangEn,
  } = api.article.dashboard.useQuery({
    language: "en",
    page: articleLangEnPage ? parseInt(articleLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      articleLangIdLastPage &&
      articleLangIdPage &&
      parseInt(articleLangIdPage) !== 1 &&
      parseInt(articleLangIdPage) > articleLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${articleLangIdLastPage.toString()}`,
      )
    }
  }, [articleLangIdLastPage, articleLangIdPage])

  React.useEffect(() => {
    if (
      articleLangEnLastPage &&
      articleLangEnPage &&
      parseInt(articleLangEnPage) !== 1 &&
      parseInt(articleLangEnPage) > articleLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${articleLangEnLastPage.toString()}`,
      )
    }
  }, [articleLangEnLastPage, articleLangEnPage])

  return (
    <>
      <DashboardArticleHeader />
      {/* TODO: assign tab to link params */}
      <Tabs defaultValue="id">
        <TabsList>
          <TabsTrigger value="id">
            <Icon.IndonesiaFlag className="mr-2 size-4" />
            Indonesia
          </TabsTrigger>
          <TabsTrigger value="en">
            <Icon.USAFlag className="mr-2 size-4" />
            English
          </TabsTrigger>
        </TabsList>
        <TabsContent value="id">
          {!articlesLangIdIsLoading &&
          articlesLangId !== undefined &&
          articlesLangId.length > 0 ? (
            <ArticleTable
              articles={articlesLangId}
              paramsName="articleLangIdPage"
              page={articleLangIdPage ? parseInt(articleLangIdPage) : 1}
              lastPage={articleLangIdLastPage ?? 2}
              updateArticles={updateArticlesLangId}
              updateArticlesCount={updateArticlesCountLangId}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
        <TabsContent value="en">
          {!articlesLangEnIsLoading &&
          articlesLangEn !== undefined &&
          articlesLangEn.length > 0 ? (
            <ArticleTable
              articles={articlesLangEn}
              paramsName="articleLangEnPage"
              page={articleLangEnPage ? parseInt(articleLangEnPage) : 1}
              lastPage={articleLangEnLastPage ?? 3}
              updateArticles={updateArticlesLangEn}
              updateArticlesCount={updateArticlesCountLangEn}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
