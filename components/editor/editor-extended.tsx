/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import * as React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import { useController } from "react-hook-form"

import { EditorExtension } from "./editor-extension"
import { EditorMenu } from "./editor-menu"

interface EditorExtendedProps {
  control: any
  isClear?: boolean
  name: string
}

const EditorExtended = React.memo((props: EditorExtendedProps) => {
  const { control, isClear, name } = props

  const {
    field: { value, onChange },
  } = useController({ control, name: name })

  const prevLocaleRef = React.useRef(isClear)

  React.useEffect(() => {
    const handleLocaleChange = () => {
      editor?.commands.setContent("")
    }

    if (prevLocaleRef.current !== isClear) {
      handleLocaleChange()
    }

    prevLocaleRef.current = isClear
  }, [isClear])

  const editor = useEditor({
    extensions: [EditorExtension],
    editable: true,
    autofocus: true,
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      {editor && <EditorMenu editor={editor} />}
      {editor && (
        <EditorContent className="editor-extended mb-10" editor={editor} />
      )}
      <p className="fixed bottom-0 right-0 p-2">
        {editor?.storage.characterCount.words()} words
      </p>
    </>
  )
})

export default EditorExtended
