import { useState } from 'react'

import { XCircle, Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/shared/ui'

import { useDeactivateEmployee } from '@/entities/organization/employee'

import type { IEmployee } from '@/entities/organization/employee'

interface DeactivateEmployeeButtonProps {
  employee: IEmployee
}

export const DeactivateEmployeeButton = ({
  employee,
}: DeactivateEmployeeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deactivateEmployee, isPending } = useDeactivateEmployee()

  const handleDeactivate = (): void => {
    deactivateEmployee(employee.id, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={!employee.isActive}>
          <XCircle className="h-4 w-4" />
          Деактивировать
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Деактивировать сотрудника?</AlertDialogTitle>
          <AlertDialogDescription>
            Сотрудник {employee.fullName} будет деактивирован и не сможет войти
            в систему.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Деактивация...' : 'Деактивировать'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
