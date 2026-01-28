'use client'

import { useState } from 'react'

import { Heading } from '@/shared/ui/base/heading'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import { useHallById } from '@/entities/organization/hall'
import { useTableList, useDeleteTable, useUpdateTablePosition, type ITable } from '@/entities/organization/table'
import { CreateTableDialog } from '@/features/organization/table-form'
import { UpdateTableDialog } from '@/features/organization/table-form/ui/update-table-dialog'
import { SessionStatusCard, CloseSessionDialog } from '@/features/organization/table-session'

import { TableListItem } from './table-list-item'
import { VisualFloorPlan } from './visual-floor-plan'

interface IFloorPlanContentProps {
  hallId: number
}

export const FloorPlanContent = ({ hallId }: IFloorPlanContentProps) => {
  const { data: hall, isLoading: isHallLoading } = useHallById(hallId)
  const { data: tables, isLoading: isTablesLoading } = useTableList(hallId)
  const [selectedTable, setSelectedTable] = useState<ITable | null>(null)
  const [isCloseSessionOpen, setIsCloseSessionOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<ITable | null>(null)

  const { mutate: deleteTable } = useDeleteTable()
  const { mutate: updatePosition } = useUpdateTablePosition()

  const handleDeleteTable = (table: ITable) => {
    if (confirm(`Вы уверены, что хотите удалить стол ${table.number}?`)) {
      deleteTable(table.id, {
        onSuccess: () => {
          if (selectedTable?.id === table.id) {
            setSelectedTable(null)
          }
        },
      })
    }
  }

  const handleTableDrop = (tableId: number, x: number, y: number) => {
    updatePosition({
      id: tableId,
      data: {
        xPosition: Math.round(x),
        yPosition: Math.round(y),
        rotation: 0,
      },
    })
  }

  if (isHallLoading || isTablesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  if (!hall) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Зал не найден</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${hall.name} - План зала`}
          description={`Этаж ${hall.floor} • Вместимость: ${hall.capacity} • ${hall.tableCount} столов`}
        />
        <div className="flex gap-2">
          <CreateTableDialog hallId={hallId} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Visual Floor Plan */}
        <div className="lg:col-span-2">
          <VisualFloorPlan
            tables={tables || []}
            selectedTableId={selectedTable?.id}
            onSelectTable={setSelectedTable}
            onTableDrop={handleTableDrop}
          />
        </div>

        {/* Sidebar - Table List */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-semibold">
                Столы ({tables?.length || 0})
              </h3>
              <p className="text-xs text-muted-foreground">
                Нажмите для выбора, перетащите на холсте для перемещения
              </p>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-4">
                {tables && tables.length > 0 ? (
                  tables.map((table) => (
                    <TableListItem
                      key={table.id}
                      table={table}
                      isSelected={selectedTable?.id === table.id}
                      onSelect={setSelectedTable}
                      onEdit={setEditingTable}
                      onDelete={handleDeleteTable}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Столов пока нет. Создайте свой первый стол.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedTable?.hasActiveSession && (
            <SessionStatusCard tableId={selectedTable.id} />
          )}
        </div>
      </div>

      {/* Edit Table Dialog */}
      {editingTable && (
        <UpdateTableDialog
          table={editingTable}
          isOpen={!!editingTable}
          onClose={() => setEditingTable(null)}
        />
      )}

      {/* Close Session Dialog */}
      {selectedTable && (
        <CloseSessionDialog
          tableId={selectedTable.id}
          isOpen={isCloseSessionOpen}
          onClose={() => {
            setIsCloseSessionOpen(false)
            setSelectedTable(null)
          }}
        />
      )}
    </>
  )
}
