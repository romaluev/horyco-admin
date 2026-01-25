'use client'

import { MoreHorizontal } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui'

import {
  ActivateEmployeeButton,
  DeactivateEmployeeButton,
  DeleteEmployeeButton,
} from '@/features/organization/employee-actions'
import { UpdateEmployeeDialog } from '@/features/organization/employee-form'
import { GeneratePinButton } from '@/features/menu/pin-actions'
import { GenerateInviteLinkButton } from '@/features/auth/staff-invite'

import type { IEmployee } from '@/entities/organization/employee'
import type { JSX } from 'react'

interface EmployeeTableActionsProps {
  employee: IEmployee
}

export const EmployeeTableActions = ({
  employee,
}: EmployeeTableActionsProps): JSX.Element => {
  const { t } = useTranslation('organization')

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t('staff.actions.openMenu')}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-2">
        <DropdownMenuLabel>{t('staff.actions.menuLabel')}</DropdownMenuLabel>
        <UpdateEmployeeDialog employee={employee} />
        <GeneratePinButton employee={employee} />
        <GenerateInviteLinkButton employee={employee} />
        <ActivateEmployeeButton employee={employee} />
        <DeactivateEmployeeButton employee={employee} />
        <DeleteEmployeeButton employee={employee} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
