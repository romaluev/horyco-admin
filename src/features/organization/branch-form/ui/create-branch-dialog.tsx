'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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

import { useCreateBranch, type ICreateBranchDto } from '@/entities/organization/branch'

import { BranchFormFields } from './branch-form-fields'
import { branchFormSchema, type BranchFormData } from '../model/schema'

interface CreateBranchDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const CreateBranchDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateBranchDialogProps) => {
  const { t } = useTranslation('organization')
  const { mutate: createBranch, isPending } = useCreateBranch()

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
    },
  })

  const handleSubmit = (data: BranchFormData) => {
    const payload: ICreateBranchDto = {
      name: data.name,
      address: data.address,
      phone: data.phoneNumber,
      email: data.email,
    }
    createBranch(payload, {
      onSuccess: () => {
        form.reset()
        onClose()
        onSuccess?.()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('branchForm.title.create')}</DialogTitle>
          <DialogDescription>
            {t('branchForm.description.create')}
          </DialogDescription>
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
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('branchForm.actions.creating') : t('branchForm.actions.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
