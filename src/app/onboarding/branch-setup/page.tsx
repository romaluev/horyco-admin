'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { getNextStep, getPreviousStep } from '@/shared/config/onboarding'
import { UZBEKISTAN_CITIES } from '@/shared/config/uzbekistan-locations'
import { useFormPersist } from '@/shared/hooks/use-form-persist'
import { useUnsavedChangesWarning } from '@/shared/hooks/use-unsaved-changes-warning'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Switch } from '@/shared/ui/base/switch'
import { TimePicker } from '@/shared/ui/base/time-picker'
import { OnboardingLayout } from '@/shared/ui/onboarding'

import {
  useSubmitBranchSetup,
  useStepValidation,
} from '@/entities/onboarding'
import {
  type BranchSetupFormValues,
  branchSetupSchema,
} from '@/features/onboarding/model'

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' },
]

export default function BranchSetupPage() {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [availableRegions, setAvailableRegions] = useState<
    { id: string; name: string }[]
  >([])

  // Validate step access and get progress
  const { progress } = useStepValidation('branch_setup')

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
        sunday: { open: '10:00', close: '23:00', isClosed: false },
      },
      dineInEnabled: true,
      takeawayEnabled: true,
      deliveryEnabled: false,
    },
  })

  // Draft saving functionality
  const { clearDraft } = useFormPersist(form, 'onboarding-branch-setup-draft', {
    exclude: ['dineInEnabled', 'takeawayEnabled', 'deliveryEnabled'],
  })

  // Unsaved changes warning
  const { confirmNavigation } = useUnsavedChangesWarning(form.formState.isDirty)

  // Load existing data from API progress (takes priority over draft)
  useEffect(() => {
    if (progress?.stepData?.branch_setup) {
      const data = progress.stepData.branch_setup as Record<string, unknown>

      // Load form data from API
      form.reset({
        branchName: (data.branchName as string) || '',
        address: (data.address as string) || '',
        city: (data.city as string) || '',
        region: (data.region as string) || '',
        businessHours: {
          monday: { open: '09:00', close: '23:00', isClosed: false },
          tuesday: { open: '09:00', close: '23:00', isClosed: false },
          wednesday: { open: '09:00', close: '23:00', isClosed: false },
          thursday: { open: '09:00', close: '23:00', isClosed: false },
          friday: { open: '09:00', close: '01:00', isClosed: false },
          saturday: { open: '10:00', close: '01:00', isClosed: false },
          sunday: { open: '10:00', close: '23:00', isClosed: false },
        },
        dineInEnabled: true,
        takeawayEnabled: true,
        deliveryEnabled: false,
      })

      // If city is available, set up regions
      if (data.city) {
        const city = UZBEKISTAN_CITIES.find((c) => c.name === data.city)
        if (city) {
          setSelectedCity(city.id)
          setAvailableRegions(city.regions)
        }
      }
    }
  }, [progress, form])

  // Submit mutation
  const { mutate: submitBranchSetup, isPending: isSubmitting } =
    useSubmitBranchSetup({
      onSuccess: () => {
        clearDraft()
        const nextStep = getNextStep('branch_setup')
        router.push(nextStep?.route || '/onboarding/menu-template')
      },
    })

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    const city = UZBEKISTAN_CITIES.find((c) => c.id === cityId)
    if (city) {
      form.setValue('city', city.name)
      form.setValue('region', '') // Clear region when city changes
      setAvailableRegions(city.regions)
    }
  }

  const handleRegionChange = (regionId: string) => {
    const region = availableRegions.find((r) => r.id === regionId)
    if (region) {
      form.setValue('region', region.name)
    }
  }

  const onSubmit = async (data: BranchSetupFormValues) => {
    // Filter out isClosed field for API submission
    const businessHours = Object.entries(data.businessHours).reduce(
      (acc, [day, hours]) => {
        acc[day as keyof typeof data.businessHours] = {
          open: hours.open,
          close: hours.close,
        }
        return acc
      },
      {} as {
        monday: { open: string; close: string }
        tuesday: { open: string; close: string }
        wednesday: { open: string; close: string }
        thursday: { open: string; close: string }
        friday: { open: string; close: string }
        saturday: { open: string; close: string }
        sunday: { open: string; close: string }
      }
    )

    submitBranchSetup({
      branchName: data.branchName,
      address: data.address,
      city: data.city,
      region: data.region,
      businessHours,
      dineInEnabled: data.dineInEnabled,
      takeawayEnabled: data.takeawayEnabled,
      deliveryEnabled: data.deliveryEnabled,
    })
  }

  const handleBack = async () => {
    const canLeave = await confirmNavigation()
    if (canLeave) {
      const previousStep = getPreviousStep('branch_setup')
      router.push(previousStep?.route || '/onboarding/business-info')
    }
  }

  return (
    <OnboardingLayout
      currentStep="branch_setup"
      completedSteps={progress?.completedSteps || ['business_identity']}
      skippedSteps={progress?.skippedSteps || []}
      title="Настройка филиала"
      description="Укажите информацию о вашем первом филиале"
    >
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Настройка филиала</CardTitle>
          <CardDescription>
            Укажите информацию о вашем первом филиале
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Branch Name */}
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название филиала *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Главный филиал"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City and Region Selection */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
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
                            <SelectValue placeholder="Выберите город" />
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
                  name="region"
                  render={() => (
                    <FormItem>
                      <FormLabel>Район *</FormLabel>
                      <Select
                        onValueChange={handleRegionChange}
                        disabled={!selectedCity || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите район" />
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Полный адрес *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ул. Мустакиллик, д. 45"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Hours */}
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Часы работы</h3>
                  <p className="text-muted-foreground text-sm">
                    Настройте график работы для каждого дня недели
                  </p>
                </div>

                <div className="space-y-3">
                  {DAYS_OF_WEEK.map(({ key, label }) => {
                    const dayKey =
                      key as keyof BranchSetupFormValues['businessHours']
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-4 rounded-lg border p-3"
                      >
                        <div className="w-32">
                          <span className="text-sm font-medium">{label}</span>
                        </div>

                        <div className="flex flex-1 items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`businessHours.${dayKey}.open`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
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
                          <span className="text-muted-foreground">—</span>
                          <FormField
                            control={form.control}
                            name={`businessHours.${dayKey}.close`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
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

                        <FormField
                          control={form.control}
                          name={`businessHours.${dayKey}.isClosed`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-sm font-normal">
                                Выходной
                              </FormLabel>
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
                    )
                  })}
                </div>
              </div>

              {/* Service Types */}
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    Типы обслуживания
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Выберите доступные способы обслуживания клиентов
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="dineInEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <Card className="h-full p-0">
                          <CardContent className="flex flex-col items-center justify-center gap-3 p-3 text-center">
                            <div className="space-y-1">
                              <FormLabel className="mx-auto w-max text-base font-semibold">
                                В зале
                              </FormLabel>
                              <p className="text-muted-foreground text-xs">
                                Можно заказать в зал
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                          </CardContent>
                        </Card>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="takeawayEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <Card className="h-full p-0">
                          <CardContent className="flex flex-col items-center justify-center gap-3 p-3 text-center">
                            <div className="space-y-1">
                              <FormLabel className="mx-auto w-max text-base font-semibold">
                                Собой
                              </FormLabel>
                              <p className="text-muted-foreground text-xs">
                                Можно забрать с собой
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                          </CardContent>
                        </Card>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <Card className="h-full p-0">
                          <CardContent className="flex flex-col items-center justify-center gap-3 p-3 text-center">
                            <div className="space-y-1">
                              <FormLabel className="mx-auto w-max text-base font-semibold">
                                Доставка
                              </FormLabel>
                              <p className="text-muted-foreground text-xs">
                                Можно заказать доставку
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                          </CardContent>
                        </Card>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Назад
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Продолжить
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  )
}
