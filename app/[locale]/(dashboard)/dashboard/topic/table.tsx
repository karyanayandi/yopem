import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardStatusBadge from "@/components/dashboard/dashboard-status-badge"
import DashboardTopicVisibilityBadge from "@/components/dashboard/dashboard-topic-visibility-badge"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTopic } from "@/lib/db/schema/topic"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

interface TopicsProps extends SelectTopic {
  topicTranslation: {
    topics: SelectTopic[]
  }
}

interface TopicTableProps {
  topics: TopicsProps[]
  paramsName: string
  page: number
  lastPage: number
  updateTopics: () => void
  updateTopicsCount: () => void
}

export default function TopicTable(props: TopicTableProps) {
  const {
    topics,
    paramsName,
    page,
    lastPage,
    updateTopics,
    updateTopicsCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("topic")

  const { mutate: deleteTopic } = api.topic.delete.useMutation({
    onSuccess: () => {
      updateTopics()
      updateTopicsCount()
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
              {t("type")}
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => {
            return (
              <TableRow key={topic.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {topic.title}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span>{topic.slug}</span>
                      <span className="pr-1">,</span>
                      <span className="uppercase">{topic.type}</span>
                      <span className="pr-1">,</span>
                      <span>{topic.visibility}</span>
                      <span className="pr-1">,</span>
                      <span>{topic.language}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {topic.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <Badge variant="outline" className="uppercase">
                      {topic.type}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <DashboardStatusBadge status={topic.status}>
                      {topic.status}
                    </DashboardStatusBadge>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <DashboardTopicVisibilityBadge
                      visibility={topic.visibility}
                    >
                      {topic.visibility}
                    </DashboardTopicVisibilityBadge>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    {formatDate(topic.createdAt, "LL")}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  {topic.topicTranslation.topics.length > 1 ? (
                    <DashboardShowOptions
                      onDelete={() => {
                        void deleteTopic(topic.id)
                      }}
                      editUrl={`/dashboard/topic/edit/${topic.id}`}
                      viewUrl={`/topic/${topic.slug}`}
                      description={topic.title}
                    />
                  ) : (
                    <DashboardShowOptions
                      onDelete={() => {
                        void deleteTopic(topic.id)
                      }}
                      editUrl={`/dashboard/topic/edit/${topic.id}`}
                      translateUrl={
                        topic.language === "id"
                          ? `/dashboard/topic/translate/en/${topic.topicTranslationId}`
                          : `/dashboard/topic/translate/id/${topic.topicTranslationId}`
                      }
                      viewUrl={`/topic/${topic.slug}`}
                      description={topic.title}
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
