import { useState } from 'react';

import type { ICreateEmployeeDto } from '@/entities/employee';

type EmployeeFormStep = 1 | 2 | 3;

export const useEmployeeForm = () => {
  const [currentStep, setCurrentStep] = useState<EmployeeFormStep>(1);
  const [formData, setFormData] = useState<Partial<ICreateEmployeeDto>>({});

  const goToNextStep = (stepData: Partial<ICreateEmployeeDto>): void => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as EmployeeFormStep);
    }
  };

  const goToPreviousStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as EmployeeFormStep);
    }
  };

  const resetForm = (): void => {
    setCurrentStep(1);
    setFormData({});
  };

  const updateFormData = (data: Partial<ICreateEmployeeDto>): void => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return {
    currentStep,
    formData,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    updateFormData,
  };
};
