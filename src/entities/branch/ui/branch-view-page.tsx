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

type TBranchViewPageProps = {
  branchId: string;
};

export default function BranchViewPage({ branchId }: TBranchViewPageProps) {
  const isNew = branchId !== 'new';
  const {
    data: branch,
    isLoading,
    isError
  } = useGetBranchById(Number(branchId));

  if (isError && !isNew) {
    return <div className='p-4 text-red-500'>Error: {isError}</div>;
  }

  if (!isNew && isLoading) {
    return <BaseLoading className='py-20' />;
  }

  if (!isNew && !branch) {
    return <div className='p-4'>The branch doesn&#39;t exist</div>;
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {isNew ? 'Create New Branch' : `Edit Branch: ${branch?.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BranchForm initialData={branch} />;
      </CardContent>
    </Card>
  );
}
