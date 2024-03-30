import * as React from "react"

import DashboardAdPositionBadge from "@/components/dashboard/dashboard-ad-position-badge"
import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectAd } from "@/lib/db/schema/ad"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface AdTableProps {
  ads: SelectAd[]
  paramsName: string
  page: number
  lastPage: number
  updateAds: () => void
  updateAdsCount: () => void
}

export default function AdTable(props: AdTableProps) {
  const { ads, paramsName, page, lastPage, updateAds, updateAdsCount } = props

  const t = useI18n()
  const ts = useScopedI18n("ad")

  const { mutate: deleteAd } = api.ad.delete.useMutation({
    onSuccess: () => {
      updateAds()
      updateAdsCount()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("type")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("position")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("active")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => {
            return (
              <TableRow key={ad.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">{ad.title}</span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span className="uppercase">{ad.position}</span>
                      <span className="pr-1">,</span>
                      <span>{ad.active}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {ad.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <DashboardAdPositionBadge position={ad.position!}>
                      {ad.position}
                    </DashboardAdPositionBadge>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">{JSON.stringify(ad.active)}</div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    onDelete={() => {
                      void deleteAd(ad.id)
                    }}
                    editUrl={`/dashboard/ad/edit/${ad.id}`}
                    description={ad.title!}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage ? (
        <DashboardPagination
          currentPage={page}
          lastPage={lastPage ?? 1}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
