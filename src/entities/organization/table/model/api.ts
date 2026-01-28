import api from '@/shared/lib/axios'

import type {
  ITable,
  ICreateTableDto,
  IUpdateTableDto,
  IUpdateTablePositionDto,
  ITableSession,
  ICloseSessionDto,
  ICloseSessionResponse,
} from './types'

/**
 * Transform backend response to frontend format
 * Maps flat xPosition/yPosition to nested position object
 */
const transformTableResponse = (table: ITable): ITable => {
  return {
    ...table,
    position: {
      x: table.xPosition ?? 0,
      y: table.yPosition ?? 0,
      rotation: table.rotation ?? 0,
    },
  }
}

export const tableApi = {
  /**
   * Get all tables for a hall
   */
  async getTables(hallId: number): Promise<ITable[]> {
    const response = await api.get<{ success: boolean; data: ITable[] }>(
      `/admin/halls/${hallId}/tables`
    )
    const tables = response.data.data || []
    return tables.map(transformTableResponse)
  },

  /**
   * Get table by ID
   */
  async getTableById(id: number): Promise<ITable> {
    const response = await api.get<{ success: boolean; data: ITable }>(
      `/admin/tables/${id}`
    )
    return transformTableResponse(response.data.data)
  },

  /**
   * Create a new table
   */
  async createTable(data: ICreateTableDto): Promise<ITable> {
    const response = await api.post<{ success: boolean; data: ITable }>(
      `/admin/halls/${data.hallId}/tables`,
      data
    )
    return response.data.data
  },

  /**
   * Update a table
   */
  async updateTable(id: number, data: IUpdateTableDto): Promise<ITable> {
    const response = await api.patch<{ success: boolean; data: ITable }>(
      `/admin/tables/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Update table position (for drag & drop)
   */
  async updateTablePosition(
    id: number,
    data: IUpdateTablePositionDto
  ): Promise<ITable> {
    const response = await api.patch<{ success: boolean; data: ITable }>(
      `/admin/tables/${id}/layout`,
      data
    )
    return response.data.data
  },

  /**
   * Delete a table
   */
  async deleteTable(id: number): Promise<void> {
    await api.delete(`/admin/tables/${id}`)
  },

  /**
   * Get table session status
   */
  async getSessionStatus(id: number): Promise<ITableSession> {
    const response = await api.get<{ success: boolean; data: ITableSession }>(
      `/admin/tables/${id}/session-status`
    )
    return response.data.data
  },

  /**
   * Close table session
   */
  async closeSession(
    id: number,
    data: ICloseSessionDto
  ): Promise<ICloseSessionResponse> {
    const response = await api.post<{
      success: boolean
      data: ICloseSessionResponse
    }>(`/admin/tables/${id}/close-session`, data)
    return response.data.data
  },

  /**
   * Note: QR code generation and management endpoints are not yet implemented.
   * QR codes are generated automatically when tables are created.
   * Manual regeneration and download features are planned for future implementation.
   */
}
