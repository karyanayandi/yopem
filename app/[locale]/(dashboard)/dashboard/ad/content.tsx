"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardAdHeader from "./header"
import AdTable from "./table"

export default function DashboardAdContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("ad")

  const perPage = 10

  const { data: adsCount, refetch: updateAdsCount } = api.ad.count.useQuery()

  const lastPage = adsCount && Math.ceil(adsCount / perPage)

  const {
    data: ads,
    isLoading,
    refetch: updateAds,
  } = api.ad.dashboard.useQuery({
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
      <DashboardAdHeader />
      {!isLoading && ads !== undefined && ads.length > 0 ? (
        <AdTable
          ads={ads ?? 1}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateAds={updateAds}
          updateAdsCount={updateAdsCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
