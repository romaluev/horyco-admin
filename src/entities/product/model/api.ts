import api from '@/shared/lib/axios';
import {
  IProduct,
  IProductType,
  IProductTypeRequest,
  ICreateProductDto,
  IUpdateProductDto
} from './types';
import {
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
   * @param pagination - Pagination parameters
   * @param sorting - Sorting parameters
   * @param filtering - Filtering parameters
   * @returns Promise with paginated branches
   */
  async getProducts(
    pagination?: PaginationParams,
    sorting?: SortingParams,
    filtering?: FilteringParams[]
  ): Promise<PaginatedResponse<IProduct>> {
    const params = new URLSearchParams();

    params.append('page', '0');
    params.append('size', '10');

    if (pagination) {
      if (Number.isInteger(pagination.page))
        params.append('page', pagination.page + '');
      if (pagination.size) params.append('size', pagination.size.toString());
    }

    // Add sorting params
    // if (sorting) {
    //   params.append('sortBy', sorting.field);
    //   params.append('sortOrder', sorting.order);
    // }

    // Add filtering params
    if (filtering && filtering.length > 0) {
      filtering.forEach((filter, index) => {
        params.append(`filters[${index}][field]`, filter.field);
        params.append(`filters[${index}][value]`, filter.value.toString());
      });
    }

    const response = await api.get<PaginatedResponse<IProduct>>('/product', {
      params
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
    const response = await api.put<IProduct>(`/product/${id}`, productData);
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
    pagination?: PaginationParams,
    sorting?: SortingParams,
    filtering?: FilteringParams[]
  ): Promise<PaginatedResponse<IProductType>> {
    const response =
      await api.get<PaginatedResponse<IProductType>>(`/product-type/`);
    return response.data;
  },

  async createProductTypes(body: IProductTypeRequest): Promise<IProductType> {
    const response = await api.post<IProductType>(`/product-type/`, body);
    return response.data;
  },

  async updateProductTypes(body: IProductTypeRequest): Promise<IProductType> {
    const response = await api.put<IProductType>(`/product-type/`, body);
    return response.data;
  },

  async deleteProductTypes(id: string) {
    await api.delete(`/product-type/${id}`);
  }
};
