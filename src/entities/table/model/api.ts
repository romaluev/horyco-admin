import api from '@/shared/lib/axios';
import { ITable, ICreateTableDto, IUpdateTableDto } from './types';
import { ApiParams, PaginatedResponse } from '@/shared/types';

export const tableApi = {
  /**
   * Create a new table
   * @param tableData - The table data to create
   * @returns Promise with the created table
   */
  async createTable(tableData: ICreateTableDto): Promise<ITable> {
    const response = await api.post<ITable>('/pos/table', tableData);
    return response.data;
  },

  async getTables(
    searchParams: ApiParams = {}
  ): Promise<PaginatedResponse<ITable>> {
    const params = new URLSearchParams();

    params.append('page', String(searchParams.page || '0'));
    params.append('size', String(searchParams.size || '100'));

    if (searchParams.filters) {
      params.append('filters', searchParams.filters);
    }
    const response = await api.get<PaginatedResponse<ITable>>('/pos/table', {
      params: params
    });
    return response.data;
  },

  /**
   * Get a table by ID
   * @param id - The table ID
   * @returns Promise with the table
   */
  async getTableById(id: number): Promise<ITable> {
    const response = await api.get<ITable>(`/pos/table/${id}`);
    return response.data;
  },

  /**
   * Update a table
   * @param id - The table ID
   * @param tableData - The updated table data
   * @returns Promise with the updated table
   */
  async updateTable(id: number, tableData: IUpdateTableDto): Promise<ITable> {
    const response = await api.patch<ITable>(`/pos/table/${id}`, tableData);
    return response.data;
  },

  /**
   * Delete a table
   * @param id - The table ID
   * @returns Promise with void
   */
  async deleteTable(id: number): Promise<void> {
    await api.delete(`/pos/table/${id}`);
  }
};
