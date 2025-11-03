import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Pen } from 'lucide-react'

import { BASE_API_URL } from '@/shared/lib/axios'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
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
        {product.image ? (
          <img
            className="h-[200px] rounded-md object-cover"
            src={product.image}
            alt={product.name}
          />
        ) : null}
        <CardDescription className="pt-2">
          {product.description}
        </CardDescription>
      </CardContent>
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => deleteProduct(product.id)}
        loading={false}
      />
    </Card>
  )
}

export default ProductCard
