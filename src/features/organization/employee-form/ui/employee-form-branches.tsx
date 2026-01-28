import { useState } from 'react'

import {
  BaseError,
  BaseLoading,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'

import { useGetAllBranches } from '@/entities/organization/branch'

import type { CreateEmployeeFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface EmployeeFormBranchesProps {
  form: UseFormReturn<CreateEmployeeFormData>
}

export const EmployeeFormBranches = ({ form }: EmployeeFormBranchesProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form

  const { data: branches, isLoading, isError } = useGetAllBranches()
  const selectedBranchIds = watch('branchIds') || []
  const activeBranchId = watch('activeBranchId')

  const toggleBranch = (branchId: number): void => {
    const currentBranchIds = selectedBranchIds
    if (currentBranchIds.includes(branchId)) {
      const newBranchIds = currentBranchIds.filter((id) => id !== branchId)
      setValue('branchIds', newBranchIds)
      // If active branch was removed, clear it
      if (activeBranchId === branchId) {
        setValue('activeBranchId', newBranchIds[0] || 0)
      }
    } else {
      const newBranchIds = [...currentBranchIds, branchId]
      setValue('branchIds', newBranchIds)
      // If no active branch set, set this as active
      if (!activeBranchId) {
        setValue('activeBranchId', branchId)
      }
    }
  }

  if (isLoading) {
    return <BaseLoading />
  }

  if (isError || !branches) {
    return <BaseError message="Ошибка при загрузке филиалов" />
  }

  const branchList = branches.items || []
  const availableBranches = branchList.filter((branch) =>
    selectedBranchIds.includes(branch.id)
  )

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Выберите филиалы <span className="text-destructive">*</span>
        </Label>
        <p className="text-muted-foreground text-sm">
          Сотрудник может работать в нескольких филиалах. Разрешения можно настроить для каждого филиала отдельно на следующем шаге.
        </p>
      </div>

      <div className="space-y-4">
        {branchList.map((branch) => (
          <div
            key={branch.id}
            className="flex items-start gap-4 rounded-lg border p-4"
          >
            <Checkbox
              id={`branch-${branch.id}`}
              checked={selectedBranchIds.includes(branch.id)}
              onCheckedChange={() => toggleBranch(branch.id)}
            />
            <div className="flex-1">
              <label
                htmlFor={`branch-${branch.id}`}
                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {branch.name}
              </label>
              {branch.address && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {branch.address}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.branchIds && (
        <p className="text-destructive text-sm">{errors.branchIds.message}</p>
      )}

      {selectedBranchIds.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="activeBranch">
            Активный филиал <span className="text-destructive">*</span>
          </Label>
          <Select
            value={activeBranchId?.toString()}
            onValueChange={(value) =>
              setValue('activeBranchId', parseInt(value))
            }
          >
            <SelectTrigger id="activeBranch" className="text-base md:text-sm">
              <SelectValue placeholder="Выберите активный филиал" />
            </SelectTrigger>
            <SelectContent>
              {availableBranches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.activeBranchId && (
            <p className="text-destructive text-sm">
              {errors.activeBranchId.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
