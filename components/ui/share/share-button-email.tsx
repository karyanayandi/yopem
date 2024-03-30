import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonEmail: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, subject, title, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Email />}
      title={title ?? "Email"}
      url={`mailto:?subject=${encodeURI(subject!)}&body=${encodeURI(url)}`}
      {...rest}
    />
  )
}
