/**
 * Menu Template API
 * API client for menu templates
 */

import api from '@/shared/lib/axios';

import type {
  IMenuTemplate,
  IMenuTemplateDetail,
  IGetTemplatesParams,
  IApplyTemplateDto,
  IApplyTemplateResult,
  IBusinessType
} from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

/**
 * Menu template API client
 */
export const menuTemplateApi = {
  /**
   * Get all menu templates with optional filters
   */
  async getTemplates(params?: IGetTemplatesParams): Promise<IMenuTemplate[]> {
    const response = await api.get<ApiResponse<IMenuTemplate[]>>(
      '/admin/menu/templates',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get a specific template by ID with full details
   */
  async getTemplateById(id: number): Promise<IMenuTemplateDetail> {
    const response = await api.get<ApiResponse<IMenuTemplateDetail>>(
      `/admin/menu/templates/${id}`
    );
    return response.data.data;
  },

  /**
   * Get business types
   * GET /admin/menu/templates/business-types
   */
  async getBusinessTypes(): Promise<IBusinessType[]> {
    const response = await api.get<ApiResponse<IBusinessType[]>>(
      '/admin/menu/templates/business-types'
    );
    return response.data.data;
  },

  /**
   * Get templates by business type
   * GET /admin/menu/templates/business-type/:type
   */
  async getTemplatesByBusinessType(type: string): Promise<IMenuTemplate[]> {
    const response = await api.get<ApiResponse<IMenuTemplate[]>>(
      `/admin/menu/templates/business-type/${type}`
    );
    return response.data.data;
  },

  /**
   * Apply a template to current menu
   * POST /admin/menu/templates/:id/apply
   */
  async applyTemplate(id: number, data: IApplyTemplateDto): Promise<IApplyTemplateResult> {
    const response = await api.post<ApiResponse<IApplyTemplateResult>>(
      `/admin/menu/templates/${id}/apply`,
      data
    );
    return response.data.data;
  }
};
