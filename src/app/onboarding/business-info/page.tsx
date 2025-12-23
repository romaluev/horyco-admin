'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { BUSINESS_TYPES } from '@/shared/config/business-types'
import { getNextStep } from '@/shared/config/onboarding'
import { useFormPersist } from '@/shared/hooks/use-form-persist'
import { useUnsavedChangesWarning } from '@/shared/hooks/use-unsaved-changes-warning'
import { uploadFile } from '@/shared/lib/file-upload'
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
  FormDescription,
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
import BaseLoading from '@/shared/ui/base-loading'
import { FileUploader } from '@/shared/ui/file-uploader'
import { OnboardingLayout } from '@/shared/ui/onboarding'

import {
  useSubmitBusinessInfo,
  useStepValidation,
} from '@/entities/onboarding'
import {
  type BusinessInfoFormValues,
  businessInfoSchema,
} from '@/features/onboarding/model'

const uploadBusinessLogo = async (file: File): Promise<string> => {
  const response = await uploadFile({
    file,
    entityType: 'TENANT',
    entityId: 0,
    altText: 'Business Logo',
  })
  return String(response.id)
}

export default function BusinessInfoPage() {
  const router = useRouter()
  const [logoFiles, setLogoFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Validate step access and get progress
  const { progress, isLoading: isProgressLoading } =
    useStepValidation('business_identity')

  // Form initialization
  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      slug: '',
      logoUrl: '',
    },
  })

  // Draft saving functionality
  const { clearDraft } = useFormPersist(form, 'onboarding-business-info-draft')

  // Unsaved changes warning
  const { confirmNavigation } = useUnsavedChangesWarning(form.formState.isDirty)

  // Submit mutation
  const { mutate: submitBusinessInfo, isPending: isSubmitting } =
    useSubmitBusinessInfo({
      onSuccess: () => {
        clearDraft()
        const nextStep = getNextStep('business_identity')
        router.push(nextStep?.route || '/onboarding/branch-setup')
      },
    })

  // Load existing data from API progress (takes priority over draft)
  useEffect(() => {
    if (progress?.stepData?.business_identity) {
      const data = progress.stepData.business_identity as Record<
        string,
        unknown
      >
      form.reset({
        businessName: (data.businessName as string) || '',
        businessType: (data.businessType as string) || '',
        slug: (data.slug as string) || '',
        logoUrl: (data.logoUrl as string) || '',
      })
    }
  }, [progress, form])

  const onSubmit = async (data: BusinessInfoFormValues) => {
    setIsUploading(true)

    try {
      // Upload logo file if selected
      if (logoFiles.length > 0 && logoFiles[0]) {
        const url = await uploadBusinessLogo(logoFiles[0])
        data.logoUrl = url
        setLogoFiles([])
      }

      submitBusinessInfo({
        businessName: data.businessName,
        businessType: data.businessType,
        slug: data.slug,
        logoUrl: data.logoUrl,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep="business_identity"
      completedSteps={progress?.completedSteps || []}
      skippedSteps={progress?.skippedSteps || []}
      title="Расскажите о вашем бизнесе"
      description="Эта информация поможет нам настроить систему под ваши потребности"
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
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название заведения *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Golden Dragon Restaurant"
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
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип заведения *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl className="w-60">
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип" />
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL-адрес (slug) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="golden-dragon"
                          {...field}
                          disabled={isSubmitting || isUploading}
                        />
                      </FormControl>
                      <FormDescription>
                        Для создания уникальной ссылки (например:
                        Horyco.uz/golden-dragon). Только строчные буквы, цифры и
                        дефисы.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логотип заведения</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={logoFiles}
                          onValueChange={setLogoFiles}
                          maxFiles={1}
                          maxSize={5 * 1024 * 1024}
                          accept={{
                            'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
                          }}
                          disabled={isSubmitting || isUploading}
                          variant="image"
                        />
                      </FormControl>
                      <FormDescription>
                        Необязательно. Загрузите логотип вашего заведения (до 5
                        МБ)
                      </FormDescription>
                      {field.value && (
                        <p className="text-muted-foreground text-sm">
                          Текущий логотип: {field.value}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (confirmNavigation()) {
                        router.back()
                      }
                    }}
                    disabled={isSubmitting || isUploading}
                  >
                    Назад
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isUploading}>
                    {isSubmitting || isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? 'Загрузка...' : 'Сохранение...'}
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
  )
}
