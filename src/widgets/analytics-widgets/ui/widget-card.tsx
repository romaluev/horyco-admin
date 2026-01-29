'use client'

import { RefreshCw, AlertCircle } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

interface WidgetCardProps {
  title: string
  children: React.ReactNode
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
  className?: string
  contentClassName?: string
}

export function WidgetCard({
  title,
  children,
  isLoading = false,
  error = null,
  onRetry,
  className,
  contentClassName,
}: WidgetCardProps) {
  if (error) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            'flex flex-col items-center justify-center gap-2 text-center',
            contentClassName
          )}
        >
          <AlertCircle className="text-muted-foreground h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Не удалось загрузить данные
          </p>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Повторить
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {isLoading && (
            <RefreshCw className="text-muted-foreground h-4 w-4 animate-spin" />
          )}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
