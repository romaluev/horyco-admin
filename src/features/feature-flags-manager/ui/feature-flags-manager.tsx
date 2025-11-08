'use client'

import { useEffect, useState } from 'react'

import { Label } from '@/shared/ui/base/label'
import { Switch } from '@/shared/ui/base/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/base/tooltip'
import BaseLoading from '@/shared/ui/base-loading'

import {
  useFeatureFlags,
  useUpdateFeatures,
  type IFeatureFlags,
} from '@/entities/settings'

import { FEATURE_FLAG_LABELS } from '../model/constants'

interface FeatureFlagsManagerProps {
  branchId?: number
}

const extractValue = (setting: { value: boolean } | undefined): boolean => {
  return setting?.value ?? false
}

export const FeatureFlagsManager = ({
  branchId,
}: FeatureFlagsManagerProps) => {
  const { data: featureFlags, isLoading } = useFeatureFlags(branchId)
  const { mutate: updateFeatures } = useUpdateFeatures(branchId)

  const [localFlags, setLocalFlags] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (featureFlags) {
      const flags: Record<string, boolean> = {}
      Object.keys(featureFlags).forEach((key) => {
        flags[key] = extractValue(
          featureFlags[key as keyof IFeatureFlags] as { value: boolean }
        )
      })
      setLocalFlags(flags)
    }
  }, [featureFlags])

  const handleToggle = (flagKey: string, checked: boolean) => {
    // Optimistic update
    setLocalFlags((prev) => ({ ...prev, [flagKey]: checked }))

    // Update on server
    updateFeatures(
      { [flagKey]: checked },
      {
        onError: () => {
          // Revert on error
          setLocalFlags((prev) => ({ ...prev, [flagKey]: !checked }))
        },
      }
    )
  }

  if (isLoading) {
    return <BaseLoading />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(FEATURE_FLAG_LABELS).map(([key, { label, description }]) => (
          <div
            key={key}
            className="flex items-center justify-between space-x-4 rounded-lg border p-4"
          >
            <div className="flex-1 space-y-1">
              <Label htmlFor={key} className="cursor-pointer font-medium">
                {label}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-muted-foreground text-sm">
                      {description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id={key}
              checked={localFlags[key] ?? false}
              onCheckedChange={(checked) => handleToggle(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
