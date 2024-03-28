"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast/use-toast"
import type { InsertUser } from "@/lib/db/schema/user"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"
import type { UserRole } from "@/lib/validation/user"

interface FormValues {
  id: string
  username: string
  name: string
  phoneNumber?: string
  about?: string
  metaTitle?: string
  metaDescription?: string
  role: UserRole
}

interface EditUserFormProps {
  user: InsertUser
}

export const EditUserForm: React.FunctionComponent<EditUserFormProps> = (
  props,
) => {
  const { user } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("user")

  const router = useRouter()

  const { mutate: updateUserByAdmin } = api.user.updateByAdmin.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_success") })
      router.push("/dashboard/user")
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
      id: user?.id,
      username: user?.username ?? "",
      name: user?.name ?? "",
      about: user?.about ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      role: user?.role ?? "user",
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateUserByAdmin(values)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="px-2 lg:px-4">{ts("edit")}</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full p-2 lg:w-4/12">
          <div className="flex w-full flex-col items-center justify-center lg:flex-row">
            <div className="w-ful lg:w-3/12">
              <Image
                src={user.image!}
                alt={user.name!}
                className="!relative !h-28 !w-28 rounded-full border-2 border-muted object-cover"
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
                name="name"
                rules={{
                  required: ts("validation_name_required"),
                  minLength: { value: 1, message: ts("validation_name_min") },
                  maxLength: { value: 64, message: ts("validation_name_max") },
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
                name="username"
                rules={{
                  required: ts("validation_username_required"),
                  pattern: {
                    value: /^[a-z0-9]{3,16}$/i,
                    message: ts("validation_username_pattern"),
                  },
                  minLength: {
                    value: 3,
                    message: ts("validation_username_min"),
                  },
                  maxLength: {
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
                name="phoneNumber"
                rules={{
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: ts("validation_phone_number_pattern"),
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
                name="role"
                rules={{
                  required: ts("validation_role_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("role")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={ts("role_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>{ts("about")}</FormLabel>
                <TextEditor control={form.control} name="about" />
                <Button
                  aria-label={t("submit")}
                  type="submit"
                  loading={loading}
                >
                  {t("submit")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
