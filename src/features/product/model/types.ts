export interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  status: string;
  isMultiple: boolean;
  productTypeId: number;
  createdBy: number;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock?: number | null;
  status: string | null;
  isMultiple?: boolean;
  productTypeId?: number;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  stock?: number;
  status?: string;
  isMultiple?: boolean;
  productTypeId?: number;
}
