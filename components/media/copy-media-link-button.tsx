"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { copyToClipboard } from "@/lib/utils"

interface CopyMediaLinkButton {
  url: string
}

const CopyMediaLinkButton: React.FunctionComponent<CopyMediaLinkButton> = (
  props,
) => {
  const { url } = props

  const ts = useScopedI18n("media")

  return (
    <Button
      aria-label="Copy Media Link"
      size="icon"
      className="absolute z-20 ml-8 h-[30px] w-[30px] rounded-full"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: ts("copy_link"),
        })
      }}
    >
      <Icon.Copy aria-label="Copy Media Link" />
    </Button>
  )
}

export default CopyMediaLinkButton
