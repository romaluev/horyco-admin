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
  files: {
    originalName: string;
  }[];
}

export interface ICreateProductDto {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock?: number | null;
  status: string | null;
  isMultiple: boolean;
  productTypeId?: number;
}

export interface IUpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  stock?: number;
  status?: string;
  isMultiple?: boolean;
  productTypeId?: number;
}

export interface IProductType {
  id: number;
  image?: string;
  name: string;
  description: string;
  createdAd: string;
}
export interface IProductTypeRequest {
  image?: string;
  name: string;
  description: string;
}
