import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
import {
  BaseLoading,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui'

import { GeneratePinDialog } from '@/entities/menu/pin'
import { useCreateEmployee } from '@/entities/organization/employee'

import { CreateBranchPermissionsManager } from './create-branch-permissions-manager'
import { EmployeeFormBasic } from './employee-form-basic'
import { createEmployeeSchema } from '../model/contract'

import type { CreateEmployeeFormData } from '../model/contract'
import type { IEmployee } from '@/entities/organization/employee'

// Steps will be defined in the component to use translations
const getSteps = (t: any) => [
  { number: 1, title: t('staff.form.steps.basicInfo'), description: t('staff.form.steps.step1') },
  { number: 2, title: t('staff.form.steps.branchesPermissions'), description: t('staff.form.steps.step2') },
] as const

 
export const CreateEmployeeDialog = () => {
  const { t } = useTranslation('organization')
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [createdEmployee, setCreatedEmployee] = useState<IEmployee | null>(null)
  const [isShowingPinDialog, setIsShowingPinDialog] = useState(false)
  const [branchPermissions, setBranchPermissions] = useState<
    Record<number, number[]>
  >({})

  const STEPS = getSteps(t)

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      roleIds: [],
      branchIds: [],
      activeBranchId: 0,
    },
  })

  const { mutate: createEmployee, isPending } = useCreateEmployee()
  const selectedBranchIds = form.watch('branchIds') || []

  const onSubmit = (data: CreateEmployeeFormData): void => {
    // Set activeBranchId to first selected branch if not already set
    const activeBranchId = data.activeBranchId ?? data.branchIds[0]

    // Convert branchPermissions to the API format
    const formattedBranchPermissions: Record<number, { permissionIds: number[] }> = {}
    Object.entries(branchPermissions).forEach(([branchId, permissionIds]) => {
      formattedBranchPermissions[Number(branchId)] = { permissionIds }
    })

     
    createEmployee({
      ...data,
      activeBranchId: activeBranchId!,
      roleIds: data.roleIds || [],
      branchPermissions: Object.keys(formattedBranchPermissions).length > 0 ? formattedBranchPermissions : undefined,
    }, {
      onSuccess: (employee) => {
        // Close dialog and open PIN generation
        setIsOpen(false)
        form.reset()
        setCurrentStep(1)
        setBranchPermissions({})
        setCreatedEmployee(employee)
        setIsShowingPinDialog(true)
      },
    })
  }

  const handleNext = async (): Promise<void> => {
    let isValid = false

    if (currentStep === 1) {
      isValid = await form.trigger(['fullName', 'phone', 'email', 'password'])
    } else if (currentStep === 2) {
      isValid = await form.trigger(['branchIds'])
    }

    if (isValid && currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBranchesChange = (branchIds: number[]): void => {
    form.setValue('branchIds', branchIds)
  }

  const handlePermissionsChange = (
    branchId: number,
    permissionIds: number[]
  ): void => {
    setBranchPermissions((prev) => ({
      ...prev,
      [branchId]: permissionIds,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {t('staff.addNew')}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{STEPS[currentStep - 1]?.title}</DialogTitle>
          <DialogDescription>
            {STEPS[currentStep - 1]?.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={cn(
                'bg-muted h-1 flex-1 rounded-full',
                step.number <= currentStep && 'bg-primary'
              )}
            />
          ))}
        </div>

        {/* Form content */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="my-6">
            {currentStep === 1 && <EmployeeFormBasic form={form} />}
            {currentStep === 2 && (
              <CreateBranchPermissionsManager
                selectedBranchIds={selectedBranchIds}
                onBranchesChange={handleBranchesChange}
                onPermissionsChange={handlePermissionsChange}
                branchPermissions={branchPermissions}
              />
            )}
          </div>

          <DialogFooter>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
              >
                {t('common.back')}
              </Button>
            )}

            {currentStep < 2 ? (
              <Button type="button" onClick={handleNext}>
                {t('staff.form.steps.next')}
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending && <BaseLoading />}
                {isPending ? t('common.actions.saving') : t('staff.form.submit.create')}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>

      {/* PIN Generation Dialog after employee creation */}
      {createdEmployee && (
        <GeneratePinDialog
          employee={createdEmployee}
          isOpen={isShowingPinDialog}
          onClose={() => {
            setIsShowingPinDialog(false)
            setCreatedEmployee(null)
          }}
        />
      )}
    </Dialog>
  )
}
