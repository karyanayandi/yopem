"use client"

import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

import Image from "@/components/image"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  content: string
}

interface ReplyArticleCommentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  articleId: string
  replyToId: string
  onSuccess: () => void
  avatar?: string | null
  username?: string
  onCancel: () => void
}

const ReplyArticleComment: React.FunctionComponent<ReplyArticleCommentProps> = (
  props,
) => {
  const { articleId, onSuccess, avatar, username, replyToId, onCancel } = props

  const t = useI18n()
  const ts = useScopedI18n("comment")

  const [loading, setLoading] = React.useState<boolean>(false)

  const { register, handleSubmit, reset } = useForm<FormValues>()
  const { mutate: createComment } = api.articleComment.create.useMutation({
    onSuccess: () => {
      const textarea = document.querySelector("textarea")
      if (textarea) {
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
    createComment({
      articleId: articleId,
      content: values.content,
      replyToId: replyToId,
    })

    setLoading(false)
  }

  return (
    <form
      className="fade-up-element mb-5 mt-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex">
        <div className="relative h-6 w-6 overflow-hidden rounded-full bg-muted md:h-10 md:w-10">
          {avatar ? (
            <Image fill src={avatar} alt={username!} className="object-cover" />
          ) : (
            <Icon.User className="h-6 w-6 md:h-10 md:w-10" />
          )}
        </div>
        <div className="ml-1 flex w-full flex-1 flex-col items-center">
          <div className="mx-3 mb-2 w-full border-b border-border">
            <Textarea
              variant="plain"
              onInput={(event) => {
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
              }}
              {...register("content", {
                required: ts("content_required"),
              })}
              className="mx-2 h-[30px] max-h-[180px] w-full resize-none overflow-hidden border border-b"
              placeholder={ts("placeholder")}
            />
          </div>
          <div className="ml-auto flex gap-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="ml-auto block h-auto rounded-full px-2 py-1"
            >
              {t("cancel")}
            </Button>
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
      </div>
    </form>
  )
}

export default ReplyArticleComment
