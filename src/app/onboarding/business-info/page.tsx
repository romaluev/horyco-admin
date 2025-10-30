'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  useGetOnboardingProgress,
  useSubmitBusinessInfo
} from '@/entities/onboarding';
import {
  businessInfoSchema,
  type BusinessInfoFormValues
} from '@/features/onboarding/model';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import BaseLoading from '@/shared/ui/base-loading';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { Input } from '@/shared/ui/base/input';
import { Loader2 } from 'lucide-react';
import { getNextStep } from '@/shared/config/onboarding';
import { useFormPersist } from '@/shared/hooks/use-form-persist';
import { useUnsavedChangesWarning } from '@/shared/hooks/use-unsaved-changes-warning';
import { BUSINESS_TYPES } from '@/shared/config/business-types';

export default function BusinessInfoPage() {
  const router = useRouter();

  // Fetch onboarding progress
  const { data: progress, isLoading: progressLoading } =
    useGetOnboardingProgress();

  // Form initialization
  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      slug: '',
      logoUrl: ''
    }
  });

  // Draft saving functionality
  const { clearDraft } = useFormPersist(form, 'onboarding-business-info-draft');

  // Unsaved changes warning
  const { confirmNavigation } = useUnsavedChangesWarning(
    form.formState.isDirty
  );

  // Submit mutation
  const { mutate: submitBusinessInfo, isPending: isSubmitting } =
    useSubmitBusinessInfo({
      onSuccess: () => {
        clearDraft();
        const nextStep = getNextStep('BUSINESS_INFO_VERIFIED');
        router.push(nextStep?.route || '/onboarding/branch-setup');
      }
    });

  // Load existing data if available
  useEffect(() => {
    if (progress?.stepData?.BUSINESS_INFO_VERIFIED) {
      const data = progress.stepData.BUSINESS_INFO_VERIFIED;
      form.reset({
        businessName: data.businessName || '',
        businessType: data.businessType || '',
        slug: data.slug || '',
        logoUrl: data.logoUrl || ''
      });
    }
  }, [progress]);

  const onSubmit = async (data: BusinessInfoFormValues) => {
    submitBusinessInfo({
      businessName: data.businessName,
      businessType: data.businessType,
      slug: data.slug,
      logoUrl: data.logoUrl
    });
  };

  return (
    <OnboardingLayout
      currentStep={progress?.currentStep || 'BUSINESS_INFO_VERIFIED'}
      completedSteps={progress?.completedSteps || []}
      title='Расскажите о вашем бизнесе'
      description='Эта информация поможет нам настроить систему под ваши потребности'
    >
      {progressLoading ? (
        <BaseLoading />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Информация о заведении</CardTitle>
            <CardDescription>
              Заполните основные данные о вашем ресторане
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='businessName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название заведения *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Golden Dragon Restaurant'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Официальное название вашего ресторана
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='businessType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип заведения *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl className='w-60'>
                          <SelectTrigger>
                            <SelectValue placeholder='Выберите тип' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Это поможет подобрать подходящий шаблон меню
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL-адрес (slug)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='golden-dragon'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Необязательно. Для создания уникальной ссылки (например:
                        oshlab.uz/golden-dragon)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='logoUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на логотип</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://cdn.oshlab.uz/logos/my-logo.png'
                          type='url'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Необязательно. URL изображения вашего логотипа
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-4 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      if (confirmNavigation()) {
                        router.back();
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Назад
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Сохранение...
                      </>
                    ) : (
                      'Далее'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </OnboardingLayout>
  );
}
