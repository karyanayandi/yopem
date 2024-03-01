"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardUserHeader from "./header"
import UserTable from "./table"

export default function DashboardUserContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("topic")

  const perPage = 10

  const { data: usersCount, refetch: updateUsersCount } =
    api.user.count.useQuery()

  const lastPage = usersCount && Math.ceil(usersCount / perPage)

  const {
    data: users,
    isLoading,
    refetch: updateUsers,
  } = api.user.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardUserHeader />
      {!isLoading && users !== undefined && users.length > 0 ? (
        <UserTable
          users={users ?? 1}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateUsers={updateUsers}
          updateUsersCount={updateUsersCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
