import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui'

import { useUpdateEmployee } from '@/entities/organization/employee'
import { PinManagementSection } from '@/entities/menu/pin'

import { UpdateBranchPermissionsManager } from './update-branch-permissions-manager'
import { UpdateEmployeeFormBasic } from './update-employee-form-basic'
import { updateEmployeeSchema } from '../model/contract'

import type { UpdateEmployeeFormData } from '../model/contract'
import type { IEmployee } from '@/entities/organization/employee'

interface UpdateEmployeeDialogProps {
  employee: IEmployee
}

// eslint-disable-next-line max-lines-per-function
export const UpdateEmployeeDialog = ({
  employee,
}: UpdateEmployeeDialogProps) => {
  const { t } = useTranslation('organization')
  const [isOpen, setIsOpen] = useState(false)
  // Get branch IDs from branchPermissions (which includes all assigned branches)
  const getInitialBranchIds = (): number[] => {
    // Check if branchPermissions is an array (from API response)
    if (Array.isArray(employee.branchPermissions)) {
      const branchIds = Array.from(
        new Set(
          employee.branchPermissions.map((bp) =>
            (bp as { branchId: number }).branchId
          )
        )
      )
      return branchIds
    }

    // Check if branches is populated (fallback)
    if (employee.branches && Array.isArray(employee.branches)) {
      return employee.branches.map((b) => b.id)
    }

    return []
  }

  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getInitialBranchIds()
  )

  const form = useForm<UpdateEmployeeFormData>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      fullName: employee.fullName,
      email: employee.email || '',
      birthDate: employee.birthDate,
      hireDate: employee.hireDate,
      notes: employee.notes,
      branchIds: employee.branches?.map((b) => b.id) || [],
      activeBranchId: employee.activeBranchId,
    },
  })

  const { mutate: updateEmployee, isPending } = useUpdateEmployee()

  // Check if branches have changed
  const initialBranchIds = getInitialBranchIds()
  const isBranchesChanged =
    selectedBranchIds.length !== initialBranchIds.length ||
    selectedBranchIds.some((id) => !initialBranchIds.includes(id))

  useEffect(() => {
    if (isOpen) {
      const branchIds = getInitialBranchIds()
      setSelectedBranchIds(branchIds)
      form.reset({
        fullName: employee.fullName,
        email: employee.email || '',
        birthDate: employee.birthDate,
        hireDate: employee.hireDate,
        notes: employee.notes,
        branchIds,
        activeBranchId: employee.activeBranchId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, employee])

  const onSubmit = (data: UpdateEmployeeFormData): void => {
    updateEmployee(
      { id: employee.id, data: { ...data, branchIds: selectedBranchIds } },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
          {t('common.edit')}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('staff.form.title.edit', { name: employee.fullName })}</DialogTitle>
          <DialogDescription>
            {t('staff.form.description.update', { name: employee.fullName })}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">{t('staff.form.tabs.info')}</TabsTrigger>
            <TabsTrigger value="branches-permissions">{t('staff.form.tabs.branches')}</TabsTrigger>
            <TabsTrigger value="pin">PIN</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="info">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="my-6 space-y-6">
                <UpdateEmployeeFormBasic form={form} />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? t('common.actions.saving') : t('staff.form.saveChanges')}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Branches and Permissions Tab */}
          <TabsContent value="branches-permissions">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="my-6">
                <UpdateBranchPermissionsManager
                  employeeId={employee.id}
                  selectedBranchIds={selectedBranchIds}
                  onBranchesChange={setSelectedBranchIds}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isPending || !isBranchesChanged}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* PIN Tab */}
          <TabsContent value="pin">
            <div className="my-6">
              <PinManagementSection employee={employee} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
