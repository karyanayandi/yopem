"use client"

import { mergeAttributes, Node, type Editor } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { FacebookEmbed } from "react-social-media-embed"

export const EditorFacebookEmbed = Node.create({
  name: "reactFacebookEmbed",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "react-facebook-embed",
      },
    ]
  },
  addAttributes() {
    return {
      facebookUrl: {
        default: "",
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ["react-facebook-embed", mergeAttributes(HTMLAttributes), 1]
  },
  addNodeView() {
    return ReactNodeViewRenderer(FacebookEmbedWrapper)
  },
})

interface FacebookEmbedWrapperProps {
  node: { attrs: { facebookUrl: string } }
  editor: Editor
}

const FacebookEmbedWrapper = (props: FacebookEmbedWrapperProps) => {
  const { node, editor } = props
  const handleClick = () => {
    editor.chain().focus().run()
  }

  return (
    <NodeViewWrapper
      onClick={handleClick}
      className="pointer-events-none max-w-[calc(101%-10px)]"
    >
      <FacebookEmbed
        placeholderDisabled
        url={node.attrs.facebookUrl}
        width="76%"
      />
    </NodeViewWrapper>
  )
}
