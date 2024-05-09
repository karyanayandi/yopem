import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditAdForm = dynamicFn(
  async () => {
    const EditAdForm = await import("./form")
    return EditAdForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { adId: string; locale: LanguageType }
}): Promise<Metadata> {
  const { adId, locale } = params

  const ad = await api.ad.byId(adId)

  return {
    title: "Edit Ad Dashboard",
    description: "Edit Ad Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${ad?.id}/`,
    },
    openGraph: {
      title: "Edit Ad Dashboard",
      description: "Edit Ad Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${ad?.id}`,
      locale: locale,
    },
  }
}

interface EditAdDashboardProps {
  params: { adId: string }
}

export default async function EditAdDashboard(props: EditAdDashboardProps) {
  const { params } = props

  const { adId } = params

  const ad = await api.ad.byId(adId)

  if (!ad) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditAdForm ad={ad} />
      </div>
    </div>
  )
}
