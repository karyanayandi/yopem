"use client"

import * as React from "react"

import { AlertDelete } from "@/components/alert-delete"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

interface DeleteMediaButtonProps {
  description: React.ReactNode
  onDelete: () => void
}

const DeleteMediaButton: React.FC<DeleteMediaButtonProps> = (props) => {
  const { description, onDelete } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  return (
    <div>
      <Button
        aria-label="Delete Media"
        size="icon"
        className="absolute z-20 h-[30px] w-[30px] rounded-full"
        variant="danger"
        onClick={() => setOpenDialog(true)}
      >
        <Icon.Delete aria-label="Delete Media" />
      </Button>
      <AlertDelete
        description={description}
        isOpen={openDialog}
        className="max-w-[366px]"
        onDelete={onDelete}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  )
}

export default DeleteMediaButton
