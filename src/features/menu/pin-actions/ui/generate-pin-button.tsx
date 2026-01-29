/**
 * Generate PIN Button
 * Quick action for employee table
 */

'use client'

import { useState } from 'react'

import { KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/base/button'

import { GeneratePinDialog } from '@/entities/menu/pin'

import type { IEmployee } from '@/entities/organization/employee'

interface GeneratePinButtonProps {
  employee: IEmployee
}

export const GeneratePinButton = ({ employee }: GeneratePinButtonProps) => {
  const { t } = useTranslation('menu')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start"
      >
        <KeyRound className="mr-2 h-4 w-4" />
        {t('components.pinButton.title')}
      </Button>
      <GeneratePinDialog
        employee={employee}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
