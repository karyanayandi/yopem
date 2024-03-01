import NextLink from "next/link"

import ThemeSwitcher from "@/components/theme/theme-switcher"
import UserMenu from "@/components/user/user-menu"
import { getSession } from "@/lib/auth/utils"

const TopNav = async () => {
  const { session } = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <NextLink
            className="mr-6 flex items-center space-x-2 font-bold"
            href="/"
          >
            Starter
          </NextLink>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <UserMenu session={session} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default TopNav
