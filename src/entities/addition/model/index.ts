/**
 * Addition Model Exports
 * Public API for addition model layer
 */

export { additionApi } from './api'
export { additionKeys } from './query-keys'
export {
  useGetAdditions,
  useGetAdditionById,
  useGetAdditionsByProduct,
  useGetAdditionItems,
} from './queries'
export {
  useCreateAddition,
  useUpdateAddition,
  useDeleteAddition,
  useCreateAdditionItem,
  useUpdateAdditionItem,
  useDeleteAdditionItem,
} from './mutations'
export type {
  IAddition,
  ICreateAdditionDto,
  IUpdateAdditionDto,
  IGetAdditionsParams,
  IAdditionItem,
  ICreateAdditionItemDto,
  IUpdateAdditionItemDto,
} from './types'
