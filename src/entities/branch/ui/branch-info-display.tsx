import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Separator } from '@/shared/ui/base/separator'

import type { IBranch } from '../model/types'

interface BranchInfoDisplayProps {
  branch: IBranch
}

export const BranchInfoDisplay = ({ branch }: BranchInfoDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{branch.name}</CardTitle>
          <Badge variant={branch.isActive ? 'default' : 'secondary'}>
            {branch.isActive ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">Адрес</h4>
          <p className="mt-1">{branch.address}</p>
        </div>

        {(branch.phone || branch.phoneNumber) && (
          <>
            <Separator />
            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Телефон
              </h4>
              <p className="mt-1">{branch.phone || branch.phoneNumber}</p>
            </div>
          </>
        )}

        {branch.email && (
          <>
            <Separator />
            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Email
              </h4>
              <p className="mt-1">{branch.email}</p>
            </div>
          </>
        )}

        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-muted-foreground text-sm font-medium">Залы</h4>
            <p className="mt-1 text-2xl font-bold">
              {branch.hallsCount ?? branch.hallCount ?? 0}
            </p>
          </div>
          <div>
            <h4 className="text-muted-foreground text-sm font-medium">Столы</h4>
            <p className="mt-1 text-2xl font-bold">
              {branch.tablesCount ?? branch.tableCount ?? 0}
            </p>
          </div>
        </div>

        {branch.employeeCount !== undefined && (
          <>
            <Separator />
            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Сотрудники
              </h4>
              <p className="mt-1 text-2xl font-bold">{branch.employeeCount}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
