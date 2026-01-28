'use client'

import {
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconCurrencyDollar,
  IconHash,
  IconList,
  IconListDetails,
  IconNote,
  IconReceipt,
  IconShoppingCart,
  IconTrophy,
} from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'

import {
  useDashboardWidgetStore,
  WIDGET_PRESETS,
} from '@/entities/dashboard/dashboard-widget'

import type { WidgetConfig } from '@/entities/dashboard/dashboard-widget'

interface AddWidgetModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_ICONS: Record<string, React.ReactNode> = {
  'preset-revenue': <IconCurrencyDollar className="h-5 w-5" />,
  'preset-orders-count': <IconShoppingCart className="h-5 w-5" />,
  'preset-avg-check': <IconReceipt className="h-5 w-5" />,
  'preset-revenue-chart': <IconChartLine className="h-5 w-5" />,
  'preset-orders-chart': <IconChartBar className="h-5 w-5" />,
  'preset-top-products-pie': <IconChartPie className="h-5 w-5" />,
  'preset-recent-orders': <IconListDetails className="h-5 w-5" />,
  'preset-top-products-list': <IconTrophy className="h-5 w-5" />,
  'preset-note': <IconNote className="h-5 w-5" />,
}

const DEFAULT_ICON = <IconHash className="h-5 w-5" />

export function AddWidgetModal({ isOpen, onClose }: AddWidgetModalProps) {
  const addWidget = useDashboardWidgetStore((s) => s.addWidget)

  const handleAddPreset = (presetId: string) => {
    const preset = WIDGET_PRESETS.find((p) => p.id === presetId)
    if (!preset) return

    const newWidget: WidgetConfig = {
      ...preset.defaultConfig,
      id: `widget-${Date.now()}`,
      name: preset.name,
    }

    addWidget(newWidget)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Добавить виджет</DialogTitle>
          <DialogDescription>
            Выберите готовый виджет из списка
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {WIDGET_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              className={cn(
                'flex h-auto flex-col items-start gap-2 p-4 text-left',
                'hover:border-primary hover:bg-primary/5'
              )}
              onClick={() => handleAddPreset(preset.id)}
            >
              <div className="flex items-center gap-2 text-primary">
                {PRESET_ICONS[preset.id] ?? DEFAULT_ICON}
                <span className="font-medium">{preset.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {preset.description}
              </p>
              <div className="mt-1 flex gap-1">
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {preset.defaultConfig.size}
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {preset.defaultConfig.visualization}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
