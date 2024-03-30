"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { copyToClipboard } from "@/lib/utils"

interface CopyLinkButonProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

const CopyLinkButon: React.FunctionComponent<CopyLinkButonProps> = (props) => {
  const { url } = props

  const ts = useScopedI18n("article")

  return (
    <Button
      size="icon"
      aria-label="Copy Link"
      variant="ghost"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: ts("copy_link"),
        })
      }}
    >
      <Icon.Copy />
    </Button>
  )
}

export default CopyLinkButon
