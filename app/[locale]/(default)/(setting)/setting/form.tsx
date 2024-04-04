"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import Image from "@/components/image"
import TextEditor from "@/components/text-editor/text-editor"
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
import { toast } from "@/components/ui/toast/use-toast"
import type { InsertUser } from "@/lib/db/schema/user"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"
import type { UpdateUserSchema } from "@/lib/validation/user"

interface UserSettingFormProps {
  user: Omit<InsertUser, "role">
}

const UserSettingForm: React.FunctionComponent<UserSettingFormProps> = (
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
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full p-2 lg:w-4/12">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-ful lg:w-3/12">
              <Image
                src={user.image!}
                alt={user.name!}
                className="!size-18 !relative rounded-full border-2 border-muted object-cover"
                fill
                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                quality={80}
              />
            </div>
            <div className="w-full lg:w-9/12">
              <p className="text-base font-semibold lg:text-xl">{user.name}</p>
              <p className="text-xs lg:text-sm">{user.email}</p>
              <p className="text-xs lg:text-sm">
                Joined {formatDate(user.createdAt!, "LL")}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full p-2 lg:w-8/12">
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
                      <Input
                        placeholder={ts("username_placeholder")}
                        {...field}
                      />
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
              <div className="space-y-2">
                <FormLabel>{ts("about")}</FormLabel>
                <TextEditor control={form.control} name="about" />
              </div>
              <Button aria-label="Save" type="submit" loading={loading}>
                {t("save")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UserSettingForm
