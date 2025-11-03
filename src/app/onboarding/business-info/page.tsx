'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { BUSINESS_TYPES } from '@/shared/config/business-types';
import { getNextStep } from '@/shared/config/onboarding';
import { useFormPersist } from '@/shared/hooks/use-form-persist';
import { useUnsavedChangesWarning } from '@/shared/hooks/use-unsaved-changes-warning';
import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import BaseLoading from '@/shared/ui/base-loading';
import { OnboardingLayout } from '@/shared/ui/onboarding';

import {
  useGetOnboardingProgress,
  useSubmitBusinessInfo
} from '@/entities/onboarding';
import {
  businessInfoSchema,
  type BusinessInfoFormValues
} from '@/features/onboarding/model';

export default function BusinessInfoPage() {
  const router = useRouter();

  // Fetch onboarding progress
  const { data: progress, isLoading: isProgressLoading } =
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
        const nextStep = getNextStep('business_identity');
        router.push(nextStep?.route || '/onboarding/branch-setup');
      }
    });

  // Load existing data if available
  useEffect(() => {
    if (progress?.stepData?.business_identity) {
      const data = progress.stepData.business_identity;
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
      currentStep={progress?.currentStep || 'business_identity'}
      completedSteps={progress?.completedSteps || []}
      title='Расскажите о вашем бизнесе'
      description='Эта информация поможет нам настроить систему под ваши потребности'
    >
      {isProgressLoading ? (
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
