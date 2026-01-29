'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconHash,
  IconList,
  IconTextCaption,
} from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import {
  DATA_FIELD_LABELS,
  DATA_SOURCE_LABELS,
  TIME_INTERVAL_LABELS,
  useDashboardWidgetStore,
  VISUALIZATION_LABELS,
  VISUALIZATION_RECOMMENDED_SIZES,
} from '@/entities/dashboard/dashboard-widget'

import type {
  WidgetConfig,
  WidgetSize,
  WidgetVisualization,
} from '@/entities/dashboard/dashboard-widget'

interface WidgetConfigModalProps {
  widgetId: string | null
  isOpen: boolean
  onClose: () => void
}

const VISUALIZATION_ICONS: Record<WidgetVisualization, React.ReactNode> = {
  number: <IconHash className="h-4 w-4" />,
  'line-chart': <IconChartLine className="h-4 w-4" />,
  'bar-chart': <IconChartBar className="h-4 w-4" />,
  'pie-chart': <IconChartPie className="h-4 w-4" />,
  list: <IconList className="h-4 w-4" />,
  text: <IconTextCaption className="h-4 w-4" />,
}

const SIZE_LABELS: Record<WidgetSize, string> = {
  '1x1': '1x1 (квадрат)',
  '2x1': '2x1 (широкий)',
  '1x2': '1x2 (высокий)',
  '2x2': '2x2 (большой)',
}

export function WidgetConfigModal({
  widgetId,
  isOpen,
  onClose,
}: WidgetConfigModalProps) {
  const widget = useDashboardWidgetStore((s) =>
    widgetId ? s.config.widgets[widgetId] : null
  )
  const updateWidget = useDashboardWidgetStore((s) => s.updateWidget)

  const [name, setName] = useState('')
  const [visualization, setVisualization] =
    useState<WidgetVisualization>('number')
  const [size, setSize] = useState<WidgetSize>('1x1')
  const [source, setSource] = useState<string>('analytics')
  const [field, setField] = useState<string>('revenue')
  const [interval, setInterval] = useState<string>('today')
  const [showTrend, setShowTrend] = useState(true)
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    if (widget) {
      setName(widget.name)
      setVisualization(widget.visualization)
      setSize(widget.size)
      setSource(widget.dataField.source)
      setField(widget.dataField.field)
      setInterval(widget.timeRange.interval)
      setShowTrend(widget.showTrend ?? true)
      setShowAnimation(widget.showAnimation ?? true)
    }
  }, [widget])

  const availableFields = useMemo(() => {
    return DATA_FIELD_LABELS[source] ?? {}
  }, [source])

  const recommendedSizes = useMemo(() => {
    return VISUALIZATION_RECOMMENDED_SIZES[visualization] ?? ['1x1']
  }, [visualization])

  const handleSave = () => {
    if (!widgetId) return

    const updates: Partial<WidgetConfig> = {
      name,
      visualization,
      size,
      dataField: { source, field } as WidgetConfig['dataField'],
      timeRange: { interval } as WidgetConfig['timeRange'],
      showTrend,
      showAnimation,
    }

    updateWidget(widgetId, updates)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Настройка виджета</DialogTitle>
          <DialogDescription>
            Выберите тип визуализации и источник данных
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Название</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название виджета"
            />
          </div>

          {/* Visualization Type */}
          <div className="space-y-2">
            <Label>Тип визуализации</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(VISUALIZATION_LABELS) as WidgetVisualization[]).map(
                (viz) => (
                  <button
                    key={viz}
                    type="button"
                    onClick={() => setVisualization(viz)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition-colors',
                      visualization === viz
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {VISUALIZATION_ICONS[viz]}
                    <span>{VISUALIZATION_LABELS[viz]}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label>Размер</Label>
            <Select
              value={size}
              onValueChange={(v) => setSize(v as WidgetSize)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SIZE_LABELS) as WidgetSize[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {SIZE_LABELS[s]}
                    {recommendedSizes.includes(s) && ' (рекомендуется)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Источник данных</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DATA_SOURCE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Поле данных</Label>
              <Select value={field} onValueChange={setField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(availableFields).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Interval */}
          <div className="space-y-2">
            <Label>Период</Label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_INTERVAL_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number widget options */}
          {visualization === 'number' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showTrend}
                  onChange={(e) => setShowTrend(e.target.checked)}
                  className="border-border rounded"
                />
                Показать тренд
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showAnimation}
                  onChange={(e) => setShowAnimation(e.target.checked)}
                  className="border-border rounded"
                />
                Анимация счётчика
              </label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
