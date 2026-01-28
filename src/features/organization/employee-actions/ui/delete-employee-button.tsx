import { useState } from 'react'

import { Trash, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
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
  buttonVariants,
} from '@/shared/ui'

import { useDeleteEmployee } from '@/entities/organization/employee'

import type { IEmployee } from '@/entities/organization/employee'

interface DeleteEmployeeButtonProps {
  employee: IEmployee
}

export const DeleteEmployeeButton = ({
  employee,
}: DeleteEmployeeButtonProps) => {
  const { t } = useTranslation('organization')
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteEmployee, isPending } = useDeleteEmployee()

  const handleDelete = (): void => {
    deleteEmployee(employee.id, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          <Trash className="h-4 w-4" />
          {t('common.delete')}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('staff.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('staff.delete.description', { name: employee.fullName })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: 'destructive' }))}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t('staff.delete.deleting') : t('staff.delete.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
