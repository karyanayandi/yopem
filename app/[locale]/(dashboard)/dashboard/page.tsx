import { notFound } from "next/navigation"

import {
  DashboardBox,
  DashboardBoxCount,
  DashboardBoxDescription,
  DashboardBoxIconWrapper,
} from "@/components/dashboard/dashboard-box"
import { Icon } from "@/components/ui/icon"
import { getSession } from "@/lib/auth/utils"
import { api } from "@/lib/trpc/server"

export default async function DashboardPage() {
  const { session } = await getSession()

  if (!session?.user.role.includes("admin" || "author")) {
    return notFound()
  }

  // const articles = await api.article.count.query()
  const medias = await api.media.count.query()
  const topics = await api.topic.count.query()
  const users = await api.user.count.query()

  return (
    <>
      <h2 className="text-3xl">Statistics</h2>
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Article />
          </DashboardBoxIconWrapper>
          {/* TODO: add count */}
          <DashboardBoxCount>0</DashboardBoxCount>
          <DashboardBoxDescription>articles</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Media />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{medias}</DashboardBoxCount>
          <DashboardBoxDescription>medias</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Topic />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{topics}</DashboardBoxCount>
          <DashboardBoxDescription>topics</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.User />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{users}</DashboardBoxCount>
          <DashboardBoxDescription>users</DashboardBoxDescription>
        </DashboardBox>
      </div>
    </>
  )
}
