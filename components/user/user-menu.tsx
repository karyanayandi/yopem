"use client"

import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { logout, type AuthSession } from "@/lib/auth/utils"
import { useI18n } from "@/lib/locales/client"

export interface UserMenuProps {
  session: AuthSession["session"] | null
}

const UserMenu: React.FunctionComponent<UserMenuProps> = (props) => {
  const { session } = props

  const t = useI18n()

  const user = session?.user

  const itemClass =
    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:text-foreground/90"

  return (
    <>
      {user ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User Menu">
              <Image
                src={user.image!}
                alt={user.name!}
                className="!relative m-0 !size-5 rounded-full"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background">
            <NextLink
              aria-label={t("profile")}
              href={`/user/${user.username}`}
              className={itemClass}
            >
              <Icon.User className="mr-2 h-5 w-5" />
              &nbsp;{t("profile")}
            </NextLink>
            <NextLink
              aria-label={t("setting")}
              href="/setting"
              className={itemClass}
            >
              <Icon.Setting className="mr-2 h-5 w-5" />
              &nbsp;{t("setting")}
            </NextLink>
            {user.role === "admin" && (
              <NextLink
                aria-label={t("dashboard")}
                href="/dashboard"
                className={itemClass}
              >
                <Icon.Dashboard className="mr-2 h-5 w-5" />
                &nbsp;{t("dashboard")}
              </NextLink>
            )}
            <div className="my-2">
              <form action={logout}>
                <button className={itemClass} aria-label={t("logout")}>
                  <Icon.Logout className="mr-2" />
                  {t("logout")}
                </button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <NextLink aria-label="Login" href="/auth/login" className={itemClass}>
          <Icon.Login />
        </NextLink>
      )}
    </>
  )
}

export default UserMenu
