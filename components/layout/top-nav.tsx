import NextLink from "next/link"

import Logo from "@/components/logo"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import TopicListNav from "@/components/topic/topic-list-nav"
import UserMenu from "@/components/user/user-menu"
import { getSession } from "@/lib/auth/utils"
import type { LanguageType } from "@/lib/validation/language"

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

const TopNav: React.FC<TopNavProps> = async (props) => {
  const { locale } = props

  const { session } = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-center">
        <div className="mr-4 hidden md:flex">
          <NextLink
            className="mr-6 flex items-center space-x-2 font-bold"
            href="/"
          >
            <Logo />
          </NextLink>
        </div>
        <TopicListNav locale={locale} />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <UserMenu session={session} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default TopNav
