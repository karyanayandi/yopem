"use client"

import { api } from "@/lib/trpc/react"

export default function TestPage() {
  const { data: articles } = api.article.dashboard.useQuery({
    language: "id",
    page: 1,
    perPage: 10,
  })

  const { data: trans } = api.article.articleTranslationById.useQuery(
    "nn4FgPtBKk4hCmmR2WSmGnH863ujiI1eYvcNRpqo",
  )

  return (
    <div className="space-y-4">
      <h1>Articles</h1>
      <div>{JSON.stringify(articles, null, 2)}</div>
      <h1>Translation</h1>
      <div>{JSON.stringify(trans, null, 2)}</div>
    </div>
  )
}
