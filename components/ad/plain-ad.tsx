import * as React from "react"

interface PlainAdProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const PlainAd: React.FunctionComponent<PlainAdProps> = (props) => {
  const { content } = props

  return <div className="my-10" dangerouslySetInnerHTML={{ __html: content }} />
}

export default PlainAd
