/**
 * Update Product Dialog
 * Dialog wrapper for updating product
 */

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'

import { UpdateProductForm } from './update-product-form'

interface UpdateProductDialogProps {
  productId: number
  isOpen: boolean
  onClose: () => void
}

export const UpdateProductDialog = ({
  productId,
  isOpen,
  onClose,
}: UpdateProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать продукт</DialogTitle>
          <DialogDescription>Измените информацию о продукте</DialogDescription>
        </DialogHeader>
        <UpdateProductForm productId={productId} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  )
}
