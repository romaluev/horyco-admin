import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'

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

import { useUpdateEmployee } from '@/entities/employee'
import { PinManagementSection } from '@/entities/pin'

import { EmployeeFormBasic } from './employee-form-basic'
import { EmployeeFormBranches } from './employee-form-branches'
import { EmployeeFormRoles } from './employee-form-roles'
import { EmployeePermissionsEditor } from '@/features/employee-permissions'
import { updateEmployeeSchema } from '../model/contract'

import type { UpdateEmployeeFormData } from '../model/contract'
import type { IEmployee } from '@/entities/employee'

interface UpdateEmployeeDialogProps {
  employee: IEmployee
}

export const UpdateEmployeeDialog = ({
  employee,
}: UpdateEmployeeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<UpdateEmployeeFormData>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      fullName: employee.fullName,
      email: employee.email || '',
      birthDate: employee.birthDate,
      hireDate: employee.hireDate,
      notes: employee.notes,
      roleIds: employee.roles?.map((r) => r.id) || [],
      branchIds: employee.branches?.map((b) => b.id) || [],
      activeBranchId: employee.activeBranchId,
    },
  })

  const { mutate: updateEmployee, isPending } = useUpdateEmployee()

  useEffect(() => {
    if (isOpen) {
      form.reset({
        fullName: employee.fullName,
        email: employee.email || '',
        birthDate: employee.birthDate,
        hireDate: employee.hireDate,
        notes: employee.notes,
        roleIds: employee.roles?.map((r) => r.id) || [],
        branchIds: employee.branches?.map((b) => b.id) || [],
        activeBranchId: employee.activeBranchId,
      })
    }
  }, [isOpen, employee, form])

  const onSubmit = (data: UpdateEmployeeFormData): void => {
    updateEmployee(
      { id: employee.id, data },
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
          Редактировать
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать сотрудника</DialogTitle>
          <DialogDescription>
            Обновите информацию о сотруднике {employee.fullName}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="roles">Роли</TabsTrigger>
            <TabsTrigger value="branches">Филиалы</TabsTrigger>
            <TabsTrigger value="permissions">Разрешения</TabsTrigger>
            <TabsTrigger value="pin">PIN</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="info">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="my-6 space-y-6">
                <EmployeeFormBasic form={form as any} />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="my-6">
                <EmployeeFormRoles form={form as any} />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Branches Tab */}
          <TabsContent value="branches">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="my-6">
                <EmployeeFormBranches form={form as any} />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <div className="my-6">
              {employee.branches && employee.branches.length > 0 ? (
                <EmployeePermissionsEditor
                  employeeId={employee.id}
                  branches={employee.branches}
                  onSave={() => {
                    // Optionally refetch employee data or show success message
                    setIsOpen(false)
                  }}
                />
              ) : (
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Сотрудник не назначен ни одному филиалу.
                    Сначала добавьте филиалы в информацию сотрудника.
                  </p>
                </div>
              )}
            </div>
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
