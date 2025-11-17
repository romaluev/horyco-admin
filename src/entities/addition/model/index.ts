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
} from './queries'
export {
  useCreateAddition,
  useUpdateAddition,
  useDeleteAddition,
} from './mutations'
export type {
  IAddition,
  ICreateAdditionDto,
  IUpdateAdditionDto,
  IGetAdditionsParams,
} from './types'
