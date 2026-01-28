import { Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/base/dialog'

import { useDeleteProduct } from '@/entities/menu/product/model'

export const DeleteProductButton = ({ id }: { id: number }) => {
  const { t } = useTranslation('menu')
  const { mutateAsync: deleteProduct } = useDeleteProduct()

  const handleDelete = async () => {
    try {
      await deleteProduct(id)
      toast.success(t('products.delete.successMessage'))
    } catch {
      toast.error(t('products.delete.errorMessage'))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('products.delete.confirmTitle')}</DialogTitle>
          <DialogDescription>{t('products.delete.confirmDescription')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleDelete} variant="destructive">
              {t('common.delete')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
