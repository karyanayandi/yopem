import * as React from "react"
import NextLink from "next/link"

import TopicListNav from "@/components/topic/topic-list-nav"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getI18n } from "@/lib/locales/server"
import type { LanguageType } from "@/lib/validation/language"

interface MobileMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

const MobileMenu: React.FC<MobileMenuProps> = async (props) => {
  const { locale } = props

  const t = await getI18n()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Icon.Menu className="flex lg:hidden" aria-label="Mobile Menu" />
      </SheetTrigger>
      <SheetContent side="left">
        <Button asChild variant="ghost">
          <NextLink aria-label={t("home")} href="/">
            {t("home")}
          </NextLink>
        </Button>
        <TopicListNav
          className="jusitfy-start flex flex-col items-start"
          locale={locale}
        />
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
