import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

interface ShareButtonXProps extends ShareButtonProps {
  text: string
}

export const ShareButtonX: React.FunctionComponent<ShareButtonXProps> = (
  props,
) => {
  const { url, onClick, text, title, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.X />}
      title={title ?? "X"}
      url={`https://twitter.com/intent/tweet/?text=${encodeURI(
        text,
      )}&url=${encodeURI(url)}`}
      {...rest}
    />
  )
}
