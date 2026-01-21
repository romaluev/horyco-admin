'use client'

import { useThemeConfig } from '@/shared/ui/active-theme'
import { Label } from '@/shared/ui/base/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

const COLOR_THEMES = [
  { name: 'По умолчанию', value: 'default' },
  { name: 'Синий', value: 'blue' },
  { name: 'Зеленый', value: 'green' },
  { name: 'Янтарный', value: 'amber' },
]

export function ThemeSettings() {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
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
  )
}
