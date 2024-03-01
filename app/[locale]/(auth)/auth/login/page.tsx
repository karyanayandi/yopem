import NextLink from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { getSession } from "@/lib/auth/utils"
import { getScopedI18n } from "@/lib/locales/server"

export default async function Page() {
  const ts = await getScopedI18n("user")

  const { session } = await getSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <Button
        asChild
        aria-label="Back to Home"
        variant="outline"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <NextLink href="/">
          <Icon.ChevronLeft className="mr-2 h-4 w-4" />
          {ts("back_to_home")}
        </NextLink>
      </Button>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">{ts("welcome_back")}</h1>
        </div>
        <p className="p-5 text-center">{ts("header")}</p>
        <div className="flex items-center justify-center">
          <Button asChild variant="outline">
            <NextLink href="/auth/login/google">
              <Icon.GoogleColored className="mr-2" />
              {ts("login_with_google")}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
