import api from '@/shared/lib/axios';
import {
  IProduct,
  IProductType,
  IProductTypeRequest,
  ICreateProductDto,
  IUpdateProductDto
} from './types';
import {
  ApiParams,
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams
} from '@/shared/types';

export const productAPi = {
  /**
   * Create a new products
   * @param productData - The products data to create
   * @returns Promise with the created products
   */
  async createProduct(productData: ICreateProductDto): Promise<IProduct> {
    const response = await api.post<IProduct>('/product', productData);
    return response.data;
  },

  /**
   * Get all products with pagination, sorting, and filtering
   * @param params - Params
   * @returns Promise with paginated branches
   */
  async getProducts(params?: ApiParams): Promise<PaginatedResponse<IProduct>> {
    const response = await api.get<PaginatedResponse<IProduct>>('/product', {
      params: params
    });
    return response.data;
  },

  /**
   * Get a products by ID
   * @param id - The products ID
   * @returns Promise with the products
   */
  async getProductById(id: number): Promise<IProduct> {
    const response = await api.get<IProduct>(`/product/${id}`);
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
    const response = await api.patch<IProduct>(`/product/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a products
   * @param id - The products ID
   * @returns Promise with the deleted products
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/product/${id}`);
  },

  async attachFiles(id: number, files: File[]): Promise<number> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    await api.post(`/product/${id}/attach-files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return id;
  },

  async getFiles(id: number) {
    const { data } = await api.get(`/product/${id}/files`);
    return data;
  },

  async deleteFile(productId: number, fileId: number): Promise<void> {
    await api.delete(`/product/${productId}/delete-file/${fileId}`);
  },

  async getAllProductTypes(
    params?: string
  ): Promise<PaginatedResponse<IProductType>> {
    const response = await api.get<PaginatedResponse<IProductType>>(
      `/product-type/`,
      { params }
    );
    return response.data;
  },

  async createProductTypes(body: IProductTypeRequest): Promise<IProductType> {
    const response = await api.post<IProductType>(`/product-type/`, body);
    return response.data;
  },

  async updateProductTypes(
    id: string,
    body: IProductTypeRequest
  ): Promise<IProductType> {
    const response = await api.put<IProductType>(`/product-type/${id}`, body);
    return response.data;
  },

  async deleteProductTypes(id: string) {
    await api.delete(`/product-type/${id}`);
  }
};
