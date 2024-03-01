"use client"

import type { UrlObject } from "url"
import * as React from "react"
import NextLink from "next/link"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useI18n } from "@/lib/locales/client"

interface DashboardAddNewProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string | UrlObject
}

const DashboardAddNew: React.FC<DashboardAddNewProps> = (props) => {
  const { url } = props

  const t = useI18n()

  return (
    <Button variant="ghost" asChild>
      <NextLink aria-label={t("add_new")} href={url}>
        <Icon.Add className="mr-2" />
        {t("add_new")}
      </NextLink>
    </Button>
  )
}

export default DashboardAddNew
