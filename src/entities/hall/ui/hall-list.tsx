import { HallCard } from './hall-card'
import { useHallList } from '../model/queries'

import type { IHall } from '../model/types'

interface IHallListProps {
  branchId: number
  onEdit?: (hall: IHall) => void
}

export const HallList = ({ branchId, onEdit }: IHallListProps) => {
  const { data: halls, isLoading } = useHallList(branchId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading halls...</p>
      </div>
    )
  }

  if (!halls || halls.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">
          No halls found. Create your first hall.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {halls.map((hall) => (
        <HallCard key={hall.id} hall={hall} onEdit={onEdit} />
      ))}
    </div>
  )
}
