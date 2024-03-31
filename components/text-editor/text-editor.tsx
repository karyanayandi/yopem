// TODO: styling link and youtube prompt

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import * as React from "react"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import {
  EditorContent as TextEditorContent,
  useEditor as useTextEditor,
} from "@tiptap/react"
import { useController } from "react-hook-form"

interface TextEditorProps {
  control: any
  isClear?: boolean
  name: string
}

const TextEditor = React.memo((props: TextEditorProps) => {
  const { control, isClear, name } = props

  const {
    field: { value, onChange },
  } = useController({ control, name: name })

  const prevLocaleRef = React.useRef(isClear)

  const editor = useTextEditor({
    editable: true,
    autofocus: true,
    content: value,
    extensions: [Document, Paragraph, Text],
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  React.useEffect(() => {
    const handleLocaleChange = () => {
      editor?.commands.setContent("")
    }

    if (prevLocaleRef.current !== isClear) {
      handleLocaleChange()
    }

    prevLocaleRef.current = isClear
  }, [isClear, editor?.commands])

  if (!editor) {
    return null
  }

  return (
    <>
      {editor && (
        <TextEditorContent
          className="text-editor flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          editor={editor}
        />
      )}
    </>
  )
})

export default TextEditor
