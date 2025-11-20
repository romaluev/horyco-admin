'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { IconUpload } from '@tabler/icons-react'
import { UploadIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { BASE_API_URL } from '@/shared/lib/axios'
import { getNameInitials } from '@/shared/lib/utils'
import { BaseLoading } from '@/shared/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/base/avatar'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import PasswordInput from '@/shared/ui/base/passsword-input'
import { Separator } from '@/shared/ui/base/separator'

import { useAuthStore } from '@/entities/auth/model/store'
import { employeeApi } from '@/entities/employee'

import { authApi } from '../model/api'

// Profile schema (personal information)
const profileSchema = z.object({
  fullName: z.string().min(1, 'Введите полное имя'),
  phone: z.string().regex(/^\+998\d{9}$/, 'Формат: +998XXXXXXXXX'),
})

// Password change schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export function ProfileView() {
  const { user, setUser, loadFullProfile, isLoadingProfile } = useAuthStore()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)

  // Load full profile on mount
  useEffect(() => {
    loadFullProfile().catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    },
  })

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Handle profile update
  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    try {
      if (!user) return

      const response = await authApi.updateProfile({
        id: user.id,
        fullName: values.fullName,
        phone: values.phone,
      })

      setUser(response)
      toast.success('Профиль успешно обновлен')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Ошибка при обновлении профиля')
    }
  }

  // Handle password change
  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      if (!user) return

      await employeeApi.changePassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })

      passwordForm.reset()
      toast.success('Пароль успешно изменен')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Ошибка при изменении пароля')
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      if (!user?.id) {
        toast.error('Ошибка: пользователь не найден')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB')
        return
      }

      setIsUploadingAvatar(true)
      const loadingToast = toast.loading('Загрузка фото...')

      // Upload file directly to /admin/files/upload?folder=EMPLOYEES
      const uploadedFile = await employeeApi.uploadEmployeeAvatar(
        file,
        user.fullName
      )

      // Save file ID only (backend will generate presigned URLs in avatar field)
      const photoUrl = String(uploadedFile.id)

      await authApi.updateProfile({
        id: user.id,
        photoUrl: photoUrl,
      })

      // Refresh profile
      await loadFullProfile()

      toast.dismiss(loadingToast)
      toast.success('Фото профиля обновлено')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Ошибка при загрузке фото')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Group permissions by category
  const groupedPermissions = user?.roles?.reduce(
    (acc, role) => {
      role.permissions?.forEach((permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        const categoryPermissions = acc[permission.category]
        if (
          categoryPermissions &&
          !categoryPermissions.some((p) => p.name === permission.name)
        ) {
          categoryPermissions.push(permission)
        }
      })
      return acc
    },
    {} as Record<string, { id: number; name: string; category: string }[]>
  )

  if (isLoadingProfile) {
    return <BaseLoading />
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-h-[80vh] space-y-6 overflow-y-auto px-2 py-4 md:px-6">
      {/* Section 1: Avatar Section */}
      <Card className="gap-2 py-4">
        <CardHeader className="px-2">
          <CardTitle>Фото профиля</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="flex flex-wrap items-center gap-4 max-md:justify-center">
            <div className="group relative">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={
                    user.photoUrl
                      ? `${BASE_API_URL}/admin/files/${user.photoUrl}`
                      : undefined
                  }
                  alt={user.fullName}
                />
                <AvatarFallback className="text-lg">
                  {getNameInitials(user.fullName) || <UploadIcon />}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <IconUpload className="h-6 w-6 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{user.fullName}</h3>
              <p className="text-muted-foreground">{user.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Personal Information */}
      <Card className="gap-2 py-4">
        <CardHeader className="px-2">
          <CardTitle>Личная информация</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Полное имя <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Введите полное имя" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Телефон <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+998901234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Сохранить изменения</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Section 3: Account Information */}
      <Card className="gap-2 py-4">
        <CardHeader className="px-2">
          <CardTitle>Информация об учетной записи</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2">
          {/* Roles */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Роли</h4>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Badge key={role.id} variant="secondary">
                    {role.name}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Роли не назначены
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          <div>
            <Collapsible
              open={isPermissionsOpen}
              onOpenChange={setIsPermissionsOpen}
            >
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                {isPermissionsOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
                Права доступа
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3">
                {groupedPermissions &&
                Object.keys(groupedPermissions).length > 0 ? (
                  Object.entries(groupedPermissions).map(
                    ([category, permissions]) => (
                      <div key={category}>
                        <p className="mb-1 text-sm font-medium">{category}</p>
                        <div className="flex flex-wrap gap-1">
                          {permissions.map((permission) => (
                            <Badge key={permission.id} variant="outline">
                              {permission.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Права доступа не найдены
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <Separator />

          {/* Account Status */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Статус аккаунта</h4>
            <Badge variant={user.isActive ? 'default' : 'destructive'}>
              {user.isActive ? 'Активен' : 'Неактивен'}
            </Badge>
          </div>

          <Separator />

          {/* Active Branch */}
          {user.activeBranch && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Активный филиал</h4>
              <p className="text-sm">{user.activeBranch.name}</p>
              {user.activeBranch.address && (
                <p className="text-muted-foreground text-xs">
                  {user.activeBranch.address}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Security Section */}
      <Card className="gap-2 py-4">
        <CardHeader className="px-2">
          <CardTitle>Безопасность</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Текущий пароль <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Введите текущий пароль"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Новый пароль <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Введите новый пароль"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Подтвердите пароль{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Подтвердите пароль"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Изменить пароль</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Section 5: Branch Assignments */}
      {user.branches && user.branches.length > 0 && (
        <Card className="gap-2 py-4">
          <CardHeader className="px-2">
            <CardTitle>Назначенные филиалы</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-3">
              {user.branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`rounded-lg border p-3 ${
                    branch.id === user.activeBranchId
                      ? 'border-primary bg-primary/5'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{branch.name}</p>
                      {branch.address && (
                        <p className="text-muted-foreground text-sm">
                          {branch.address}
                        </p>
                      )}
                    </div>
                    {branch.id === user.activeBranchId && (
                      <Badge>Активный</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
