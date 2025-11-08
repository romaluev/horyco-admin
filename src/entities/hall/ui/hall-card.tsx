import Link from 'next/link'

import { IconBuilding, IconUsers } from '@tabler/icons-react'

import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import type { IHall } from '../model/types'

interface IHallCardProps {
  hall: IHall
  onEdit?: (hall: IHall) => void
  onDelete?: (hall: IHall) => void
}

export const HallCard = ({ hall, onEdit, onDelete }: IHallCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              {hall.name}
            </CardTitle>
            <CardDescription>Этаж {hall.floor}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{hall.description}</p>
        <div className="flex items-center gap-2 text-sm">
          <IconUsers className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Вместимость: <strong className="text-foreground">{hall.capacity}</strong>
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">
            {hall.tableCount} {hall.tableCount === 1 ? 'table' : 'tables'}
            {hall.activeTableCount !== undefined && hall.activeTableCount > 0 && (
              <> ({hall.activeTableCount} occupied)</>
            )}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/dashboard/halls/${hall.id}/floor-plan`}>
            View Этаж Plan
          </Link>
        </Button>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(hall)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(hall)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
