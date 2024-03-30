import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

interface ShareButtonWhatsAppProps extends ShareButtonProps {
  text: string
}

export const ShareButtonWhatsApp: React.FunctionComponent<
  ShareButtonWhatsAppProps
> = (props) => {
  const { url, onClick, title, text, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.WhatsApp />}
      title={title ?? "WhatsApp"}
      url={"whatsapp://send?text=" + encodeURI(text) + "%20" + encodeURI(url)}
      {...rest}
    />
  )
}
