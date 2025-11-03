import { Suspense } from 'react'

import BaseLoading from '@/shared/ui/base-loading'

import { useTableList } from '../model'
import { TableCard } from './table-card'

interface TableListProps {
  UpdateButton?: React.ComponentType<{ id: number }>
  DeleteButton?: React.ComponentType<{ id: number }>
}

export const TableList = ({ UpdateButton, DeleteButton }: TableListProps) => {
  const { data: tables, isLoading } = useTableList()

  return (
    <Suspense fallback={<BaseLoading className="py-20" />}>
      {isLoading && <BaseLoading />}
      {tables?.items.length === 0 && (
        <p className="text-center">Вы еще не добавили столы</p>
      )}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {tables?.items.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            UpdateButton={UpdateButton}
            DeleteButton={DeleteButton}
          />
        ))}
      </div>
    </Suspense>
  )
}
