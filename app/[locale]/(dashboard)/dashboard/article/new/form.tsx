"use client"

import { useForm } from "react-hook-form"

import EditorExtended from "@/components/editor/editor-extended"

export default function CreateArticleForm() {
  const form = useForm()

  return (
    <div>
      <EditorExtended control={form.control} name="content" />
    </div>
  )
}
