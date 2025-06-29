import api from '@/shared/lib/axios';
import { IHall, IHallRequest } from './types';
import {
  ApiParams,
  FilteringParams,
  PaginatedResponse,
  SortingParams
} from '@/shared/types';

export const hallApi = {
  /**
   * Получить все залы с пагинацией, сортировкой и фильтрацией
   * @param params - Параметры API
   */
  async getAllHalls(params?: ApiParams): Promise<PaginatedResponse<IHall>> {
    // Обязательно используем page и size параметры, как показано в примере cURL
    const defaultParams = { page: 0, size: 100 };
    const queryParams = { ...defaultParams, ...params };

    const response = await api.get<PaginatedResponse<IHall>>('/hall', {
      params: queryParams
    });
    return response.data;
  },

  /**
   * Получить зал по ID
   * @param id - ID зала
   */
  async getHallById(id: number): Promise<IHall> {
    const response = await api.get<IHall>(`/hall/${id}`);
    return response.data;
  },

  /**
   * Создать новый зал
   * @param body - Данные для создания зала
   */
  async createHall(body: IHallRequest): Promise<IHall> {
    const response = await api.post<IHall>('/hall', body);
    return response.data;
  },

  /**
   * Обновить существующий зал
   * @param id - ID зала
   * @param body - Данные для обновления зала
   */
  async updateHall(id: string, body: IHallRequest): Promise<IHall> {
    const response = await api.patch<IHall>(`/hall/${id}`, body);
    return response.data;
  },

  /**
   * Удалить зал
   * @param id - ID зала
   */
  async deleteHall(id: string): Promise<void> {
    await api.delete(`/hall/${id}`);
  }
};
