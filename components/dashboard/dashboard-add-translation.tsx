"use client"

import * as React from "react"
import NextLink from "next/link"

import { Icon } from "@/components/ui/icon"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipProps,
} from "@/components/ui/tooltip"
import type { LanguageType } from "@/lib/validation/language"

interface DashboardAddTranslationProps extends TooltipProps {
  triggerLink: string
  content: React.ReactNode
  language: LanguageType
}

const DashboardAddTranslation: React.FunctionComponent<
  DashboardAddTranslationProps
> = (props) => {
  const { triggerLink, content, language } = props

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {
            <NextLink aria-label="Add Translation" href={triggerLink}>
              <div className="relative h-3 w-4 cursor-pointer">
                {language === "en" ? (
                  <Icon.USAFlag aria-label="English" />
                ) : language === "id" ? (
                  <Icon.IndonesiaFlag aria-label="Indonesia" />
                ) : (
                  <Icon.Add aria-label="Add Translation" />
                )}
              </div>
            </NextLink>
          }
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default DashboardAddTranslation
