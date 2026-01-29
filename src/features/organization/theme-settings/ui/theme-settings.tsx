'use client'

import { useTranslation } from 'react-i18next'

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
  { nameKey: 'colors.default', value: 'default' },
  { nameKey: 'colors.blue', value: 'blue' },
  { nameKey: 'colors.green', value: 'green' },
  { nameKey: 'colors.amber', value: 'amber' },
]

export function ThemeSettings() {
  const { t } = useTranslation('organization')
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{t('theme.title')}</h3>
        <p className="text-muted-foreground text-sm">
          {t('theme.description')}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Label htmlFor="color-theme" className="sr-only">
          {t('theme.title')}
        </Label>
        <Select
          value={activeTheme.replace('-scaled', '')}
          onValueChange={setActiveTheme}
        >
          <SelectTrigger id="color-theme" className="w-[200px]">
            <SelectValue placeholder={t('theme.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {COLOR_THEMES.map((colorTheme) => (
              <SelectItem key={colorTheme.value} value={colorTheme.value}>
                {t(`theme.${colorTheme.nameKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
