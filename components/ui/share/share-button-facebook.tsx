import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonFacebook: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, title, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Facebook />}
      url={`https://facebook.com/sharer/sharer.php?u=${encodeURI(url)}`}
      title={title ?? "Facebook"}
      {...rest}
    />
  )
}
