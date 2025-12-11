import type { BranchFormData } from '../model/schema'
import type { IBranch } from '@/entities/branch'

/**
 * Converts branch entity to form default values
 * Handles field mapping from API (phone) to form (phoneNumber)
 */
export const getBranchFormDefaults = (branch: IBranch): BranchFormData => ({
  name: branch.name,
  address: branch.address,
  phoneNumber: branch.phone || branch.phoneNumber || '',
  email: branch.email || '',
})
