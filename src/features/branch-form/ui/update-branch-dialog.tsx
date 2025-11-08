'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Form } from '@/shared/ui/base/form'

import { useUpdateBranch, type IBranch, type IUpdateBranchDto } from '@/entities/branch'

import { BranchFormFields } from './branch-form-fields'
import { getBranchFormDefaults } from '../lib/get-branch-form-defaults'
import { branchFormSchema, type BranchFormData } from '../model/schema'

interface UpdateBranchDialogProps {
  isOpen: boolean
  onClose: () => void
  branch: IBranch
  onSuccess?: () => void
}

export const UpdateBranchDialog = ({
  isOpen,
  onClose,
  branch,
  onSuccess,
}: UpdateBranchDialogProps) => {
  const { mutate: updateBranch, isPending } = useUpdateBranch()

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: getBranchFormDefaults(branch),
  })

  useEffect(() => {
    form.reset(getBranchFormDefaults(branch))
  }, [branch, form])

  const handleSubmit = (data: BranchFormData) => {
    const payload: IUpdateBranchDto = {
      name: data.name,
      address: data.address,
      phone: data.phoneNumber,
      email: data.email,
    }
    updateBranch(
      { id: branch.id, data: payload },
      {
        onSuccess: () => {
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать филиал</DialogTitle>
          <DialogDescription>Обновите информацию о филиале</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <BranchFormFields form={form} />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
