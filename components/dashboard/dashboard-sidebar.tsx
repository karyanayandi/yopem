"use client"

import * as React from "react"
import NextLink from "next/link"

import LanguageSwitcher from "@/components/language-switcher"
import Sidebar from "@/components/layout/sidebar"
import SidebarItem from "@/components/layout/sidebar-item"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { logout } from "@/lib/auth/utils"
import { useI18n } from "@/lib/locales/client"

interface DashboardSidebarProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onToggle: () => void
  isOpen: boolean
  onClose: () => void
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = (props) => {
  const { onToggle, onClose, isOpen } = props

  const ref = React.useRef(null)

  useOnClickOutside(ref, onClose)

  const t = useI18n()

  return (
    <>
      <Button
        ref={ref}
        data-drawer-target="dashboard-sidebar"
        data-drawer-toggle="dashboard-sidebar"
        aria-controls="dashboard-sidebar"
        variant="ghost"
        size="icon"
        className="m-3 flex lg:hidden"
        onClick={onToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <Icon.Menu className="size-6" />
      </Button>
      <Sidebar isOpen={isOpen}>
        <div className="h-full overflow-y-auto border-r border-border bg-background px-3 py-5">
          <ul className="space-y-2">
            <SidebarItem href="/" icon={<Icon.Home />}>
              {t("home")}
            </SidebarItem>
            <SidebarItem href="/dashboard" icon={<Icon.Dashboard />}>
              {t("overview")}
            </SidebarItem>
            <SidebarItem href="/dashboard/article" icon={<Icon.Article />}>
              {t("articles")}
            </SidebarItem>
            <SidebarItem href="/dashboard/topic" icon={<Icon.Topic />}>
              {t("topics")}
            </SidebarItem>
            <SidebarItem href="/dashboard/media" icon={<Icon.Media />}>
              {t("medias")}
            </SidebarItem>
            <SidebarItem href="/dashboard/ad" icon={<Icon.Ads />}>
              {t("ads")}
            </SidebarItem>
            <SidebarItem href="/dashboard/user" icon={<Icon.User />}>
              {t("users")}
            </SidebarItem>
          </ul>
        </div>
        <div className="absolute bottom-0 left-0 z-20 flex w-full justify-center space-x-4 border-r border-border bg-background p-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button asChild variant="ghost">
            <NextLink href="/dashboard/setting">
              <Icon.Setting />
            </NextLink>
          </Button>
          <form action={logout}>
            <Button variant="ghost" size="icon">
              <Icon.Logout />
            </Button>
          </form>
        </div>
      </Sidebar>
      {isOpen && (
        <div className="z-29 fixed inset-0 bg-primary/50 bg-opacity-50 dark:bg-opacity-80"></div>
      )}
    </>
  )
}

export default DashboardSidebar
