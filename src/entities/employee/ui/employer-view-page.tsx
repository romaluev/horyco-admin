'use client';

import { useGetEmployerById } from '../model';
import EmployeeForm from './employee-form';
import BaseLoading from '@/shared/ui/base-loading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';

type TBranchViewPageProps = {
  employerId: string;
};

export default function EmployerViewPage({ employerId }: TBranchViewPageProps) {
  const isNew = employerId === 'new';
  const {
    data: employer,
    isLoading,
    isError
  } = useGetEmployerById(Number(employerId));

  if (!isNew && isLoading) {
    return <BaseLoading className='py-20' />;
  }

  if (isError && !isNew) {
    return <div className='p-4 text-red-500'>Ошибка: {isError}</div>;
  }

  if (!isNew && !employer) {
    return <div className='p-4'>Сотрудник не существует</div>;
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {isNew
            ? 'Создать нового сотрудника'
            : `Редактировать сотрудника: ${employer?.fullName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmployeeForm initialData={employer} />
      </CardContent>
    </Card>
  );
}
