//TODO: handle delete and edit comment button for every user

"use client"

import * as React from "react"
import NextLink from "next/link"
import { useForm, type SubmitHandler } from "react-hook-form"

import Image from "@/components/image"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import type { AuthSession } from "@/lib/auth/utils"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"
import DeleteArticleCommentButton from "./delete-article-comment-button"
import EditArticleComment from "./edit-article-comment"
import ReplyArticleComment from "./reply-article-comment"

interface ArticleCommentFormProps extends React.HTMLAttributes<HTMLDivElement> {
  articleId: string
  session: AuthSession["session"]
}

interface FormValues {
  content: string
  id: string
}

const ArticleComment: React.FunctionComponent<ArticleCommentFormProps> = (
  props,
) => {
  const { articleId, session } = props

  const [openDeleteAction, setOpenDeleteAction] = React.useState<string | null>(
    null,
  )
  const [edited, setEdited] = React.useState("")
  const [replied, setReplied] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const t = useI18n()
  const ts = useScopedI18n("comment")

  const user = session?.user

  const { data: commentCount, refetch } =
    api.articleComment.countByArticleId.useQuery(articleId)

  const {
    data: articleComments,
    fetchNextPage,
    hasNextPage,
    refetch: updateComment,
  } = api.articleComment.byArticleIdInfinite.useInfiniteQuery(
    {
      articleId: articleId,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: null,
    },
  )

  const { register, handleSubmit, reset } = useForm<FormValues>()
  const { mutate: createComment } = api.articleComment.create.useMutation({
    onSuccess: () => {
      const textarea = document.querySelector("textarea")
      if (textarea) {
        textarea.style.height = "30px"
      }
      updateComment()
      reset()
      refetch()
      toast({
        variant: "success",
        description: ts("create_success"),
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
          description: ts("create_failed"),
        })
      }
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setLoading(true)
    createComment({
      articleId,
      content: values.content,
    })
    setLoading(false)
  }

  const { mutate: deleteArticleCommentAction } =
    api.articleComment.delete.useMutation({
      onSuccess: () => {
        updateComment()
        refetch()
        toast({
          variant: "success",
          description: "",
        })
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

  function handleDeleteComment(comment_id: string) {
    deleteArticleCommentAction(comment_id)
  }

  return (
    <>
      <div aria-label="comment" className="block w-full bg-background">
        <div className="mb-4 flex justify-between">
          <span className="inline-flex items-center text-lg font-bold text-foreground md:text-2xl">
            {t("comments")}&nbsp;({commentCount ?? 0})
          </span>
        </div>
        {user ? (
          <form className="mb-5 mt-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                {user?.image ? (
                  <Image
                    fill
                    src={user?.image}
                    alt={user?.name!}
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  <Icon.User className="h-10 w-10" />
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
                <Button
                  loading={loading}
                  variant="outline"
                  className="ml-auto block h-auto rounded-full"
                  onClick={handleSubmit(onSubmit)}
                >
                  {!loading && t("submit")}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="my-8 flex items-center justify-center">
            <NextLink aria-label={ts("auth")} href="/auth/login">
              <Button>{ts("auth")}</Button>
            </NextLink>
          </div>
        )}
        <ul className="mt-4 flex flex-col gap-3">
          {articleComments?.pages.map((page, i) => {
            return page.articleComments.map((comment) => {
              return (
                <div key={`${i}_article_comments`}>
                  <li className="relative flex flex-col" key={comment.id}>
                    <div className="flex justify-between">
                      <figcaption className="mb-2 flex flex-1 items-start justify-start gap-2 md:gap-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                          {comment?.author?.image ? (
                            <Image
                              fill
                              src={comment?.author?.image}
                              alt={comment?.author?.name!}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <Icon.User className="h-10 w-10" />
                          )}
                        </div>
                        {edited !== comment.id ? (
                          <div className="flex flex-1 flex-col items-start gap-2">
                            <div className="flex items-center gap-1">
                              <div className="text-[13px] font-bold">
                                {comment?.author?.name}
                              </div>
                              <div className="text-xs text-foreground">
                                {formatDate(comment.createdAt, "LL")}
                              </div>
                            </div>
                            <span className="text-sm">{comment.content}</span>
                            <div>
                              <Button
                                onClick={() => setReplied(comment.id!)}
                                variant="ghost"
                                className="h-8 w-8 rounded-full p-1 md:h-auto md:w-auto md:px-2 md:py-1"
                              >
                                <span className="block md:hidden">
                                  <Icon.Comment />
                                </span>
                                <span className="hidden text-xs md:block">
                                  {t("reply")}
                                </span>
                              </Button>
                            </div>
                            <div className="w-full">
                              {replied === comment?.id ? (
                                <ReplyArticleComment
                                  articleId={articleId ?? ""}
                                  replyToId={comment?.id ?? ""}
                                  avatar={user?.image}
                                  username={user?.username}
                                  onSuccess={() => {
                                    refetch()
                                    updateComment()
                                    setReplied("")
                                  }}
                                  onCancel={() => setReplied("")}
                                />
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <EditArticleComment
                            id={comment.id}
                            onCancel={() => setEdited("")}
                            onSuccess={() => {
                              setEdited("")
                              updateComment()
                            }}
                            content={comment.content ?? ""}
                          />
                        )}
                      </figcaption>
                      {!edited && user?.role === "admin" ? (
                        <Popover
                          open={openDeleteAction === comment.id!}
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              setOpenDeleteAction(null)
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              size="icon"
                              onClick={() => setOpenDeleteAction(comment.id!)}
                              variant="ghost"
                            >
                              <Icon.MoreVertical />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex w-[min-content] p-0">
                            <div className="divide-y divide-muted/50">
                              <div className="flex flex-col py-1 text-sm text-foreground">
                                <Button
                                  variant="ghost"
                                  className="h-auto justify-start"
                                  onClick={() => {
                                    handleDeleteComment(comment.id!)
                                    setOpenDeleteAction("")
                                  }}
                                >
                                  <Icon.Delete className="mr-1" />
                                  {t("delete")}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setEdited(comment.id!)
                                    setOpenDeleteAction(null)
                                  }}
                                  variant="ghost"
                                  className="h-auto justify-start"
                                >
                                  <Icon.Edit className="mr-1" />
                                  {t("edit")}
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : null}
                    </div>
                  </li>
                  {comment?.replies?.map((reply) => {
                    return (
                      <li
                        className="relative ml-12 flex flex-col md:ml-14"
                        key={reply.id}
                      >
                        <div className="flex justify-between">
                          <figcaption className="mb-2 flex flex-1 items-start justify-start gap-2 md:gap-4">
                            <div className="relative h-4 w-4 overflow-hidden rounded-full bg-muted md:h-8 md:w-8">
                              {reply?.author?.image ? (
                                <Image
                                  fill
                                  src={reply?.author?.image}
                                  alt={reply?.author?.name!}
                                  className="object-cover"
                                />
                              ) : (
                                <Icon.User className="h-6 w-6 md:h-10 md:w-10" />
                              )}
                            </div>
                            {edited !== reply.id ? (
                              <div className="flex flex-1 flex-col items-start gap-2">
                                <div className="flex items-center gap-1">
                                  <div className="text-[13px] font-bold">
                                    {reply?.author?.name}
                                  </div>
                                  <div className="text-xs text-foreground">
                                    {formatDate(reply.createdAt, "LL")}
                                  </div>
                                </div>
                                <span className="text-sm">{reply.content}</span>
                              </div>
                            ) : (
                              <EditArticleComment
                                id={reply.id}
                                onCancel={() => setEdited("")}
                                onSuccess={() => {
                                  setEdited("")
                                  updateComment()
                                }}
                                content={reply.content ?? ""}
                              />
                            )}
                          </figcaption>
                          {!edited && user?.role === "admin" ? (
                            <Popover
                              open={openDeleteAction === reply.id!}
                              onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                  setOpenDeleteAction(null)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  size="icon"
                                  onClick={() => setOpenDeleteAction(reply.id!)}
                                  variant="ghost"
                                >
                                  <Icon.MoreVertical />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="flex w-[min-content] p-0">
                                <div className="divide-y divide-muted/50">
                                  <div className="flex flex-col py-1 text-sm text-foreground">
                                    <DeleteArticleCommentButton
                                      description={ts("delete_description")}
                                      action={() => {
                                        handleDeleteComment(reply.id!)
                                        setOpenDeleteAction("")
                                      }}
                                    />
                                    <Button
                                      onClick={() => {
                                        setEdited(reply.id!)
                                        setOpenDeleteAction(null)
                                      }}
                                      variant="ghost"
                                      className="h-auto justify-start"
                                    >
                                      <Icon.Edit className="mr-1" />
                                      {t("edit")}
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </div>
              )
            })
          })}
        </ul>
        {hasNextPage ? (
          <Button
            onClick={() => {
              fetchNextPage()
            }}
            type="button"
            className="mt-2 w-full"
          >
            {t("load_more")}
          </Button>
        ) : null}
      </div>
    </>
  )
}

export default ArticleComment
