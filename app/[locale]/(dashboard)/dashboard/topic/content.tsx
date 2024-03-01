"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardTopicHeader from "./header"
import TopicTable from "./table"

export default function DashboardTopicContent() {
  const searchParams = useSearchParams()

  const topicLangIdPage = searchParams.get("topicLangIdPage")
  const topicLangEnPage = searchParams.get("topicLangEnPage")

  const ts = useScopedI18n("topic")

  const { data: topicsCountLangId, refetch: updateTopicsCountLangId } =
    api.topic.countByLanguage.useQuery("id")
  const { data: topicsCountLangEn, refetch: updateTopicsCountLangEn } =
    api.topic.countByLanguage.useQuery("en")

  const perPage = 10

  const topicLangIdLastPage =
    topicsCountLangId && Math.ceil(topicsCountLangId / perPage)
  const topicLangEnLastPage =
    topicsCountLangEn && Math.ceil(topicsCountLangEn / perPage)

  const {
    data: topicsLangId,
    isLoading: topicsLangIdIsLoading,
    refetch: updateTopicsLangId,
  } = api.topic.dashboard.useQuery({
    language: "id",
    page: topicLangIdPage ? parseInt(topicLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: topicsLangEn,
    isLoading: topicsLangEnIsLoading,
    refetch: updateTopicsLangEn,
  } = api.topic.dashboard.useQuery({
    language: "en",
    page: topicLangEnPage ? parseInt(topicLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      topicLangIdLastPage &&
      topicLangIdPage &&
      parseInt(topicLangIdPage) !== 1 &&
      parseInt(topicLangIdPage) > topicLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${topicLangIdLastPage.toString()}`,
      )
    }
  }, [topicLangIdLastPage, topicLangIdPage])

  React.useEffect(() => {
    if (
      topicLangEnLastPage &&
      topicLangEnPage &&
      parseInt(topicLangEnPage) !== 1 &&
      parseInt(topicLangEnPage) > topicLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${topicLangEnLastPage.toString()}`,
      )
    }
  }, [topicLangEnLastPage, topicLangEnPage])

  return (
    <>
      <DashboardTopicHeader />
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
          {!topicsLangIdIsLoading &&
          topicsLangId !== undefined &&
          topicsLangId.length > 0 ? (
            <TopicTable
              topics={topicsLangId ?? 1}
              paramsName="topicLangIdPage"
              page={topicLangIdPage ? parseInt(topicLangIdPage) : 1}
              lastPage={topicLangIdLastPage ?? 2}
              updateTopics={updateTopicsLangId}
              updateTopicsCount={updateTopicsCountLangId}
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
          {!topicsLangEnIsLoading &&
          topicsLangEn !== undefined &&
          topicsLangEn.length > 0 ? (
            <TopicTable
              topics={topicsLangEn ?? 1}
              paramsName="topicLangEnPage"
              page={topicLangEnPage ? parseInt(topicLangEnPage) : 1}
              lastPage={topicLangEnLastPage ?? 3}
              updateTopics={updateTopicsLangEn}
              updateTopicsCount={updateTopicsCountLangEn}
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
