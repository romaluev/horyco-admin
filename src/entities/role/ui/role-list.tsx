import { RoleCard } from './role-card';

import type { IRole } from '../model/types';

interface RoleListProps {
  roles: IRole[];
  employeeCounts?: Record<number, number>;
}

export const RoleList = ({ roles, employeeCounts = {} }: RoleListProps) => {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} employeeCount={employeeCounts[role.id] || 0} />
      ))}
    </div>
  );
};
