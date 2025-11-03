'use client'

import { Pencil } from 'lucide-react'

import { BaseError, BaseLoading, Button } from '@/shared/ui'
import { Badge } from '@/shared/ui/base/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { useGetAllRoles } from '@/entities/role'
import { CreateRoleDialog, DeleteRoleDialog } from '@/features/role-form'


const SYSTEM_ROLES = ['Администратор', 'Менеджер', 'Кассир', 'Официант']

export default function RolesPage(): JSX.Element {
  const { data: rolesResponse, isLoading, isError } = useGetAllRoles()

  if (isLoading) {
    return <BaseLoading />
  }

  if (isError) {
    return <BaseError message="Ошибка при загрузке ролей" />
  }

  // Handle both array and paginated response
  const roles = Array.isArray(rolesResponse)
    ? rolesResponse
    : rolesResponse?.data || []

  const systemRoles = roles.filter((role) => SYSTEM_ROLES.includes(role.name))
  const customRoles = roles.filter((role) => !SYSTEM_ROLES.includes(role.name))

  return (
    <div className="space-y-6 p-4 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Роли и права</h1>
          <p className="text-muted-foreground">
            Управление ролями и разрешениями сотрудников
          </p>
        </div>
        <CreateRoleDialog />
      </div>

      {/* System Roles */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Системные роли</h2>
          <p className="text-muted-foreground text-sm">
            Встроенные роли, которые нельзя удалить
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {systemRoles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {role.description && (
                    <p className="text-muted-foreground text-sm">
                      {role.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Разрешений</span>
                    <Badge variant="secondary">
                      {role.permissions?.length || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" size="sm" disabled>
                  <Pencil className="h-4 w-4" />
                  Редактировать
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Roles */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Пользовательские роли</h2>
          <p className="text-muted-foreground text-sm">
            Созданные вами роли с настраиваемыми разрешениями
          </p>
        </div>

        {customRoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
            <h3 className="text-muted-foreground text-lg">
              Пользовательских ролей пока нет
            </h3>
            <CreateRoleDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {customRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle>{role.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {role.description && (
                      <p className="text-muted-foreground text-sm">
                        {role.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Разрешений</span>
                      <Badge variant="secondary">
                        {role.permissions?.length || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 border-t">
                  <Button variant="ghost" size="sm" disabled>
                    <Pencil className="h-4 w-4" />
                    Редактировать
                  </Button>
                  <DeleteRoleDialog role={role} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
