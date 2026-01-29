import type { IGetRecipesParams } from './types'

export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params?: IGetRecipesParams) =>
    [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: number) => [...recipeKeys.details(), id] as const,
  ingredients: (id: number) =>
    [...recipeKeys.detail(id), 'ingredients'] as const,
}
