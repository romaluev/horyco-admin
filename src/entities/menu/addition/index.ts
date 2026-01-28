/**
 * Addition Entity - Public API
 * Entry point for addition entity exports
 */

export {
  additionApi,
  additionKeys,
  useGetAdditions,
  useGetAdditionById,
  useGetAdditionsByProduct,
  useCreateAddition,
  useUpdateAddition,
  useDeleteAddition,
  type IAddition,
  type ICreateAdditionDto,
  type IUpdateAdditionDto,
  type IGetAdditionsParams,
} from './model'

export { AdditionCard } from './ui/addition-card'
export { AdditionList } from './ui/addition-list'
