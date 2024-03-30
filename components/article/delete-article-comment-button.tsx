"use client"

import * as React from "react"

import { AlertDelete } from "@/components/alert-delete"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useI18n } from "@/lib/locales/client"

interface DeleteArticleCommentButtonProps {
  description: React.ReactNode
  action: () => void
}

const DeleteArticleCommentButton: React.FunctionComponent<
  DeleteArticleCommentButtonProps
> = (props) => {
  const { description, action } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)

  const t = useI18n()

  return (
    <div>
      <Button
        aria-label={t("delete")}
        variant="ghost"
        className="h-auto justify-start"
        onClick={() => setOpenDialog(true)}
      >
        <Icon.Delete className="mr-1" />
        {t("delete")}
      </Button>
      <AlertDelete
        description={description}
        isOpen={openDialog}
        className="max-w-[366px]"
        onDelete={action}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  )
}

export default DeleteArticleCommentButton
