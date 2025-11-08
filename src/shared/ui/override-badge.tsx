'use client'

import * as React from 'react'

import { Badge } from '@/shared/ui/base/badge'

import type { SettingScope } from '@/entities/settings'

interface OverrideBadgeProps {
  scope: SettingScope
  isOverride: boolean
  inheritedFrom?: string
}

export const OverrideBadge = ({
  scope,
  isOverride,
}: OverrideBadgeProps) => {
  if (scope === 'tenant' && !isOverride) {
    return (
      <Badge variant="outline" className="border-blue-500 text-blue-700">
        По умолчанию
      </Badge>
    )
  }

  if (scope === 'branch' && isOverride) {
    return (
      <Badge variant="outline" className="border-orange-500 text-orange-700">
        Переопределено
      </Badge>
    )
  }

  if (scope === 'branch' && !isOverride) {
    return (
      <Badge variant="outline" className="border-gray-500 text-gray-700">
        Унаследовано
      </Badge>
    )
  }

  return null
}
