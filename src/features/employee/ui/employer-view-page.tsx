'use client';

import { useGetEmployerById } from '../model';
import EmployeeForm from './employee-form';
import BaseLoading from '@/components/base-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TBranchViewPageProps = {
  employerId: string;
};

export default function EmployerViewPage({ employerId }: TBranchViewPageProps) {
  const { data: employer, isPending } = useGetEmployerById(Number(employerId));

  if (isPending) {
    return <BaseLoading className='py-10' />;
  }

  if (employerId !== 'new' && !employer) {
    return <div className='p-4'>The employer doesn&#39;t exist</div>;
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {employerId === 'new'
            ? 'Create New Employer'
            : `Edit Employer: ${employer?.fullName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmployeeForm initialData={employer} />
      </CardContent>
    </Card>
  );
}
