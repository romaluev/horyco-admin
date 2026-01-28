import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/base/card'

import type { IBranch } from '../model/types'
import type { ReactNode } from 'react'

interface BranchCardProps {
  branch: IBranch
  actions?: ReactNode
}

export const BranchCard = ({ branch, actions }: BranchCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{branch.name}</h3>
            <Badge variant={branch.isActive ? 'default' : 'secondary'}>
              {branch.isActive ? 'Активен' : 'Неактивен'}
            </Badge>
          </div>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-muted-foreground text-sm">{branch.address}</div>
        {(branch.phone || branch.phoneNumber) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Телефон:</span>
            <span>{branch.phone || branch.phoneNumber}</span>
          </div>
        )}
        {branch.email && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Email:</span>
            <span>{branch.email}</span>
          </div>
        )}
        <div className="text-muted-foreground flex items-center gap-4 pt-2 text-sm">
          <span>{branch.hallsCount ?? branch.hallCount ?? 0} залов</span>
          <span>• {branch.tablesCount ?? branch.tableCount ?? 0} столов</span>
        </div>
      </CardContent>
    </Card>
  )
}
