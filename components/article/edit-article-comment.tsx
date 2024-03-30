"use client"

import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { cn } from "@/lib/utils"

interface FormValues {
  content: string
}

interface EditArticleCommentProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  onSuccess: () => void
  content: string
  type?: "default" | "dashboard"
  onCancel?: () => void
}

const EditArticleComment: React.FunctionComponent<EditArticleCommentProps> = (
  props,
) => {
  const { id, onSuccess, content, type = "default", onCancel } = props

  const t = useI18n()
  const ts = useScopedI18n("comment")

  const [loading, setLoading] = React.useState(false)

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      content: content ?? "",
    },
  })

  const { mutate: update } = api.articleComment.update.useMutation({
    onSuccess: () => {
      const textarea = document.querySelector("textarea")
      if (textarea && type === "default") {
        textarea.style.height = "30px"
      }
      reset()
      onSuccess()
      toast({
        variant: "success",
        description: ts("update_success"),
      })
    },
    onError: (error) => {
      setLoading(false)
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
          description: ts("update_failed"),
        })
      }
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setLoading(true)
    update({ id: id, content: values.content })
    setLoading(false)
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="mx-3 mb-2 w-full border-b border-border">
        <Textarea
          variant={type !== "default" ? "solid" : "plain"}
          onInput={(event) => {
            if (type === "default") {
              const textarea = event.currentTarget
              const currentFocus = document.activeElement
              const totalHeight =
                textarea.scrollHeight -
                parseInt(getComputedStyle(textarea).paddingTop) -
                parseInt(getComputedStyle(textarea).paddingBottom)
              textarea.style.height = totalHeight + "px"
              if (textarea.value === "") {
                textarea.style.height = "30px"
                textarea.focus()
              }
              if (currentFocus === textarea) {
                textarea.focus()
              }
            }
          }}
          {...register("content", {
            required: ts("content_required"),
          })}
          className={cn(
            "max-h-[180px] w-full border border-b",
            type !== "dashboard"
              ? "mx-2 h-[30px] resize-y overflow-hidden"
              : "m-0 h-[200px]",
          )}
          placeholder={ts("placeholder")}
        />
      </div>
      <div className="ml-auto flex gap-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="ml-auto block h-auto rounded-full px-2 py-1"
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          loading={loading}
          variant="outline"
          className="ml-auto block h-auto rounded-full px-2 py-1"
          onClick={handleSubmit(onSubmit)}
        >
          {!loading && t("submit")}
        </Button>
      </div>
    </div>
  )
}

export default EditArticleComment
