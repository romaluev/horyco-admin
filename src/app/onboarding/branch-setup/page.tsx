'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  useGetOnboardingProgress,
  useSubmitBranchSetup
} from '@/entities/onboarding';
import {
  type BranchSetupFormValues,
  branchSetupSchema
} from '@/features/onboarding/model';
import { OnboardingLayout } from '@/shared/ui/onboarding';
import { UZBEKISTAN_CITIES } from '@/shared/config/uzbekistan-locations';
import BaseLoading from '@/shared/ui/base-loading';
import { Button } from '@/shared/ui/base/button';
import {
  Form,
  FormControl,
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
import { Switch } from '@/shared/ui/base/switch';
import { Checkbox } from '@/shared/ui/base/checkbox';
import { TimePicker } from '@/shared/ui/base/time-picker';
import { Loader2 } from 'lucide-react';
import { getNextStep, getPreviousStep } from '@/shared/config/onboarding';
import { useFormPersist } from '@/shared/hooks/use-form-persist';
import { useUnsavedChangesWarning } from '@/shared/hooks/use-unsaved-changes-warning';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' }
];

export default function BranchSetupPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableRegions, setAvailableRegions] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Fetch onboarding progress
  const { data: progress, isLoading: progressLoading } =
    useGetOnboardingProgress();

  // Form initialization
  const form = useForm<BranchSetupFormValues>({
    resolver: zodResolver(branchSetupSchema),
    defaultValues: {
      branchName: '',
      address: '',
      city: '',
      region: '',
      businessHours: {
        monday: { open: '09:00', close: '23:00', isClosed: false },
        tuesday: { open: '09:00', close: '23:00', isClosed: false },
        wednesday: { open: '09:00', close: '23:00', isClosed: false },
        thursday: { open: '09:00', close: '23:00', isClosed: false },
        friday: { open: '09:00', close: '01:00', isClosed: false },
        saturday: { open: '10:00', close: '01:00', isClosed: false },
        sunday: { open: '10:00', close: '23:00', isClosed: false }
      },
      dineInEnabled: true,
      takeawayEnabled: true,
      deliveryEnabled: false
    }
  });

  // Draft saving functionality
  const { clearDraft } = useFormPersist(form, 'onboarding-branch-setup-draft', {
    exclude: ['dineInEnabled', 'takeawayEnabled', 'deliveryEnabled']
  });

  // Unsaved changes warning
  const { confirmNavigation } = useUnsavedChangesWarning(
    form.formState.isDirty
  );

  // Submit mutation
  const { mutate: submitBranchSetup, isPending: isSubmitting } =
    useSubmitBranchSetup({
      onSuccess: () => {
        clearDraft();
        const nextStep = getNextStep('BRANCH_SETUP');
        router.push(nextStep?.route || '/onboarding/menu-template');
      }
    });

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    const city = UZBEKISTAN_CITIES.find((c) => c.id === cityId);
    if (city) {
      form.setValue('city', city.name);
      form.setValue('region', ''); // Clear region when city changes
      setAvailableRegions(city.regions);
    }
  };

  const handleRegionChange = (regionId: string) => {
    const region = availableRegions.find((r) => r.id === regionId);
    if (region) {
      form.setValue('region', region.name);
    }
  };

  const onSubmit = async (data: BranchSetupFormValues) => {
    // Filter out isClosed field for API submission
    const businessHours = Object.entries(data.businessHours).reduce(
      (acc, [day, hours]) => {
        acc[day as keyof typeof data.businessHours] = {
          open: hours.open,
          close: hours.close
        };
        return acc;
      },
      {} as Record<string, { open: string; close: string }>
    );

    submitBranchSetup({
      branchName: data.branchName,
      address: data.address,
      city: data.city,
      region: data.region,
      businessHours: businessHours as any,
      dineInEnabled: data.dineInEnabled,
      takeawayEnabled: data.takeawayEnabled,
      deliveryEnabled: data.deliveryEnabled
    });
  };

  const handleBack = async () => {
    const canLeave = await confirmNavigation();
    if (canLeave) {
      const previousStep = getPreviousStep('BRANCH_SETUP');
      router.push(previousStep?.route || '/onboarding/business-info');
    }
  };

  if (progressLoading) {
    return <BaseLoading />;
  }

  return (
    <OnboardingLayout
      currentStep='BRANCH_SETUP'
      completedSteps={['BUSINESS_INFO_VERIFIED']}
      title='Настройка филиала'
      description='Укажите информацию о вашем первом филиале'
    >
      <Card className='mx-auto w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>Настройка филиала</CardTitle>
          <CardDescription>
            Укажите информацию о вашем первом филиале
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Branch Name */}
              <FormField
                control={form.control}
                name='branchName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название филиала *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Главный филиал'
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City and Region Selection */}
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='city'
                  render={() => (
                    <FormItem>
                      <FormLabel>Город *</FormLabel>
                      <Select
                        onValueChange={handleCityChange}
                        value={selectedCity}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Выберите город' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UZBEKISTAN_CITIES.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='region'
                  render={() => (
                    <FormItem>
                      <FormLabel>Район *</FormLabel>
                      <Select
                        onValueChange={handleRegionChange}
                        disabled={!selectedCity || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Выберите район' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRegions.map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Полный адрес *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='ул. Мустакиллик, д. 45'
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Hours */}
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 text-sm font-medium'>Часы работы</h3>
                  <p className='text-muted-foreground text-sm'>
                    Настройте график работы для каждого дня недели
                  </p>
                </div>

                <div className='space-y-3'>
                  {DAYS_OF_WEEK.map(({ key, label }) => {
                    const dayKey =
                      key as keyof BranchSetupFormValues['businessHours'];
                    return (
                      <div
                        key={key}
                        className='flex items-center gap-4 rounded-lg border p-3'
                      >
                        <div className='w-32'>
                          <span className='text-sm font-medium'>{label}</span>
                        </div>

                        <FormField
                          control={form.control}
                          name={`businessHours.${dayKey}.isClosed`}
                          render={({ field }) => (
                            <FormItem className='flex items-center space-x-2'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel className='cursor-pointer text-sm font-normal'>
                                Выходной
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className='flex flex-1 items-center gap-2'>
                          <FormField
                            control={form.control}
                            name={`businessHours.${dayKey}.open`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <TimePicker
                                    {...field}
                                    disabled={
                                      form.watch(
                                        `businessHours.${dayKey}.isClosed`
                                      ) || isSubmitting
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <span className='text-muted-foreground'>—</span>
                          <FormField
                            control={form.control}
                            name={`businessHours.${dayKey}.close`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <TimePicker
                                    {...field}
                                    disabled={
                                      form.watch(
                                        `businessHours.${dayKey}.isClosed`
                                      ) || isSubmitting
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Types */}
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 text-sm font-medium'>
                    Типы обслуживания
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Выберите доступные способы обслуживания клиентов
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='dineInEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Обслуживание в зале (Dine-in)
                        </FormLabel>
                        <p className='text-muted-foreground text-sm'>
                          Управление столами и обслуживание официантами
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='takeawayEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          На вынос (Takeaway)
                        </FormLabel>
                        <p className='text-muted-foreground text-sm'>
                          Заказы для самовывоза клиентами
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='deliveryEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Доставка (Delivery)
                        </FormLabel>
                        <p className='text-muted-foreground text-sm'>
                          Доставка заказов курьерами
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Назад
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Продолжить
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
