'use client'

import { IconClock, IconUsers, IconCurrencyDollar } from '@tabler/icons-react'

import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import { useTableSession } from '@/entities/organization/table'

interface ISessionStatusCardProps {
  tableId: number
}

export const SessionStatusCard = ({ tableId }: ISessionStatusCardProps) => {
  const { data: session, isLoading } = useTableSession(tableId)

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm">Loading session...</p>
        </CardContent>
      </Card>
    )
  }

  if (!session?.hasActiveSession) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm">No active session</p>
        </CardContent>
      </Card>
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60)
    return `${diff} min`
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          Active Session
          <Badge variant={session.isPaid ? 'default' : 'secondary'}>
            {session.isPaid ? 'Paid' : 'Not Paid'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {session.startedAt && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <IconClock className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">
                Started:{' '}
                <strong className="text-foreground">
                  {formatTime(session.startedAt)}
                </strong>
              </span>
            </div>
            <div className="text-muted-foreground pl-6 text-xs">
              ({getDuration(session.startedAt)} ago)
            </div>
          </div>
        )}
        {session.guestCount !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <IconUsers className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">
              Guests:{' '}
              <strong className="text-foreground">{session.guestCount}</strong>
            </span>
          </div>
        )}
        {session.waiterName && (
          <div className="text-sm">
            <span className="text-muted-foreground">
              Waiter:{' '}
              <strong className="text-foreground">{session.waiterName}</strong>
            </span>
          </div>
        )}
        {session.orderCount !== undefined && session.orderCount > 0 && (
          <div className="rounded-md bg-blue-50 p-2 text-sm">
            <div className="font-medium text-blue-900">Orders:</div>
            <div className="text-xs text-blue-700">
              {session.orderCount}{' '}
              {session.orderCount === 1 ? 'order' : 'orders'} placed
            </div>
          </div>
        )}
        {session.totalAmount !== undefined && (
          <div className="flex items-center gap-2 border-t pt-3 text-sm font-semibold">
            <IconCurrencyDollar className="h-4 w-4" />
            <span>Total: {session.totalAmount.toLocaleString()} UZS</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
