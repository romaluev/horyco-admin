import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker, Input, Label, Textarea } from '@/shared/ui'
import { PhoneInput } from '@/shared/ui/base/phone-input'

import type { CreateEmployeeFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface EmployeeFormBasicProps {
  form: UseFormReturn<CreateEmployeeFormData>
}

export const EmployeeFormBasic = ({ form }: EmployeeFormBasicProps) => {
  const { t } = useTranslation('organization')
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">
          {t('employee.form.basicInfo.fullNameRequired')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          {...register('fullName')}
          placeholder={t('employee.form.placeholders.fullName')}
          className="text-base md:text-sm"
        />
        {errors.fullName && (
          <p className="text-destructive text-sm">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">
            {t('employee.form.basicInfo.phoneRequired')} <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="phone"
                value={field.value}
                onChange={field.onChange}
                defaultCountry="UZ"
                countries={['UZ']}
                placeholder="90 123 45 67"
                limitMaxLength
                className="text-base md:text-sm"
              />
            )}
          />
          {errors.phone && (
            <p className="text-destructive text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('employee.form.basicInfo.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('employee.form.placeholders.email')}
            className="text-base md:text-sm"
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {t('employee.form.basicInfo.passwordRequired')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder={t('employee.form.basicInfo.passwordPlaceholder')}
          className="text-base md:text-sm"
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birthDate">{t('employee.form.basicInfo.birthDate')}</Label>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="birthDate"
                value={field.value}
                onChange={field.onChange}
                placeholder="Выберите дату рождения"
                className="text-base md:text-sm"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hireDate">Дата приема на работу</Label>
          <Controller
            name="hireDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="hireDate"
                value={field.value}
                onChange={field.onChange}
                placeholder="Выберите дату приема"
                className="text-base md:text-sm"
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Примечания</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Дополнительная информация о сотруднике"
          className="min-h-[100px] text-base md:text-sm"
        />
      </div>
    </div>
  )
}
