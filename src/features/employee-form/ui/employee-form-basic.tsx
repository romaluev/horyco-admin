import { Controller } from 'react-hook-form';

import { DatePicker, Input, Label, Textarea } from '@/shared/ui'
import { PhoneInput } from '@/shared/ui/base/phone-input';

import type { CreateEmployeeFormData } from '../model/contract';
import type { UseFormReturn } from 'react-hook-form';

interface EmployeeFormBasicProps {
  form: UseFormReturn<CreateEmployeeFormData>;
}

export const EmployeeFormBasic = ({ form }: EmployeeFormBasicProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='fullName'>
          Полное имя <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='fullName'
          {...register('fullName')}
          placeholder='Введите полное имя'
          className='text-base md:text-sm'
        />
        {errors.fullName && (
          <p className='text-destructive text-sm'>{errors.fullName.message}</p>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='phone'>
            Телефон <span className='text-destructive'>*</span>
          </Label>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <PhoneInput
                id='phone'
                value={field.value}
                onChange={field.onChange}
                defaultCountry='UZ'
                countries={['UZ']}
                placeholder='90 123 45 67'
                limitMaxLength
                className='text-base md:text-sm'
              />
            )}
          />
          {errors.phone && <p className='text-destructive text-sm'>{errors.phone.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            placeholder='example@example.com'
            className='text-base md:text-sm'
          />
          {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>
          Пароль <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='password'
          type='password'
          {...register('password')}
          placeholder='Минимум 6 символов'
          className='text-base md:text-sm'
        />
        {errors.password && <p className='text-destructive text-sm'>{errors.password.message}</p>}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='birthDate'>Дата рождения</Label>
          <Controller
            name='birthDate'
            control={control}
            render={({ field }) => (
              <DatePicker
                id='birthDate'
                value={field.value}
                onChange={field.onChange}
                placeholder='Выберите дату рождения'
                className='text-base md:text-sm'
              />
            )}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='hireDate'>Дата приема на работу</Label>
          <Controller
            name='hireDate'
            control={control}
            render={({ field }) => (
              <DatePicker
                id='hireDate'
                value={field.value}
                onChange={field.onChange}
                placeholder='Выберите дату приема'
                className='text-base md:text-sm'
              />
            )}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='notes'>Примечания</Label>
        <Textarea
          id='notes'
          {...register('notes')}
          placeholder='Дополнительная информация о сотруднике'
          className='min-h-[100px] text-base md:text-sm'
        />
      </div>
    </div>
  );
};
