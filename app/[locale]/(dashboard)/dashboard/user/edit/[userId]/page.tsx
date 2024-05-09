import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"
import { EditUserForm } from "./form"

export async function generateMetadata({
  params,
}: {
  params: { userId: string; locale: LanguageType }
}): Promise<Metadata> {
  const { userId, locale } = params

  const user = await api.user.byId(userId)

  return {
    title: "Edit User Dashboard",
    description: "Edit User Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/edit/${user?.id}/`,
    },
    openGraph: {
      title: "Edit User Dashboard",
      description: "Edit User Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/edit/${user?.id}`,
      locale: locale,
    },
  }
}

interface EditUserDashboardProps {
  params: {
    userId: string
  }
}

export default async function EditUserDashboardPage({
  params,
}: EditUserDashboardProps) {
  const { userId } = params

  const user = await api.user.byId(userId)

  if (!user) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditUserForm user={user} />
      </div>
    </div>
  )
}
