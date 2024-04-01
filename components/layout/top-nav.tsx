import NextLink from "next/link"

import Logo from "@/components/logo"
import TopicListNav from "@/components/topic/topic-list-nav"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/user/user-menu"
import { getSession } from "@/lib/auth/utils"
import { getI18n } from "@/lib/locales/server"
import type { LanguageType } from "@/lib/validation/language"
import MobileMenu from "./mobile-menu"
import SearchTopNav from "./search-top-nav"

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

const TopNav: React.FC<TopNavProps> = async (props) => {
  const { locale } = props

  const t = await getI18n()
  const { session } = await getSession()

  return (
    <nav className="opacity-1 fixed left-auto top-0 z-40 -my-0 mx-auto box-border flex h-16 w-full items-center border-b border-border/40 bg-background/95 bg-clip-padding px-4 py-0 align-baseline shadow-sm outline-none backdrop-blur backdrop-filter supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-row items-center justify-between">
        <MobileMenu locale={locale} />
        <div className="flex flex-row">
          <NextLink
            aria-label="Home"
            href="/"
            className="flex items-center text-foreground"
          >
            <Logo />
          </NextLink>
          <div className="ml-4 hidden lg:flex">
            <Button asChild variant="ghost">
              <NextLink aria-label={t("home")} href="/">
                {t("home")}
              </NextLink>
            </Button>
            <TopicListNav locale={locale} />
          </div>
        </div>
        <div className="flex justify-center">
          <UserMenu session={session} />
          <SearchTopNav locale={locale} />
        </div>
      </div>
    </nav>
  )
}

export default TopNav
