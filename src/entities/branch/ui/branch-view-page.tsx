'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/shared/ui/base/card';
import { useGetBranchById } from '../model';
import BranchForm from './branch-form';
import BaseLoading from '@/shared/ui/base-loading';
import { useTranslation } from 'react-i18next';

type TBranchViewPageProps = {
  branchId: string;
};

export default function BranchViewPage({ branchId }: TBranchViewPageProps) {
  const { t } = useTranslation();
  const isNew = branchId === 'new';
  const {
    data: branch,
    isLoading,
    isError
  } = useGetBranchById(Number(branchId));

  if (isError && !isNew) {
    return (
      <div className='p-4 text-red-500'>
        {t('dashboard.branches.errors.loadError', { message: isError })}
      </div>
    );
  }

  if (!isNew && isLoading) {
    return <BaseLoading className='py-20' />;
  }

  if (!isNew && !branch) {
    return <div className='p-4'>{t('dashboard.branches.errors.notFound')}</div>;
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {isNew
            ? t('dashboard.branches.form.title.create')
            : t('dashboard.branches.form.title.edit', { name: branch?.name })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BranchForm initialData={branch} />
      </CardContent>
    </Card>
  );
}
