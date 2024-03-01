"use client"

import { mergeAttributes, Node, type Editor } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { XEmbed } from "react-social-media-embed"

export const EditorXEmbed = Node.create({
  name: "reactXEmbed",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "react-x-embed",
      },
    ]
  },
  addAttributes() {
    return {
      tweetUrl: {
        default: "",
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ["react-x-embed", mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return ReactNodeViewRenderer(XEmbedWrapper)
  },
})

interface XEmbedWrapperProps {
  node: { attrs: { tweetUrl: string } }
  editor: Editor
}

const XEmbedWrapper = (props: XEmbedWrapperProps) => {
  const { node, editor } = props

  const handleClick = () => {
    editor.chain().focus().run()
  }

  return (
    <NodeViewWrapper
      className="pointer-events-none max-w-[calc(100%-10px)]"
      onClick={handleClick}
    >
      <XEmbed placeholderDisabled url={node.attrs.tweetUrl} />
    </NodeViewWrapper>
  )
}
