import * as React from "react"
import { Parser, ProcessNodeDefinitions } from "html-to-react"

import TwitterEmbedAMP from "@/components/embed/twitter-embed-amp"

const htmlToReactParser = Parser()

const processNodeDefinitions = ProcessNodeDefinitions()

interface Node {
  name?: string
  attribs?: {
    href?: string
    src?: string
    className?: string
    title?: string
    class?: string
    width?: string
    height?: string
    tweeturl?: string
    facebookurl?: string
    variant?:
      | "link"
      | "default"
      | "success"
      | "info"
      | "warning"
      | "danger"
      | "outline"
      | "secondary"
      | "ghost"
    [x: string]: unknown
  }
}

interface TransformContentAMPProps {
  htmlInput: string
  title: string
}

const TransformContentAMP: React.FC<TransformContentAMPProps> = (props) => {
  const { htmlInput, title } = props

  const processingInstructions = [
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "blockquote"
      },
      processNode: function (
        node: Node,
        children: React.ReactNode[],
        index: number,
      ) {
        if (node.attribs) {
          node.attribs.style = undefined
        }
        if (node.attribs?.class?.includes("twitter-tweet")) {
          return (
            <TwitterEmbedAMP key={index + title + "blockquote"}>
              {children}
            </TwitterEmbedAMP>
          )
        }

        return (
          <blockquote
            style={{ width: "auto", margin: "auto" }}
            key={index + title + "blockquote"}
            className={node.attribs?.class}
          >
            {children}
          </blockquote>
        )
      },
    },
    {
      shouldProcessNode: function () {
        return true
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ]
  return htmlToReactParser.parseWithInstructions(
    htmlInput,
    () => true,
    processingInstructions,
  )
}

export default TransformContentAMP
