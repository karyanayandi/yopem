"use client"

import { mergeAttributes, Node, type Editor as TextEditor } from "@tiptap/core"
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react"
import type { VariantProps } from "class-variance-authority"

import { Button, type buttonVariants } from "@/components/ui/button"

export const TextEditorButton = Node.create({
  name: "textEditorButton",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "text-editor-button",
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
    return ["text-editor-button", mergeAttributes(HTMLAttributes), 1]
  },
  addNodeView() {
    return ReactNodeViewRenderer(TextEditorButtonWrapper)
  },
})

interface TextEditorButtonWrapperProps {
  node: { attrs: VariantProps<typeof buttonVariants> }
  editor: TextEditor
}

const TextEditorButtonWrapper = (props: TextEditorButtonWrapperProps) => {
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
