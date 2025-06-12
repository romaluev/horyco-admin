'use client';

import { IEmployee, useEmployeeStore } from '../model';
import EmployeeForm from './employee-form';
import { useEffect, useState } from 'react';
import BaseLoading from '@/components/base-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TBranchViewPageProps = {
  employerId: string;
};

export default function EmployerViewPage({ employerId }: TBranchViewPageProps) {
  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState<IEmployee | null>(null);

  const { getEmployerById, error } = useEmployeeStore();

  useEffect(() => {
    const fetchBranch = async () => {
      setLoading(true);
      if (employerId === 'new') {
        setLoading(false);
        return;
      }

      try {
        const data = await getEmployerById(Number(employerId));
        if (data) {
          setEmployer(data);
        }
      } catch (error) {
        console.error('Error fetching employer:', error);
      }
      setLoading(false);
    };

    fetchBranch();
  }, [employerId, getEmployerById]);

  if (error && employerId !== 'new') {
    return <div className='p-4 text-red-500'>Error: {error}</div>;
  }

  if (loading) {
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
