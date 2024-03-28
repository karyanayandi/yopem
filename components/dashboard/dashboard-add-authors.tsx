// TODO: handle arrow down

"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FormLabel, FormMessage } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  name: string
}

interface DashboardAddAuthorsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  authors: string[]
  addAuthors: React.Dispatch<React.SetStateAction<string[]>>
  selectedAuthors: {
    id: string
    name: string
  }[]
  addSelectedAuthors: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        name: string
      }[]
    >
  >
}

interface FormValues {
  name: string
}

const DashboardAddAuthors: React.FunctionComponent<DashboardAddAuthorsProps> = (
  props,
) => {
  const { authors, addAuthors, selectedAuthors, addSelectedAuthors } = props

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("user")

  const { data: searchResults } = api.user.search.useQuery(searchQuery, {
    enabled: !!searchQuery,
  })

  const form = useForm<FormValues>({ mode: "all", reValidateMode: "onChange" })

  const assignAuthor = React.useCallback(
    (id: string) => {
      const checkedAuthors = [...authors]
      const index = checkedAuthors.indexOf(id)
      if (index === -1) {
        checkedAuthors.push(id)
      } else {
        checkedAuthors.splice(index, 1)
      }
      addAuthors(checkedAuthors)
    },
    [addAuthors, authors],
  )

  const onSubmit = React.useCallback(
    (values: FormValues) => {
      setSearchQuery(values.name)
      if (searchResults) {
        const searchResult = searchResults?.find(
          (topic) => topic.name === values.name,
        )
        if (searchResult) {
          if (
            !selectedAuthors.some((author) => author.name === searchResult.name)
          ) {
            const resultValue = {
              id: searchResult.id,
              name: searchResult.name!,
            }
            assignAuthor(searchResult.id)
            addSelectedAuthors((prev) => [...prev, resultValue])
          }
          setSearchQuery("")
        }
      }
    },
    [addSelectedAuthors, assignAuthor, searchResults, selectedAuthors],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSelectandAssign = (value: { id: string; name: string }) => {
    if (!selectedAuthors.some((author) => author.name === value.name)) {
      setSearchQuery("")
      assignAuthor(value.id)
      addSelectedAuthors((prev) => [...prev, value])
    } else {
      toast({
        variant: "danger",
        description: value.name + ` ${t("already_used")}`,
      })
      setSearchQuery("")
    }
  }

  const handleEnter = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === "Enter") {
      form.setValue("name", searchQuery)
      event.preventDefault()
      form.handleSubmit(onSubmit)()
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    const filteredResult = selectedAuthors.filter(
      (item) => item.id !== value.id,
    )

    const filteredData = authors.filter((item) => item !== value.id)
    addSelectedAuthors(filteredResult)
    addAuthors(filteredData)
  }

  return (
    <div className="my-2 flex max-w-xl flex-col space-y-2">
      <FormLabel>{t("authors")}</FormLabel>
      <div className="rounded-md border border-muted/30 bg-muted/100">
        <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedAuthors.length > 0 &&
            selectedAuthors.map((author) => {
              return (
                <div
                  className="flex items-center gap-2 bg-muted/20 px-2 py-1 text-[14px] text-foreground"
                  key={author.id}
                >
                  <span>{author.name}</span>
                  <Button
                    // disabled={selectedAuthors.length === 1}
                    aria-label="Delete Author"
                    onClick={() => handleRemoveValue(author)}
                    size="icon"
                    className="size-5 min-w-0 rounded-full bg-transparent text-foreground hover:bg-danger hover:text-white"
                  >
                    <Icon.Close aria-label="Delete Author" />
                  </Button>
                </div>
              )
            })}
          <Input
            type="text"
            {...form.register("name", {
              required: selectedAuthors.length === 0 && ts("author_required"),
            })}
            className="h-auto w-full min-w-[50px] max-w-full shrink grow basis-0 border-none !bg-transparent p-0 focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            name="name"
            id="searchAuthor"
            value={searchQuery}
            onKeyDown={handleEnter}
            placeholder={ts("find_authors")}
            onChange={handleSearchChange}
          />
          <FormMessage />
        </div>
        {searchResults && searchResults.length > 0 && (
          <ul className="border-t border-muted/30">
            {searchResults.map((searchAuthor) => {
              const authorsData = {
                id: searchAuthor.id,
                name: searchAuthor.name!,
              }
              return (
                <li key={searchAuthor.id} className="p-2 hover:bg-muted/50">
                  <Button
                    aria-label={searchAuthor.name ?? ""}
                    variant="ghost"
                    type="button"
                    onClick={() => handleSelectandAssign(authorsData)}
                  >
                    {searchAuthor.name}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DashboardAddAuthors
