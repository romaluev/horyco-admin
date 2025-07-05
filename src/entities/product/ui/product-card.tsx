import { IProduct, useDeleteProduct } from '@/entities/product/model';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import Image from 'next/image';
import { Button } from '@/shared/ui/base/button';
import { Pen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/shared/lib/axios';
import { useState } from 'react';
import { AlertModal } from '@/shared/ui/modal/alert-modal';

type ProductCardProps = {
  DeleteButton?: React.ComponentType<{ id: number }>;
  product: IProduct;
};

const ProductCard = ({ product, DeleteButton }: ProductCardProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  return (
    <Card>
      <CardHeader className='grid-rows-1 items-center'>
        <CardTitle>{product.name}</CardTitle>
        <CardAction className='row-span-1 grid grid-cols-2 gap-2'>
          <Button
            variant='default'
            size='sm'
            onClick={() => router.push(`/dashboard/products/${product.id}`)}
          >
            <Pen />
          </Button>
          {DeleteButton && <DeleteButton id={product.id} />}
        </CardAction>
      </CardHeader>
      <CardContent>
        {product.files[0]?.originalName ? (
          <Image
            width={300}
            height={400}
            unoptimized
            src={`${BASE_API_URL}/file/${product.files[0].originalName}`}
            alt='product-image'
          />
        ) : null}
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => deleteProduct(product.id)}
        loading={false}
      />
    </Card>
  );
};

export default ProductCard;
