import { Controller } from 'react-hook-form'

import { DatePicker, Input, Label, Textarea } from '@/shared/ui'

import type { UpdateEmployeeFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface UpdateEmployeeFormBasicProps {
  form: UseFormReturn<UpdateEmployeeFormData>
}

export const UpdateEmployeeFormBasic = ({
  form,
}: UpdateEmployeeFormBasicProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Полное имя <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          {...register('fullName')}
          placeholder="Введите полное имя"
          className="text-base md:text-sm"
        />
        {errors.fullName && (
          <p className="text-destructive text-sm">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="example@email.com"
            className="text-base md:text-sm"
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Дата рождения</Label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { value, onChange } }) => (
              <DatePicker value={value} onChange={onChange} />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hireDate">Дата приема на работу</Label>
          <Controller
            control={control}
            name="hireDate"
            render={({ field: { value, onChange } }) => (
              <DatePicker value={value} onChange={onChange} />
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
          className="resize-none"
          rows={4}
        />
      </div>
    </div>
  )
}
