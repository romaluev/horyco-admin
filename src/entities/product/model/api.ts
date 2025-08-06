import api from '@/shared/lib/axios';
import {
  IProduct,
  IProductType,
  IProductTypeRequest,
  ICreateProductDto,
  IUpdateProductDto
} from './types';
import { ApiParams, PaginatedResponse } from '@/shared/types';

export const productAPi = {
  /**
   * Create a new products
   * @param productData - The products data to create
   * @returns Promise with the created products
   */
  async createProduct(productData: ICreateProductDto): Promise<IProduct> {
    const response = await api.post<IProduct>('/pos/product', productData);
    return response.data;
  },

  async getProducts(
    searchParams: ApiParams = {}
  ): Promise<PaginatedResponse<IProduct>> {
    const params = new URLSearchParams();

    params.append('page', String(searchParams.page || '0'));
    params.append('size', String(searchParams.size || '100'));

    if (searchParams.filters) {
      params.append('filters', searchParams.filters);
    }
    const response = await api.get<PaginatedResponse<IProduct>>(
      '/pos/product',
      {
        params: params
      }
    );
    return response.data;
  },

  /**
   * Get a products by ID
   * @param id - The products ID
   * @returns Promise with the products
   */
  async getProductById(id: number): Promise<IProduct> {
    const response = await api.get<IProduct>(`/pos/product/${id}`);
    return response.data;
  },

  /**
   * Update a products
   * @param id - The products ID
   * @param productData - The products data to update
   * @returns Promise with the updated products
   */
  async updateProduct(
    id: number,
    productData: IUpdateProductDto
  ): Promise<IProduct> {
    const response = await api.put<IProduct>(`/pos/product/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a products
   * @param id - The products ID
   * @returns Promise with the deleted products
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/pos/product/${id}`);
  },

  async attachFiles(id: number, files: File[]): Promise<number> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    await api.post(`/pos/product/${id}/attach-files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return id;
  },

  async getFiles(id: number) {
    const { data } = await api.get(`/pos/product/${id}/files`);
    return data;
  },

  async deleteFile(productId: number, fileId: number): Promise<void> {
    await api.delete(`/pos/product/${productId}/delete-file/${fileId}`);
  },

  async getAllProductTypes(
    params?: string
  ): Promise<PaginatedResponse<IProductType>> {
    const response = await api.get<PaginatedResponse<IProductType>>(
      `/pos/product-type/`,
      { params }
    );
    return response.data;
  },

  async createProductTypes(body: IProductTypeRequest): Promise<IProductType> {
    const response = await api.post<IProductType>(`/pos/product-type/`, body);
    return response.data;
  },

  async updateProductTypes(
    id: string,
    body: IProductTypeRequest
  ): Promise<IProductType> {
    const response = await api.put<IProductType>(
      `/pos/product-type/${id}`,
      body
    );
    return response.data;
  },

  async deleteProductTypes(id: string) {
    await api.delete(`/pos/product-type/${id}`);
  }
};
