'use client'

import Link from 'next/link'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'

import { formatCurrency } from '@/shared/lib/format'
import { MOVEMENT_TYPE_LABELS } from '@/shared/types/inventory'
import { Button } from '@/shared/ui/base/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import { TableCell, TableRow } from '@/shared/ui/base/table'

import { MovementTypeBadge, type IStockMovement } from '@/entities/stock-movement'

interface MovementRowProps {
  movement: IStockMovement
  isExpanded: boolean
  onToggle: () => void
}

const getReferenceLink = (referenceType?: string, referenceId?: number) => {
  if (!referenceType || !referenceId) return null
  switch (referenceType) {
    case 'order':
      return `/dashboard/orders/${referenceId}`
    case 'purchase_order':
      return `/dashboard/inventory/purchase-orders/${referenceId}`
    case 'writeoff':
      return `/dashboard/inventory/writeoffs/${referenceId}`
    case 'production':
      return `/dashboard/inventory/production/${referenceId}`
    case 'count':
      return `/dashboard/inventory/counts/${referenceId}`
    default:
      return null
  }
}

const getReferenceLabel = (referenceType?: string) => {
  switch (referenceType) {
    case 'order':
      return 'Заказ'
    case 'purchase_order':
      return 'Закупка'
    case 'writeoff':
      return 'Списание'
    case 'production':
      return 'Производство'
    case 'count':
      return 'Инвентаризация'
    default:
      return 'Документ'
  }
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}:</span>
    <span>{value}</span>
  </div>
)

export const MovementRow = ({ movement, isExpanded, onToggle }: MovementRowProps) => {
  const referenceLink = getReferenceLink(movement.referenceType, movement.referenceId)
  const unit = movement.item?.unit ?? ''

  return (
    <Collapsible open={isExpanded} asChild>
      <>
        <CollapsibleTrigger asChild>
          <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onToggle}>
            <TableCell>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {format(new Date(movement.createdAt), 'dd MMM yyyy HH:mm', { locale: ru })}
            </TableCell>
            <TableCell className="font-medium">{movement.item?.name}</TableCell>
            <TableCell>
              <MovementTypeBadge type={movement.type} />
            </TableCell>
            <TableCell
              className={`text-right font-medium ${
                movement.quantity > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-destructive'
              }`}
            >
              {movement.quantity > 0 ? '+' : ''}
              {movement.quantity} {unit}
            </TableCell>
            <TableCell className="text-right">{formatCurrency(movement.totalCost)}</TableCell>
            <TableCell className="text-right">
              {movement.newQuantity} {unit}
            </TableCell>
          </TableRow>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell colSpan={7} className="p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Детали движения</h4>
                  <div className="space-y-1 rounded-md border bg-background p-3 text-sm">
                    <DetailRow label="ID движения" value={String(movement.id)} />
                    <DetailRow label="Тип" value={MOVEMENT_TYPE_LABELS[movement.type]} />
                    <DetailRow
                      label="Количество"
                      value={`${movement.quantity > 0 ? '+' : ''}${movement.quantity} ${unit}`}
                    />
                    <DetailRow
                      label="Себестоимость ед."
                      value={`${formatCurrency(movement.unitCost)}/${unit}`}
                    />
                    <DetailRow label="Общая стоимость" value={formatCurrency(movement.totalCost)} />
                    <DetailRow label="Остаток до" value={movement.previousQuantity !== undefined ? `${movement.previousQuantity} ${unit}` : '—'} />
                    <DetailRow label="Остаток после" value={movement.newQuantity !== undefined ? `${movement.newQuantity} ${unit}` : '—'} />
                  </div>
                </div>

                {movement.referenceNumber && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Связанный документ</h4>
                    <div className="space-y-1 rounded-md border bg-background p-3 text-sm">
                      <DetailRow label="Тип" value={getReferenceLabel(movement.referenceType)} />
                      <DetailRow label="Номер" value={movement.referenceNumber} />
                      {movement.notes && <DetailRow label="Примечание" value={movement.notes} />}
                    </div>
                    {referenceLink && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={referenceLink}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Открыть {getReferenceLabel(movement.referenceType).toLowerCase()}
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  )
}
