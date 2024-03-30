import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

interface ShareButtonPinterestProps extends ShareButtonProps {
  text: string
}

export const ShareButtonPinterest: React.FunctionComponent<
  ShareButtonPinterestProps
> = (props) => {
  const { url, onClick, title, text, mediaSrc, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Pinterest />}
      title={title ?? "Pinterest"}
      url={`https://pinterest.com/pin/create/button/?url=${encodeURI(
        url,
      )}&media=${encodeURI(mediaSrc!)}&description=${encodeURI(text)}`}
      {...rest}
    />
  )
}
