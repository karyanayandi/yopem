import * as React from "react"

import type { SelectAd } from "@/lib/db/schema/ad"
import Adsense from "./adsense"
import PlainAd from "./plain-ad"

export interface AdProps extends React.HTMLAttributes<HTMLDivElement> {
  ad: SelectAd
}

const Ad: React.FunctionComponent<AdProps> = (props) => {
  const { ad } = props

  return (
    <div>
      {ad.type === "plain_ad" ? (
        <PlainAd content={ad.content} />
      ) : (
        <Adsense content={ad.content} id={ad.id} />
      )}
    </div>
  )
}

export default Ad
