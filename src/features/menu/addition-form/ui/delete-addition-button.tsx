/**
 * Delete Addition Button Component
 * Button with confirmation dialog for deleting additions
 */

'use client'

import { useState } from 'react'

import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
} from '@/shared/ui/base/alert-dialog'
import { Button } from '@/shared/ui/base/button'

import { type IAddition, useDeleteAddition } from '@/entities/menu/addition'

interface DeleteAdditionButtonProps {
  addition: IAddition
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const DeleteAdditionButton = ({
  addition,
  variant = 'outline',
  size = 'sm',
}: DeleteAdditionButtonProps) => {
  const { t } = useTranslation('menu')
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteAddition, isPending } = useDeleteAddition()

  const handleDelete = (): void => {
    deleteAddition(addition.id, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  const hasItems = (addition.itemsCount ?? 0) > 0

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('additions.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {t('additions.delete.confirmMessage', { name: addition.name })}
            </p>
            {hasItems && (
              <p className="text-warning">
                {t('additions.delete.warningItems', {
                  count: addition.itemsCount,
                })}
              </p>
            )}
            <p>{t('additions.delete.irreversible')}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? t('common.loading') : t('additions.actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
