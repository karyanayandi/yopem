// TODO: handle arrow down

"use client"

import * as React from "react"
import { useController } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FormLabel, FormMessage } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectTopic } from "@/lib/db/schema/topic"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import type { TopicType } from "@/lib/validation/topic"

interface DashboardAddTopicsProps extends React.HTMLAttributes<HTMLDivElement> {
  topics: string[]
  topicType: TopicType
  locale: LanguageType
  addTopics: React.Dispatch<React.SetStateAction<string[]>>
  mode?: "create" | "edit"
  selectedTopics: {
    id: string
    title: string
  }[]
  addSelectedTopics: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        title: string
      }[]
    >
  >
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  fieldName: string
}

const DashboardAddTopics: React.FunctionComponent<DashboardAddTopicsProps> = (
  props,
) => {
  const {
    topics,
    topicType,
    mode = "create",
    addTopics,
    selectedTopics,
    addSelectedTopics,
    locale,
    control,
    fieldName,
  } = props

  const [topicId, setTopicId] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [loadingCreate, setLoadingCreate] = React.useState(false)

  const t = useI18n()
  const ts = useScopedI18n("topic")

  const {
    field: { onChange },
  } = useController({
    control,
    name: fieldName,
    rules: { required: ts("required") },
  })

  const handleLocaleChange = React.useCallback(() => {
    if (mode === "create") {
      setSearchQuery("")
      addTopics([])
      onChange([])
      addSelectedTopics([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  React.useEffect(() => {
    handleLocaleChange()
  }, [handleLocaleChange, locale])

  const assignTopic = React.useCallback(
    (id: string | never) => {
      const checkedTopics = [...topics]
      const index = checkedTopics.indexOf(id as never)
      if (index === -1) {
        checkedTopics.push(id as never)
      } else {
        checkedTopics.splice(index, 1)
      }
      addTopics(checkedTopics)
      onChange(checkedTopics)
    },
    [addTopics, onChange, topics],
  )

  const { data: searchResults, isFetching: searchResultsIsLoading } =
    api.topic.searchByType.useQuery(
      {
        searchQuery: searchQuery,
        language: locale,
        type: topicType,
      },
      {
        enabled: !!searchQuery,
        refetchOnWindowFocus: false,
      },
    )

  const { data, error, isSuccess, isError } =
    api.topic.topicTranslationById.useQuery(topicId, {
      enabled: !!topicId && !!searchQuery,
    })

  React.useEffect(() => {
    if (isSuccess && data) {
      const topicById = data?.topics.find(
        (topicData) => topicData.language === locale,
      ) as SelectTopic
      if (topicById?.id) {
        addSelectedTopics((prev) => [
          ...prev,
          { ...topicById, title: searchQuery },
        ])
        addTopics((prev: string[]) => [...prev, topicById?.id])
        onChange([...topics, topicById?.id])
        toast({ variant: "success", description: ts("create_success") })
      } else {
        toast({ variant: "danger", description: t("something_went_wrong") })
      }
      setTopicId("")
      setSearchQuery("")
    } else if (isError && error) {
      toast({ variant: "danger", description: ts("find_failed") })
    }
    setLoadingCreate(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, data, error])

  const { mutate: createTopic } = api.topic.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        setTopicId(data[0]?.id)
      }
    },
    onError: (error) => {
      setLoadingCreate(false)
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
          description: ts("create_failed"),
        })
      }
    },
  })

  const onSubmit = React.useCallback(() => {
    if (searchResults) {
      const searchResult = searchResults?.find(
        (topic) => topic.title === searchQuery,
      )

      if (searchResult) {
        if (
          !selectedTopics.some((topic) => topic.title === searchResult.title)
        ) {
          const resultValue = {
            id: searchResult.id,
            title: searchResult.title,
          }

          assignTopic(searchResult.id)
          addSelectedTopics((prev) => [...prev, resultValue])
        } else {
          toast({
            variant: "danger",
            description: searchQuery + ` ${t("already_used")}`,
          })
          setSearchQuery("")
        }
        setSearchQuery("")
      } else {
        setLoadingCreate(true)
        //FIX: show not found after creating topic
        createTopic({
          title: searchQuery,
          type: topicType,
          language: locale,
          visibility: "public",
          status: "published",
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addSelectedTopics,
    assignTopic,
    createTopic,
    locale,
    searchQuery,
    searchResults,
    selectedTopics,
    topicType,
  ])

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      setTimeout(onSubmit, 500)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSelectandAssign = (value: { id: string; title: string }) => {
    if (!selectedTopics.some((topic) => topic.title === value.title)) {
      setSearchQuery("")
      assignTopic(value.id)
      addSelectedTopics((prev) => [...prev, value])
    } else {
      toast({
        variant: "danger",
        description: value.title + ` ${t("already_used")}`,
      })
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    const filteredResult = selectedTopics.filter((item) => item.id !== value.id)
    const filteredData = topics.filter((item) => item !== value.id)
    addSelectedTopics(filteredResult)
    addTopics(filteredData)
    onChange(filteredData)
  }

  return (
    <div className="space-y-2">
      <FormLabel>{t("topics")}</FormLabel>
      <div className="rounded-md border border-muted/30 bg-muted/100">
        <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedTopics.length > 0 &&
            selectedTopics.map((topic) => {
              return (
                <div
                  className="flex items-center gap-2 bg-muted/20 px-2 py-1 text-[14px] text-foreground"
                  key={topic.id}
                >
                  <span>{topic.title}</span>
                  <Button
                    aria-label={t("delete")}
                    onClick={() => handleRemoveValue(topic)}
                    className="size-5 min-w-0 rounded-full bg-transparent text-foreground hover:bg-danger hover:text-white"
                    size="icon"
                  >
                    <Icon.Close aria-label={t("delete")} />
                  </Button>
                </div>
              )
            })}
          <Input
            type="text"
            className="h-auto w-full min-w-[50px] max-w-full shrink grow basis-0 border-none !bg-transparent p-0 focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            name="topicTitle"
            onKeyDown={handleEnter}
            id="searchTopic"
            value={searchQuery}
            placeholder={ts("enter")}
            onChange={handleSearchChange}
          />
        </div>
        {(searchResultsIsLoading || loadingCreate) && (
          <div className="p-2">
            <Skeleton className="h-4 w-full rounded-md bg-foreground/60" />
            <p className="mt-2">
              {loadingCreate ? ts("creating") : ts("finding")}
            </p>
          </div>
        )}
        {!searchResultsIsLoading &&
        !loadingCreate &&
        searchResults !== undefined &&
        searchResults.length > 0 ? (
          <ul className="border-t border-muted/30">
            {searchResults.map((searchTopic) => {
              const topicsData = {
                id: searchTopic.id,
                title: searchTopic.title,
              }
              return (
                <li key={searchTopic.id} className="p-2 hover:bg-muted/50">
                  <Button
                    variant="ghost"
                    type="button"
                    aria-label={searchTopic.title}
                    onClick={() => handleSelectandAssign(topicsData)}
                  >
                    {searchTopic.title}
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          !searchResultsIsLoading &&
          !loadingCreate &&
          searchResults !== undefined &&
          searchResults.length < 1 && (
            <div className="border-t border-muted/30 p-2">
              <p>{ts("not_found")}</p>
            </div>
          )
        )}
      </div>
      <FormMessage />
    </div>
  )
}

export default DashboardAddTopics
