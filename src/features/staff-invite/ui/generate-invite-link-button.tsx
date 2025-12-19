'use client'

import { useState } from 'react'

import { Link2 } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

import { InviteLinkDialog } from './invite-link-dialog'

import type { IEmployee } from '@/entities/employee'

interface GenerateInviteLinkButtonProps {
  employee: IEmployee
}

export const GenerateInviteLinkButton = ({
  employee,
}: GenerateInviteLinkButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start"
      >
        <Link2 className="mr-2 h-4 w-4" />
        Пригласительная ссылка
      </Button>
      <InviteLinkDialog
        employee={employee}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
