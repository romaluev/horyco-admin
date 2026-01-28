'use client'

import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/base/badge'

import type { IAlertSummary, IAlert } from '@/entities/dashboard/dashboard'

interface AlertsWidgetProps {
  data: IAlertSummary | null
  isLoading?: boolean
  className?: string
}

const ALERT_CONFIG: Record<IAlert['severity'], {
  icon: typeof AlertCircle
  className: string
  badgeVariant: 'default' | 'destructive' | 'outline'
}> = {
  CRITICAL: {
    icon: AlertCircle,
    className: 'text-destructive',
    badgeVariant: 'destructive',
  },
  ERROR: {
    icon: AlertCircle,
    className: 'text-destructive',
    badgeVariant: 'destructive',
  },
  WARNING: {
    icon: AlertTriangle,
    className: 'text-yellow-600',
    badgeVariant: 'outline',
  },
  INFO: {
    icon: Info,
    className: 'text-blue-600',
    badgeVariant: 'default',
  },
}

export function AlertsWidget({
  data,
  isLoading = false,
  className,
}: AlertsWidgetProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-2 rounded-md border p-2">
            <div className="h-5 w-5 animate-pulse rounded bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.alerts.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <Bell className="h-8 w-8 opacity-50" />
        <span>Нет уведомлений</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Unread count */}
      {data.unreadCount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Непрочитанные</span>
          <Badge variant="secondary">{data.unreadCount}</Badge>
        </div>
      )}

      {/* Alerts list */}
      <div className="space-y-2">
        {data.alerts.map((alert) => {
          const config = ALERT_CONFIG[alert.severity]
          const Icon = config.icon

          return (
            <div
              key={alert.id}
              className={cn(
                'flex gap-2 rounded-md border p-2',
                !alert.isRead && 'bg-muted/50'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.className)} />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm leading-snug">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(alert.timestamp), {
                    addSuffix: true,
                    locale: ru,
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
