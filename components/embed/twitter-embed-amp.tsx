import * as React from "react"

interface TwitterEmbedAMPProps {
  children: React.ReactNode
}

const TwitterEmbedAMP = ({ children }: TwitterEmbedAMPProps) => {
  const regex = /^https?:\/\/twitter\.com\/\w+\/status\/(\d+).*$/
  const modifiedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      child.type === "a" &&
      child?.props?.href?.match(regex)
    ) {
      const { href } = child.props
      const match = href.match(regex)
      if (match?.[1]) {
        return <span data-tweetid={match?.[1]}></span>
      }

      return
    }
    return
  })

  return <>{modifiedChildren}</>
}

export default TwitterEmbedAMP
