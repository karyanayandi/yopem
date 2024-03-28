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

interface DashboardAddEditorsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  editors: string[]
  addEditors: React.Dispatch<React.SetStateAction<string[]>>
  selectedEditors: {
    id: string
    name: string
  }[]
  addSelectedEditors: React.Dispatch<
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

const DashboardAddEditors: React.FunctionComponent<DashboardAddEditorsProps> = (
  props,
) => {
  const { editors, addEditors, selectedEditors, addSelectedEditors } = props

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("user")

  const { data: searchResults } = api.user.search.useQuery(searchQuery, {
    enabled: !!searchQuery,
  })

  const form = useForm<FormValues>({ mode: "all", reValidateMode: "onChange" })

  const assignEditor = React.useCallback(
    (id: string) => {
      const checkedEditors = [...editors]
      const index = checkedEditors.indexOf(id)
      if (index === -1) {
        checkedEditors.push(id)
      } else {
        checkedEditors.splice(index, 1)
      }
      addEditors(checkedEditors)
    },
    [addEditors, editors],
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
            !selectedEditors.some((editor) => editor.name === searchResult.name)
          ) {
            const resultValue = {
              id: searchResult.id,
              name: searchResult.name!,
            }
            assignEditor(searchResult.id)
            addSelectedEditors((prev) => [...prev, resultValue])
          }
          setSearchQuery("")
        }
      }
    },
    [addSelectedEditors, assignEditor, searchResults, selectedEditors],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSelectandAssign = (value: { id: string; name: string }) => {
    if (!selectedEditors.some((editor) => editor.name === value.name)) {
      setSearchQuery("")
      assignEditor(value.id)
      addSelectedEditors((prev) => [...prev, value])
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
    const filteredResult = selectedEditors.filter(
      (item) => item.id !== value.id,
    )

    const filteredData = editors.filter((item) => item !== value.id)
    addSelectedEditors(filteredResult)
    addEditors(filteredData)
  }

  return (
    <div className="my-2 flex max-w-xl flex-col space-y-2">
      <FormLabel>{t("editors")}</FormLabel>
      <div className="rounded-md border border-muted/30 bg-muted/100">
        <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedEditors.length > 0 &&
            selectedEditors.map((editor) => {
              return (
                <div
                  className="flex items-center gap-2 bg-muted/20 px-2 py-1 text-[14px] text-foreground"
                  key={editor.id}
                >
                  <span>{editor.name}</span>
                  <Button
                    // disabled={selectedAuthors.length === 1}
                    aria-label="Delete Editor"
                    onClick={() => handleRemoveValue(editor)}
                    size="icon"
                    className="size-5 min-w-0 rounded-full bg-transparent text-foreground hover:bg-danger hover:text-white"
                  >
                    <Icon.Close aria-label="Delete Editor" />
                  </Button>
                </div>
              )
            })}
          <Input
            type="text"
            {...form.register("name", {
              required: selectedEditors.length === 0 && ts("editor_required"),
            })}
            className="h-auto w-full min-w-[50px] max-w-full shrink grow basis-0 border-none !bg-transparent p-0 focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            name="name"
            id="searchEditor"
            value={searchQuery}
            onKeyDown={handleEnter}
            placeholder={ts("find_editors")}
            onChange={handleSearchChange}
          />
          <FormMessage />
        </div>
        {searchResults && searchResults.length > 0 && (
          <ul className="border-t border-muted/30">
            {searchResults.map((searchEditor) => {
              const editorsData = {
                id: searchEditor.id,
                name: searchEditor.name!,
              }
              return (
                <li key={searchEditor.id} className="p-2 hover:bg-muted/50">
                  <Button
                    aria-label={searchEditor.name ?? ""}
                    variant="ghost"
                    type="button"
                    onClick={() => handleSelectandAssign(editorsData)}
                  >
                    {searchEditor.name}
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

export default DashboardAddEditors
