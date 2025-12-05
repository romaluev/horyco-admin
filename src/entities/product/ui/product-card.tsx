import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Pen } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { ImageCell } from '@/shared/ui/image-cell'
import { AlertModal } from '@/shared/ui/modal/alert-modal'

import { useDeleteProduct } from '@/entities/product/model'

import type { IProduct } from '@/entities/product/model'

interface ProductCardProps {
  DeleteButton?: React.ComponentType<{ id: number }>
  product: IProduct
}

const ProductCard = ({ product, DeleteButton }: ProductCardProps) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const router = useRouter()
  const { mutateAsync: deleteProduct } = useDeleteProduct()

  return (
    <Card className="gap-4">
      <CardHeader className="grid-rows-1 items-center">
        <CardTitle>{product.name}</CardTitle>
        <CardAction className="row-span-1 grid grid-cols-2 gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push(`/dashboard/products/${product.id}`)}
          >
            <Pen />
          </Button>
          {DeleteButton && <DeleteButton id={product.id} />}
        </CardAction>
      </CardHeader>
      <CardContent>
        <ImageCell
          imageUrls={product.imageUrls}
          fileId={product.image}
          alt={product.name}
          className="h-[200px] w-full rounded-md object-cover"
          preferredVariant="medium"
        />
        <CardDescription className="pt-2">
          {product.description}
        </CardDescription>
      </CardContent>
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => deleteProduct(product.id)}
        isLoading={false}
      />
    </Card>
  )
}

export default ProductCard
