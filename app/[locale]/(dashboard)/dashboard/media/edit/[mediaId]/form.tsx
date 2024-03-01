"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import Image from "@/components/image"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import type { InsertMedia } from "@/lib/db/schema/media"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { copyToClipboard } from "@/lib/utils"

interface FormValues {
  name: string
  description?: string
}

interface EditMediaProps {
  media: InsertMedia
}

export default function EditMediaForm(props: EditMediaProps) {
  const { media } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("media")

  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      name: media?.name || "",
      description: media?.description ?? "",
    },
  })

  const { mutate: updateMediaAction } = api.media.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_success") })
      router.push(`/dashboard/media`)
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
          description: ts("update_failed"),
        })
      }
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateMediaAction({ ...values, id: media.id })
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="px-2 lg:px-4">{ts("edit")}</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full p-2 lg:w-6/12 lg:p-4">
          <div className="relative h-[200px] w-full lg:h-[500px]">
            <Image
              src={media.url}
              alt={media.name}
              className="rounded-lg border-2 border-muted/30 object-cover"
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
              quality={80}
            />
          </div>
        </div>
        <div className="w-full p-2 lg:w-6/12 lg:p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormLabel>Name</FormLabel>
                <div className="relative inline-flex h-9 w-full min-w-0 max-w-sm appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2 lg:max-w-xl">
                  <p className="line-clamp-1">{media.name}</p>
                </div>
                <FormLabel>URL</FormLabel>
                <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
                  <div className="relative inline-flex h-9 w-full min-w-0 max-w-sm appearance-none items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base transition-colors duration-75 ease-out focus:bg-background focus:outline-none focus:ring-2 lg:max-w-xl">
                    <p className="line-clamp-1">{media.url}</p>
                  </div>
                  <Button
                    aria-label="Copy Link"
                    className="text-left font-normal"
                    variant="outline"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.preventDefault()
                      copyToClipboard(media.url)
                      toast({
                        variant: "success",
                        description: ts("copy_link"),
                      })
                    }}
                  >
                    <Icon.Copy aria-label="Copy Link" className="mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("description_placeholder")}
                        className="max-w-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="my-4"
                aria-label="Save"
                type="submit"
                loading={loading}
              >
                {t("save")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
