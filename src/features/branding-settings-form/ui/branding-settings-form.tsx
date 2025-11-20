'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/base/button'
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
import { PhoneInput } from '@/shared/ui/base/phone-input'
import { Textarea } from '@/shared/ui/base/textarea'
import BaseLoading from '@/shared/ui/base-loading'
import { ColorPickerInput } from '@/shared/ui/color-picker-input'
import { FileUploader } from '@/shared/ui/file-uploader'

import {
  type IBrandingSettings,
  useBrandingSettings,
  useUpdateBranding,
} from '@/entities/settings'

import {
  type BrandingSettingsFormData,
  brandingSettingsSchema,
} from '../model/schema'

interface BrandingSettingsFormProps {
  branchId?: number
}

const extractValue = <T,>(setting: { value: T } | undefined): T | undefined => {
  return setting?.value
}

const convertToFormData = (
  settings: IBrandingSettings | undefined
): BrandingSettingsFormData => {
  if (!settings) {
    return {
      brandName: '',
      brandDescription: '',
      logoUrl: '',
      logoDarkUrl: '',
      faviconUrl: '',
      primaryColor: '#000000',
      secondaryColor: '#000000',
      facebookUrl: '',
      instagramUrl: '',
      telegramUrl: '',
      websiteUrl: '',
      contactPhone: '',
      contactEmail: '',
      contactAddress: '',
    }
  }

  return {
    brandName: extractValue(settings.brandName) || '',
    brandDescription: extractValue(settings.brandDescription) || '',
    logoUrl: extractValue(settings.logoUrl) || '',
    logoDarkUrl: extractValue(settings.logoDarkUrl) || '',
    faviconUrl: extractValue(settings.faviconUrl) || '',
    primaryColor: extractValue(settings.primaryColor) || '#000000',
    secondaryColor: extractValue(settings.secondaryColor) || '#000000',
    facebookUrl: extractValue(settings.facebookUrl) || '',
    instagramUrl: extractValue(settings.instagramUrl) || '',
    telegramUrl: extractValue(settings.telegramUrl) || '',
    websiteUrl: extractValue(settings.websiteUrl) || '',
    contactPhone: extractValue(settings.contactPhone) || '',
    contactEmail: extractValue(settings.contactEmail) || '',
    contactAddress: extractValue(settings.contactAddress) || '',
  }
}

const uploadFile = async (file: File, altText?: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const params = new URLSearchParams()
  params.append('folder', 'branding')
  if (altText) {
    params.append('altText', altText)
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/files/upload?${params.toString()}`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Ошибка загрузки файла')
  }

  const data = await response.json()
  // Return file ID only (backend will generate presigned URLs)
  return String(data.id)
}

export const BrandingSettingsForm = ({
  branchId,
}: BrandingSettingsFormProps) => {
  const { data: brandingSettings, isLoading } = useBrandingSettings(branchId)
  const { mutate: updateBranding, isPending } = useUpdateBranding(branchId)

  const [logoFiles, setLogoFiles] = useState<File[]>([])
  const [logoDarkFiles, setLogoDarkFiles] = useState<File[]>([])
  const [faviconFiles, setFaviconFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<BrandingSettingsFormData>({
    resolver: zodResolver(brandingSettingsSchema),
    defaultValues: convertToFormData(brandingSettings),
  })

  useEffect(() => {
    if (brandingSettings) {
      form.reset(convertToFormData(brandingSettings))
    }
  }, [brandingSettings, form])

  const handleSubmit = async (data: BrandingSettingsFormData) => {
    setIsUploading(true)

    try {
      // Upload files if selected
      if (logoFiles.length > 0 && logoFiles[0]) {
        const url = await uploadFile(logoFiles[0])
        data.logoUrl = url
        setLogoFiles([])
      }

      if (logoDarkFiles.length > 0 && logoDarkFiles[0]) {
        const url = await uploadFile(logoDarkFiles[0])
        data.logoDarkUrl = url
        setLogoDarkFiles([])
      }

      if (faviconFiles.length > 0 && faviconFiles[0]) {
        const url = await uploadFile(faviconFiles[0])
        data.faviconUrl = url
        setFaviconFiles([])
      }

      updateBranding(data)
    } catch (error) {
      toast.error('Ошибка загрузки файлов')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return <BaseLoading />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Brand Identity */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Идентичность бренда</h3>

          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название бренда *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Мой ресторан" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Описание вашего бизнеса"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логотип</FormLabel>
                <FormControl>
                  <FileUploader
                    value={logoFiles}
                    onValueChange={setLogoFiles}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    accept={{ 'image/*': [] }}
                    variant="image"
                  />
                </FormControl>
                {field.value && (
                  <FormDescription>
                    Текущий: {field.value.substring(0, 50)}...
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoDarkUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логотип (темная тема)</FormLabel>
                <FormControl>
                  <FileUploader
                    value={logoDarkFiles}
                    onValueChange={setLogoDarkFiles}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    accept={{ 'image/*': [] }}
                    variant="image"
                  />
                </FormControl>
                {field.value && (
                  <FormDescription>
                    Текущий: {field.value.substring(0, 50)}...
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faviconUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фавикон</FormLabel>
                <FormControl>
                  <FileUploader
                    value={faviconFiles}
                    onValueChange={setFaviconFiles}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    accept={{ 'image/*': [] }}
                    variant="image"
                  />
                </FormControl>
                {field.value && (
                  <FormDescription>
                    Текущий: {field.value.substring(0, 50)}...
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Цвета</h3>

          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPickerInput
                    label="Основной цвет"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPickerInput
                    label="Вторичный цвет"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Социальные сети</h3>

          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://facebook.com/myrestaurant"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="@myrestaurant" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="@myrestaurant" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Веб-сайт</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://myrestaurant.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Контактная информация</h3>

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="UZ"
                    placeholder="+998 90 123 45 67"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="info@myrestaurant.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Физический адрес"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || isUploading}>
            {isPending || isUploading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
