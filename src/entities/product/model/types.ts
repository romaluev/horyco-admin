import { IFile } from '@/shared/types';

export interface IAdditionProduct {
  id: number;
  name: string;
  price: number;
  isDeleted?: boolean;
  additionId?: number;
}

export interface IAddition {
  id: number;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  productId: number;
  limit: number;
  additionProducts: IAdditionProduct[];
  isDeleted?: boolean;
}

export interface IUpdatedAddition {
  id: number;
  name?: string;
  isRequired?: boolean;
  isMultiple?: boolean;
  productId: number;
  limit?: number;
  additionProducts?: IAdditionProduct[];
  isDeleted?: boolean;
}

export interface IUpdatedProduct {
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
  files: IFile[];
  additions?: IUpdatedAddition[];
}
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
  files: IFile[];
  additions?: IAddition[];
}

export interface ICreateAdditionProductDto {
  name: string;
  price: number;
}

export interface ICreateAdditionDto {
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  limit: number;
  additionProducts: ICreateAdditionProductDto[];
}

export interface ICreateProductDto {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock?: number | null;
  status: string | null;
  productTypeId?: number;
  additions?: ICreateAdditionDto[];
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
  additions?: ICreateAdditionDto[];
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
