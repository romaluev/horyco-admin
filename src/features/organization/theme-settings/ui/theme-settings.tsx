'use client'

import { IconMoon, IconSun, IconDeviceDesktop } from '@tabler/icons-react'
import { useTheme } from 'next-themes'

import { useThemeConfig } from '@/shared/ui/active-theme'
import { Label } from '@/shared/ui/base/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { cn } from '@/shared/lib/utils'

const COLOR_THEMES = [
  { name: 'По умолчанию', value: 'default' },
  { name: 'Синий', value: 'blue' },
  { name: 'Зеленый', value: 'green' },
  { name: 'Янтарный', value: 'amber' },
]

const APPEARANCE_MODES = [
  { name: 'Светлая', value: 'light', icon: IconSun },
  { name: 'Темная', value: 'dark', icon: IconMoon },
  { name: 'Системная', value: 'system', icon: IconDeviceDesktop },
] as const

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Режим отображения</h3>
          <p className="text-sm text-muted-foreground">
            Выберите светлую, темную тему или следуйте системным настройкам
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {APPEARANCE_MODES.map((mode) => {
            const Icon = mode.icon
            const isSelected = theme === mode.value
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setTheme(mode.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <Icon className="size-6" />
                <span className="text-sm font-medium">{mode.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Цветовая схема</h3>
          <p className="text-sm text-muted-foreground">
            Выберите основной цвет интерфейса
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="color-theme" className="sr-only">
            Цветовая схема
          </Label>
          <Select
            value={activeTheme.replace('-scaled', '')}
            onValueChange={setActiveTheme}
          >
            <SelectTrigger id="color-theme" className="w-[200px]">
              <SelectValue placeholder="Выберите цвет" />
            </SelectTrigger>
            <SelectContent>
              {COLOR_THEMES.map((colorTheme) => (
                <SelectItem key={colorTheme.value} value={colorTheme.value}>
                  {colorTheme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
