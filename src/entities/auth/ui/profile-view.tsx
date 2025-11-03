'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconUpload } from '@tabler/icons-react';
import { UploadIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { BASE_API_URL } from '@/shared/lib/axios';
import { getNameInitials } from '@/shared/lib/utils';
import { BaseLoading } from '@/shared/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/base/avatar';
import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import PasswordInput from '@/shared/ui/base/passsword-input';

import { useAuthStore } from '@/entities/auth/model/store';

import { authApi } from '../model/api';
import { profileSchema } from '../model/contract';

import type * as z from 'zod';




export function ProfileView() {
  const { user, setUser, me, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user) me();
  }, [user, me]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      password: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      if (!user) return;

      const response = await authApi.updateProfile({
        id: user.id,
        fullName: values.fullName,
        ...(values.password && { password: values.password })
      });

      setUser(response);
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка при обновлении профиля');
    }
  }

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!user?.id) {
        toast.error('Ошибка: пользователь не найден');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }

      const loadingToast = toast.loading('Загрузка фото...');

      // Upload using presigned URL flow
      const { requestPresignedUploadUrl, uploadToPresignedUrl, confirmUpload } =
        await import('@/entities/file');

      const presignedData = await requestPresignedUploadUrl({
        entityType: 'EMPLOYEE',
        entityId: user.id,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        altText: user.fullName,
      });

      await uploadToPresignedUrl(presignedData.data.uploadUrl, file);

      const response = await confirmUpload({
        fileId: presignedData.data.fileId,
        fileKey: presignedData.data.fileKey
      });

      // Get the photo URL
      const photoUrl = response.variants.medium || response.variants.original;
      if (photoUrl) {
        // Update profile with the photo URL
        await authApi.updateProfile({
          id: user.id,
          fullName: user.fullName,
          photoUrl: photoUrl,
        });

        // Refresh user data
        await me();
        toast.dismiss(loadingToast);
        toast.success('Фото профиля обновлено');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Ошибка при загрузке фото');
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    <BaseLoading />;
  }

  return (
    <Card className='m-8'>
      <CardHeader>
        <CardTitle>Профиль</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-wrap items-center gap-4 max-md:justify-center'>
            <div className='group relative'>
              <Avatar className='h-40 w-40'>
                <AvatarImage
                  src={
                    user.photoUrl
                      ? `${BASE_API_URL}/file/${user.photoUrl}`
                      : undefined
                  }
                  alt={user.fullName}
                />
                <AvatarFallback className='text-lg'>
                  {getNameInitials(user.fullName) || <UploadIcon />}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor='avatar-upload'
                className='absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <IconUpload className='h-6 w-6 text-white' />
                <input
                  id='avatar-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <div>
              <h3 className='text-2xl font-semibold'>{user.fullName}</h3>
              <p className='text-muted-foreground'>{user.phone}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Полное имя</FormLabel>
                      <FormControl>
                        <Input placeholder='Введите полное имя' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Новый пароль</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Введите новый пароль'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтвердите пароль</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Подтвердите пароль'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type='submit'>Обновить профиль</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
