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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { UpdateUserSchema } from "@/lib/validation/user"

interface UserSettingFormProps {
  user: UpdateUserSchema
}

export const UserSettingForm: React.FunctionComponent<UserSettingFormProps> = (
  props,
) => {
  const { user } = props

  const t = useI18n()
  const ts = useScopedI18n("user")

  const [loading, setLoading] = React.useState<boolean>(false)

  const { mutate: updateUser } = api.user.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_profile_success") })
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
          description: ts("update_profile_failed"),
        })
      }
    },
  })

  interface FormValues {
    id: string
    username: string
    name: string
    phoneNumber?: string
    about?: string
  }

  const form = useForm<FormValues>({
    defaultValues: {
      id: user?.id!,
      username: user?.username ?? "",
      name: user?.name! ?? "",
      about: user?.about ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  })

  const onSubmit = (values: UpdateUserSchema) => {
    setLoading(true)
    updateUser(values)
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-sm border border-border p-5 lg:p-10"
      >
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: ts("validation_username_required"),
            pattern: {
              value: /^[a-z0-9]{3,16}$/i,
              message: ts("validation_username_pattern"),
            },
            min: {
              value: 3,
              message: ts("validation_username_min"),
            },
            max: {
              value: 20,
              message: ts("validation_username_max"),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ts("username")}</FormLabel>
              <FormControl>
                <Input placeholder={ts("username_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: ts("validation_name_required"),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ts("name")}</FormLabel>
              <FormControl>
                <Input placeholder={ts("name_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: ts("validation_phone_number_pattern"),
            },
            min: {
              value: 9,
              message: ts("validation_phone_number_min"),
            },
            max: {
              value: 16,
              message: ts("validation_phone_number_max"),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ts("phone_number")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={ts("phone_number_placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ts("about")}</FormLabel>
              <FormControl>
                <Textarea placeholder={ts("about_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button aria-label="Save" type="submit" loading={loading}>
          {t("save")}
        </Button>
      </form>
    </Form>
  )
}
