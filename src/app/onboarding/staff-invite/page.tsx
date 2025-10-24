'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { onboardingApi } from '@/entities/onboarding';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import { Button } from '@/shared/ui/base/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { Input } from '@/shared/ui/base/input';
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { PhoneInput } from '@/shared/ui/base/phone-input';
import { AlertCircle, Info, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const invitationSchema = z.object({
  fullName: z.string().min(2, { message: 'Введите полное имя' }),
  phone: z.string().min(4, { message: 'Введите корректный номер' }),
  email: z
    .string()
    .email({ message: 'Некорректный email' })
    .optional()
    .or(z.literal('')),
  roleId: z.string().min(1, { message: 'Выберите роль' })
});

const staffInviteSchema = z.object({
  invitations: z.array(invitationSchema).min(0)
});

type StaffInviteFormValues = z.infer<typeof staffInviteSchema>;

const ROLES = [
  { id: '2', name: 'Менеджер' },
  { id: '3', name: 'Кассир' },
  { id: '4', name: 'Официант' },
  { id: '5', name: 'Повар' }
];

export default function StaffInvitePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    currentStep: 'STAFF_INVITED',
    completedSteps: [
      'REGISTRATION_COMPLETE',
      'BUSINESS_INFO_VERIFIED',
      'BRANCH_SETUP',
      'MENU_TEMPLATE',
      'PAYMENT_SETUP'
    ]
  });

  const form = useForm<StaffInviteFormValues>({
    resolver: zodResolver(staffInviteSchema),
    defaultValues: {
      invitations: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invitations'
  });

  // TODO: Uncomment when API is ready
  // useEffect(() => {
  //   const fetchProgress = async () => {
  //     try {
  //       const progressData = await onboardingApi.getProgress();
  //       setProgress({
  //         currentStep: progressData.currentStep,
  //         completedSteps: progressData.completedSteps
  //       });
  //     } catch (err) {
  //       console.error('Failed to fetch progress:', err);
  //     }
  //   };
  //   fetchProgress();
  // }, []);

  const addInvitation = () => {
    append({
      fullName: '',
      phone: '',
      email: '',
      roleId: ''
    });
  };

  const onSubmit = async (data: StaffInviteFormValues) => {
    if (data.invitations.length === 0) {
      // Skip if no invitations
      handleSkip();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Uncomment when API is ready
      // await onboardingApi.submitStaffInvite({
      //   invitations: data.invitations.map((inv) => ({
      //     fullName: inv.fullName,
      //     phone: inv.phone,
      //     email: inv.email,
      //     roleId: parseInt(inv.roleId),
      //     branchIds: [1] // Default to first branch
      //   }))
      // });

      // TEMPORARY: Just simulate saving and navigate
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Приглашения отправлены');
      router.push('/onboarding/complete');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Не удалось отправить приглашения. Попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsLoading(true);

      // TODO: Uncomment when API is ready
      // await onboardingApi.skipStep({
      //   step: 'STAFF_INVITED',
      //   reason: 'Добавлю сотрудников позже'
      // });

      // TEMPORARY: Just navigate
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.info('Шаг пропущен');
      router.push('/onboarding/complete');
    } catch (err: any) {
      toast.error('Не удалось пропустить шаг');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={progress.currentStep}
      completedSteps={progress.completedSteps}
      title='Пригласите сотрудников'
      description='Добавьте членов команды для управления рестораном'
    >
      <Alert className='mb-6'>
        <Info className='h-4 w-4' />
        <AlertDescription>
          Этот шаг необязательный. Вы можете добавить сотрудников позже в
          разделе &quot;Персонал&quot;.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Пригласить команду</CardTitle>
          <CardDescription>
            Отправьте приглашения по SMS сотрудникам вашего ресторана
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-6'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {fields.length === 0 ? (
                <div className='py-8 text-center'>
                  <p className='text-muted-foreground mb-4'>
                    Пока не добавлено ни одного сотрудника
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={addInvitation}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Добавить сотрудника
                  </Button>
                </div>
              ) : (
                <div className='space-y-6'>
                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardHeader>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-base'>
                            Сотрудник #{index + 1}
                          </CardTitle>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => remove(index)}
                            disabled={isLoading}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <FormField
                          control={form.control}
                          name={`invitations.${index}.fullName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ФИО *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Анна Петрова'
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`invitations.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Телефон *</FormLabel>
                              <FormControl>
                                <PhoneInput
                                  defaultCountry={'UZ'}
                                  placeholder={'90 111 11 11'}
                                  limitMaxLength={true}
                                  countries={['UZ']}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`invitations.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type='email'
                                  placeholder='anna@example.com'
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormDescription>Необязательно</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`invitations.${index}.roleId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Роль *</FormLabel>
                              <FormControl>
                                <select
                                  className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                                  {...field}
                                  disabled={isLoading}
                                >
                                  <option value=''>Выберите роль</option>
                                  {ROLES.map((role) => (
                                    <option key={role.id} value={role.id}>
                                      {role.name}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type='button'
                    variant='outline'
                    onClick={addInvitation}
                    className='w-full'
                    disabled={isLoading}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Добавить ещё
                  </Button>
                </div>
              )}

              <div className='flex justify-between pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/onboarding/payment-setup')}
                  disabled={isLoading}
                >
                  Назад
                </Button>
                <div className='flex gap-4'>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={handleSkip}
                    disabled={isLoading}
                  >
                    Пропустить
                  </Button>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Отправка...
                      </>
                    ) : fields.length > 0 ? (
                      'Отправить приглашения'
                    ) : (
                      'Завершить'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
