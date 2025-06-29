'use client';

import PageContainer from '@/shared/ui/layout/page-container';
import { Heading } from '@/shared/ui/base/heading';
import { Separator } from '@/shared/ui/base/separator';
import { TableList } from '@/entities/table';
import {
  UpdateTableButton,
  CreateTableButton,
  DeleteTableButton
} from '@/features/table';

export default function Page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Стол менеджмент' description='Управление столами' />
          <div className='flex gap-2'>
            <CreateTableButton />
          </div>
        </div>
        <Separator />
        <TableList
          UpdateButton={UpdateTableButton}
          DeleteButton={DeleteTableButton}
        />
      </div>
    </PageContainer>
  );
}
