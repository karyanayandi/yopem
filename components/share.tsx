import * as React from "react"

import {
  ShareButtonFacebook,
  ShareButtonWhatsApp,
  ShareButtonX,
} from "@/components/ui/share"
import { getI18n } from "@/lib/locales/server"
import CopyLinkButon from "./copy-link-button"

interface ShareProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  text: string
}

const Share: React.FunctionComponent<ShareProps> = async (props) => {
  const { text, url } = props

  const t = await getI18n()

  return (
    <div className="my-4">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-lg font-semibold">{t("share")}</span>
        </div>
        <div className="flex flex-row">
          <ShareButtonFacebook url={url} />
          <ShareButtonX url={url} text={text} />
          <ShareButtonWhatsApp url={url} text={text} />
          <CopyLinkButon url={url} />
        </div>
      </div>
    </div>
  )
}

export default Share
