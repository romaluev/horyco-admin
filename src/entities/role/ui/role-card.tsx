import { Shield } from 'lucide-react';

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

import type { IRole } from '../model/types';

interface RoleCardProps {
  role: IRole;
  employeeCount?: number;
}

export const RoleCard = ({ role, employeeCount = 0 }: RoleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Shield className='text-primary h-5 w-5' />
          <CardTitle>{role.name}</CardTitle>
        </div>
        {role.description && <CardDescription>{role.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Разрешений</span>
            <Badge variant='secondary'>{role.permissions?.length || 0}</Badge>
          </div>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Сотрудников</span>
            <Badge variant='secondary'>{employeeCount}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
