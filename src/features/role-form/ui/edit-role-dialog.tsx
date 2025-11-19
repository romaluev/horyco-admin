import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/ui'

import { useUpdateRole } from '@/entities/role'

import { PermissionSelector } from './permission-selector'
import { updateRoleSchema } from '../model/contract'

import type { UpdateRoleFormData } from '../model/contract'
import type { IRole } from '@/entities/role'

interface EditRoleDialogProps {
  role: IRole
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const EditRoleDialog = ({
  role,
  isOpen,
  onOpenChange,
}: EditRoleDialogProps) => {
  const form = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description || '',
      permissionIds: role.permissions?.map((p) => p.id) || [],
      branchRestriction: role.branchRestriction || 'multiple',
    },
  })

  const { mutate: updateRole, isPending } = useUpdateRole()

  // Reset form when role changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: role.name,
        description: role.description || '',
        permissionIds: role.permissions?.map((p) => p.id) || [],
        branchRestriction: role.branchRestriction || 'multiple',
      })
    }
  }, [isOpen, role, form])

  const onSubmit = (data: UpdateRoleFormData): void => {
    updateRole(
      { id: role.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (open: boolean): void => {
    onOpenChange(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать роль</DialogTitle>
          <DialogDescription>
            Обновите настройки роли и разрешения
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Например: Менеджер зала"
                className="text-base md:text-sm"
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Краткое описание роли"
                className="min-h-[80px] text-base md:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchRestriction">
                Ограничение на филиалы
              </Label>
              <Select
                value={form.watch('branchRestriction')}
                onValueChange={(value) =>
                  form.setValue(
                    'branchRestriction',
                    value as 'single' | 'multiple'
                  )
                }
              >
                <SelectTrigger id="branchRestriction" className="text-base md:text-sm">
                  <SelectValue placeholder="Выберите ограничение" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple">
                    Множественные филиалы
                  </SelectItem>
                  <SelectItem value="single">Один филиал</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-sm">
                Может ли сотрудник с этой ролью работать в нескольких филиалах
              </p>
            </div>

            <PermissionSelector form={form} />

            {form.formState.errors.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
