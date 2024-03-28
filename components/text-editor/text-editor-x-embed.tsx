"use client"

import { mergeAttributes, Node, type Editor as TextEditor } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { XEmbed } from "react-social-media-embed"

export const TextEditorXEmbed = Node.create({
  name: "textEditorXEmbed",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "text-editor-x-embed",
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
    return ["text-editor-x-embed", mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return ReactNodeViewRenderer(TextEditorXEmbedWrapper)
  },
})

interface TextEditorXEmbedWrapperProps {
  node: { attrs: { tweetUrl: string } }
  editor: TextEditor
}

const TextEditorXEmbedWrapper = (props: TextEditorXEmbedWrapperProps) => {
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
