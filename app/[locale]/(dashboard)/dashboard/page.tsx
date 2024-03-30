import { notFound } from "next/navigation"

import {
  DashboardBox,
  DashboardBoxCount,
  DashboardBoxDescription,
  DashboardBoxIconWrapper,
} from "@/components/dashboard/dashboard-box"
import { Icon } from "@/components/ui/icon"
import { getSession } from "@/lib/auth/utils"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"

export default async function DashboardPage() {
  const { session } = await getSession()

  if (!session?.user.role.includes("admin" || "author")) {
    return notFound()
  }

  const t = await getI18n()

  const ads = await api.ad.count()
  const articles = await api.article.count()
  const medias = await api.media.count()
  const topics = await api.topic.count()
  const users = await api.user.count()

  return (
    <>
      <h2 className="text-3xl">Statistics</h2>
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Article />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{articles}</DashboardBoxCount>
          <DashboardBoxDescription>{t("articles")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Topic />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{topics}</DashboardBoxCount>
          <DashboardBoxDescription>{t("topics")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Media />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{medias}</DashboardBoxCount>
          <DashboardBoxDescription>{t("medias")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Ads />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{ads}</DashboardBoxCount>
          <DashboardBoxDescription>{t("ads")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.User />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{users}</DashboardBoxCount>
          <DashboardBoxDescription>{t("users")}</DashboardBoxDescription>
        </DashboardBox>
      </div>
    </>
  )
}
