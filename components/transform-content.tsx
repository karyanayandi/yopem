import * as React from "react"
import NextLink from "next/link"
import { Parser, ProcessNodeDefinitions } from "html-to-react"

import YoutubeEmbed from "@/components/embed/youtube-embed"
import Image from "@/components/image"

const htmlToReactParser = Parser()

const processNodeDefinitions = ProcessNodeDefinitions()

interface Node {
  name?: string
  attribs?: {
    href?: string
    src?: string
    className?: string
    title?: string
  }
}

interface TransformContentProps {
  htmlInput: string
  title: string
}

const TransformContent: React.FunctionComponent<TransformContentProps> = (
  props,
) => {
  const { htmlInput, title } = props

  const processingInstructions = [
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "a"
      },
      processNode: function (
        node: Node,
        children: React.ReactNode[],
        index: number,
      ) {
        return (
          <NextLink href={node.attribs?.href ?? "#"} key={index}>
            {children}
          </NextLink>
        )
      },
    },
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "img"
      },
      processNode: function (node: Node) {
        return (
          <Image
            className={node.attribs?.className}
            src={node.attribs?.src ?? ""}
            alt={title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
          />
        )
      },
    },
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "iframe"
      },
      processNode: function (node: Node) {
        if (node.attribs?.src?.includes("youtube.com/embed")) {
          const arr = node.attribs?.src?.split(
            /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm,
          )

          return (
            <YoutubeEmbed
              title={node.attribs?.title ?? title}
              id={arr[3] ?? arr[0]!}
              wrapperClass="yt-lite"
            />
          )
        }
        return <iframe title={title} {...node.attribs} />
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

export default TransformContent
