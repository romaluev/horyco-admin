/**
 * Generate PIN Button
 * Quick action for employee table
 */

'use client'

import { useState } from 'react'

import { KeyRound } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

import { GeneratePinDialog } from '@/entities/pin'

import type { IEmployee } from '@/entities/employee'

interface GeneratePinButtonProps {
  employee: IEmployee
}

export const GeneratePinButton = ({ employee }: GeneratePinButtonProps) => {
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
        Генерировать PIN
      </Button>
      <GeneratePinDialog
        employee={employee}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
