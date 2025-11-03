import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { cn } from '@/shared/lib/utils';
import {
  BaseLoading,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';

import { useCreateEmployee } from '@/entities/employee';

import { EmployeeFormBasic } from './employee-form-basic';
import { EmployeeFormBranches } from './employee-form-branches';
import { EmployeeFormRoles } from './employee-form-roles';
import { createEmployeeSchema } from '../model/contract';

import type { CreateEmployeeFormData } from '../model/contract';

const STEPS = [
  { number: 1, title: 'Основная информация', description: 'Шаг 1 из 3' },
  { number: 2, title: 'Назначение ролей', description: 'Шаг 2 из 3' },
  { number: 3, title: 'Назначение филиалов', description: 'Шаг 3 из 3' },
] as const;

export const CreateEmployeeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      roleIds: [],
      branchIds: [],
    },
  });

  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const onSubmit = (data: CreateEmployeeFormData): void => {
    createEmployee(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        setCurrentStep(1);
      },
    });
  };

  const handleNext = async (): Promise<void> => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger([
        'fullName',
        'phone',
        'email',
        'password',
      ]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['roleIds']);
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='h-4 w-4' />
          Добавить сотрудника
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{STEPS[currentStep - 1]?.title}</DialogTitle>
          <DialogDescription>{STEPS[currentStep - 1]?.description}</DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className='flex gap-2'>
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={cn(
                'h-1 flex-1 rounded-full bg-muted',
                step.number <= currentStep && 'bg-primary'
              )}
            />
          ))}
        </div>

        {/* Form content */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='my-6'>
            {currentStep === 1 && <EmployeeFormBasic form={form} />}
            {currentStep === 2 && <EmployeeFormRoles form={form} />}
            {currentStep === 3 && <EmployeeFormBranches form={form} />}
          </div>

          <DialogFooter>
            {currentStep > 1 && (
              <Button type='button' variant='outline' onClick={handleBack} disabled={isPending}>
                Назад
              </Button>
            )}

            {currentStep < 3 ? (
              <Button type='button' onClick={handleNext}>
                Далее
              </Button>
            ) : (
              <Button type='submit' disabled={isPending}>
                {isPending && <BaseLoading />}
                {isPending ? 'Сохранение...' : 'Создать сотрудника'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
