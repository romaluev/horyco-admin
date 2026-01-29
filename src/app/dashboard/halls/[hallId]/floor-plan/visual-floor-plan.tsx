'use client'

import { useState, useRef } from 'react'

import { IconArmchair } from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'

import type { ITable } from '@/entities/organization/table'

interface IVisualFloorPlanProps {
  tables: ITable[]
  selectedTableId?: number | null
  onSelectTable: (table: ITable) => void
  onTableDrop: (tableId: number, x: number, y: number) => void
}

const TABLE_SIZE = 80

export const VisualFloorPlan = ({
  tables,
  selectedTableId,
  onSelectTable,
  onTableDrop,
}: IVisualFloorPlanProps) => {
  const tablesWithoutPosition = tables.filter((t) => !t.position)

  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggingTable, setDraggingTable] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragPosition, setDragPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const handleMouseDown = (e: React.MouseEvent, table: ITable) => {
    if (!table.position || !canvasRef.current) return

    e.preventDefault()
    e.stopPropagation()

    // Get canvas position and scroll offset
    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    const scrollContainer = canvas.parentElement

    // Calculate mouse position in canvas coordinates
    const mouseX =
      e.clientX - canvasRect.left + (scrollContainer?.scrollLeft || 0)
    const mouseY =
      e.clientY - canvasRect.top + (scrollContainer?.scrollTop || 0)

    // Calculate offset from table's top-left corner
    setDragOffset({
      x: mouseX - table.position.x,
      y: mouseY - table.position.y,
    })

    setDraggingTable(table.id)
    setDragPosition({ x: table.position.x, y: table.position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingTable === null || !canvasRef.current) return

    // Get canvas and scroll container
    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    const scrollContainer = canvas.parentElement

    // Calculate mouse position in canvas coordinates
    const mouseX =
      e.clientX - canvasRect.left + (scrollContainer?.scrollLeft || 0)
    const mouseY =
      e.clientY - canvasRect.top + (scrollContainer?.scrollTop || 0)

    // Find the dragging table to get its dimensions
    const table = tables.find((t) => t.id === draggingTable)
    if (!table || !table.position) return

    const width = table.position.width || TABLE_SIZE
    const height =
      table.shape === 'rectangle'
        ? table.position.height || TABLE_SIZE * 1.5
        : table.position.height || TABLE_SIZE

    // Canvas boundaries (min-h-[800px] min-w-[800px])
    const CANVAS_WIDTH = 800
    const CANVAS_HEIGHT = 800

    // Calculate max boundaries (canvas size minus table size)
    const maxX = CANVAS_WIDTH - width
    const maxY = CANVAS_HEIGHT - height

    // Calculate new table position with boundary constraints
    const newX = Math.max(0, Math.min(maxX, mouseX - dragOffset.x))
    const newY = Math.max(0, Math.min(maxY, mouseY - dragOffset.y))

    // Update drag position for real-time preview
    setDragPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (draggingTable === null || !dragPosition) return

    // Use the final drag position
    onTableDrop(
      draggingTable,
      Math.round(dragPosition.x),
      Math.round(dragPosition.y)
    )

    // Clear drag state
    setDraggingTable(null)
    setDragPosition(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500 hover:bg-green-600'
      case 'OCCUPIED':
        return 'bg-red-500 hover:bg-red-600'
      case 'RESERVED':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'INACTIVE':
        return 'bg-gray-400 hover:bg-gray-500'
      default:
        return 'bg-gray-300 hover:bg-gray-400'
    }
  }

  const getStatusLineColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#10b981' // green-500
      case 'OCCUPIED':
        return '#ef4444' // red-500
      case 'RESERVED':
        return '#eab308' // yellow-500
      case 'INACTIVE':
        return '#6b7280' // gray-500
      default:
        return '#6b7280'
    }
  }

  const getShapeClass = (shape: string) => {
    switch (shape.toLowerCase()) {
      case 'round':
      case 'oval':
        return 'rounded-full'
      case 'square':
        return 'rounded-md'
      case 'rectangle':
        return 'rounded-md'
      default:
        return 'rounded-md'
    }
  }

  return (
    <div
      className="relative h-[600px] w-full overflow-auto rounded-lg border bg-gray-50 p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Warning for tables without position */}
      {tablesWithoutPosition.length > 0 && (
        <div className="absolute top-4 left-4 z-10 rounded-lg border border-yellow-300 bg-yellow-50 p-3 shadow-sm">
          <div className="text-xs font-semibold text-yellow-800">
            ⚠️ Предупреждение
          </div>
          <div className="mt-1 text-xs text-yellow-700">
            {tablesWithoutPosition.length} стол(ов) без данных о позиции.
            <br />
            Отредактируйте столы, чтобы установить их позицию на плане зала.
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 rounded-lg border bg-white p-3 shadow-sm">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Доступен</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Занят</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span>Забронирован</span>
          </div>
        </div>
      </div>

      <div ref={canvasRef} className="relative min-h-[800px] min-w-[800px]">
        {tables.map((table) => {
          if (!table.position) {
            return null
          }

          const isDragging = draggingTable === table.id
          const position =
            isDragging && dragPosition ? dragPosition : table.position

          const width = table.position.width || TABLE_SIZE
          const height =
            table.shape === 'rectangle'
              ? table.position.height || TABLE_SIZE * 1.5
              : table.position.height || TABLE_SIZE

          return (
            <div
              key={table.id}
              className="absolute"
              style={{
                left: position.x,
                top: position.y,
                width,
                height,
              }}
            >
              <button
                type="button"
                onClick={() => !isDragging && onSelectTable(table)}
                onMouseDown={(e) => handleMouseDown(e, table)}
                className={cn(
                  'relative flex h-full w-full cursor-move flex-col items-center justify-center gap-0.5 overflow-hidden border text-white',
                  getStatusColor(table.status),
                  getShapeClass(table.shape),
                  selectedTableId === table.id && 'ring-4 ring-blue-500',
                  isDragging && 'opacity-70 shadow-2xl ring-4 ring-blue-400',
                  !isDragging && 'transition-all'
                )}
                style={{
                  transform: `rotate(${table.position.rotation}deg)`,
                  userSelect: 'none',
                  zIndex: isDragging ? 50 : 1,
                  borderWidth: '1px',
                  borderColor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Colored status line at bottom */}
                <div
                  className="absolute right-0 bottom-0 left-0 h-1"
                  style={{
                    backgroundColor: getStatusLineColor(table.status),
                  }}
                />

                <div className="text-sm font-bold">Стол {table.number}</div>
                <div className="flex items-center gap-1 text-xs">
                  <IconArmchair className="h-3 w-3" />
                  <span>{table.capacity}</span>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
