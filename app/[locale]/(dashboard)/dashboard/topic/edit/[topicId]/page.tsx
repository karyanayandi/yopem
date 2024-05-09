import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditTopicForm = dynamicFn(
  async () => {
    const EditTopicForm = await import("./form")
    return EditTopicForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { topicId: string; locale: LanguageType }
}): Promise<Metadata> {
  const { topicId, locale } = params

  const topic = await api.topic.byId(topicId)

  return {
    title: "Edit Topic Dashboard",
    description: "Edit Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/edit/${topic?.id}/`,
    },
    openGraph: {
      title: "Edit Topic Dashboard",
      description: "Edit Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/edit/${topic?.id}`,
      locale: locale,
    },
  }
}

interface EditTopicDashboardProps {
  params: { topicId: string }
}

export default async function EditTopicDashboard(
  props: EditTopicDashboardProps,
) {
  const { params } = props

  const { topicId } = params

  const topic = await api.topic.byId(topicId)

  if (!topic) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditTopicForm topic={topic} />
      </div>
    </div>
  )
}
