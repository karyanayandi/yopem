"use client"

import { mergeAttributes, Node, type Editor } from "@tiptap/core"
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react"
import type { VariantProps } from "class-variance-authority"

import { Button, type buttonVariants } from "@/components/ui/button"

export const EditorButton = Node.create({
  name: "reactButton",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "react-button",
      },
    ]
  },
  addAttributes() {
    return {
      variant: {
        default: "outline",
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ["react-button", mergeAttributes(HTMLAttributes), 1]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ButtonWrapper)
  },
})

interface ButtonWrapperProps {
  node: { attrs: VariantProps<typeof buttonVariants> }
  editor: Editor
}

const ButtonWrapper = (props: ButtonWrapperProps) => {
  const { node, editor } = props
  const handleClick = () => {
    editor.chain().focus().run()
  }

  return (
    <NodeViewWrapper onClick={handleClick}>
      <Button
        type="button"
        className="pointer-events-none cursor-auto"
        variant={node.attrs.variant}
      >
        <NodeViewContent />
      </Button>
    </NodeViewWrapper>
  )
}
