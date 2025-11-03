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
  useGetAdditionItems,
  useCreateAddition,
  useUpdateAddition,
  useDeleteAddition,
  useCreateAdditionItem,
  useUpdateAdditionItem,
  useDeleteAdditionItem,
  type IAddition,
  type ICreateAdditionDto,
  type IUpdateAdditionDto,
  type IGetAdditionsParams,
  type IAdditionItem,
  type ICreateAdditionItemDto,
  type IUpdateAdditionItemDto,
} from './model'
