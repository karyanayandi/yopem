"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import type { InsertAd } from "@/lib/db/schema/ad"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { AdPosition, AdType } from "@/lib/validation/ad"

interface FormValues {
  id: string
  title: string
  content: string
  position: AdPosition
  type: AdType
  active: boolean
}

interface EditAdFormProps {
  ad: InsertAd
}

export default function EditAdForm(props: EditAdFormProps) {
  const { ad } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("ad")

  const { mutate: updateAd } = api.ad.update.useMutation({
    onSuccess: () => {
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

  const form = useForm<FormValues>({
    defaultValues: {
      id: ad.id,
      title: ad?.title ?? "",
      content: ad?.content ?? "",
      position: ad?.position ?? "home_below_header",
      type: ad?.type ?? "plain_ad",
      active: ad?.active ?? false,
    },
  })

  const adType = form.watch("type")

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateAd(values)
    setLoading(false)
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="pb-2 lg:pb-5">{ts("add")}</h1>
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{
                required: t("title_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("title_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              rules={{
                required: ts("type_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ts("type_placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="adsense">Adsense</SelectItem>
                      <SelectItem value="plain_ad">Plain Ad</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {adType !== "adsense" ? (
              <FormField
                control={form.control}
                name="content"
                rules={{
                  required: ts("content_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("content")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={ts("content_script_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="content"
                rules={{
                  required: ts("content_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("content")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ts("content_adsense_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="position"
              rules={{
                required: ts("position_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("position")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ts("position_placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home_below_header">
                        Home (Below Header)
                      </SelectItem>
                      <SelectItem value="article_below_header">
                        Article (Below Header)
                      </SelectItem>
                      <SelectItem value="topic_below_header">
                        Topic (Below Header)
                      </SelectItem>
                      <SelectItem value="single_article_above_content">
                        Single Article (Above Content)
                      </SelectItem>
                      <SelectItem value="single_article_middle_content">
                        Single Article (Middle Content)
                      </SelectItem>
                      <SelectItem value="single_article_below_content">
                        Single Article (Below Content)
                      </SelectItem>
                      <SelectItem value="single_article_pop_up">
                        Single Article (Pop Up)
                      </SelectItem>
                      <SelectItem value="article_below_header_amp">
                        Article (AMP Below Header)
                      </SelectItem>
                      <SelectItem value="single_article_above_content_amp">
                        Single Article (AMP Above Content)
                      </SelectItem>
                      <SelectItem value="single_article_middle_content_amp">
                        Single Article (AMP Middle Content)
                      </SelectItem>
                      <SelectItem value="single_article_below_content_amp">
                        Single Article (AMP Below Content)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("active")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button aria-label="Submit" type="submit" loading={loading}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
