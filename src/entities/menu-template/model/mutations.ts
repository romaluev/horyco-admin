/**
 * Menu Template Mutations
 * React Query mutation hooks for menu templates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { additionKeys } from '@/entities/addition'
import { categoryKeys } from '@/entities/category'
import { modifierKeys } from '@/entities/modifier'
import { productKeys } from '@/entities/product'

import { menuTemplateApi } from './api'

import type { IApplyTemplateDto } from './types'

/**
 * Apply a menu template
 */
export const useApplyTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IApplyTemplateDto }) =>
      menuTemplateApi.applyTemplate(id, data),
    onSuccess: (result) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
      queryClient.invalidateQueries({ queryKey: productKeys.all() })
      queryClient.invalidateQueries({ queryKey: modifierKeys.all() })
      queryClient.invalidateQueries({ queryKey: additionKeys.all() })

      toast.success(result.message || 'Шаблон успешно применён', {
        description: `Создано: ${result.categoriesCreated} категорий, ${result.productsCreated} продуктов, ${result.modifiersCreated} модификаторов, ${result.additionsCreated} дополнений`,
      })
    },
    onError: () => {
      toast.error('Не удалось применить шаблон')
    },
  })
}
