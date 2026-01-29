/**
 * Locked Page State Component
 * Based on docs: 25-analytics-pages.md - Locked Page State section
 *
 * Shown when user tries to access a page that requires higher subscription tier
 */

'use client'

import * as React from 'react'

import { IconLock } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useRouter } from '@/shared/lib/navigation'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { UPGRADE_PROMPTS } from '../model/constants'

import type { EntitlementTier, IPageAccessConfig } from '../model/types'

interface ILockedPageStateProps {
  /** The page configuration */
  config: IPageAccessConfig
  /** The tier user needs to upgrade to */
  requiredTier: EntitlementTier
}

/**
 * Component shown when user tries to access a locked page
 *
 * Per docs/25-analytics-pages.md:
 * ```
 * +------------------------------------------------------------------+
 * |                                                                   |
 * |  [Lock icon]                                                      |
 * |                                                                   |
 * |  Staff Analytics                                                  |
 * |                                                                   |
 * |  This feature requires PRO plan or higher.                        |
 * |                                                                   |
 * |  Upgrade now to unlock:                                           |
 * |  - Staff performance tracking                                     |
 * |  - Customer analytics                                             |
 * |  - Heatmap analysis                                               |
 * |  - And more...                                                    |
 * |                                                                   |
 * |  +------------------------------------------------------------+  |
 * |  |                     [ Upgrade to PRO ]                      |  |
 * |  +------------------------------------------------------------+  |
 * |                                                                   |
 * +------------------------------------------------------------------+
 * ```
 */
export function LockedPageState({
  config,
  requiredTier,
}: ILockedPageStateProps) {
  const { t } = useTranslation('analytics')
  const router = useRouter()

  const prompt =
    requiredTier === 'analytics_full'
      ? UPGRADE_PROMPTS.ultra
      : UPGRADE_PROMPTS.pro
  const targetPlan = requiredTier === 'analytics_full' ? 'ULTRA' : 'PRO'

  const handleUpgrade = () => {
    // Navigate to subscription page
    router.push('/dashboard/settings?tab=subscription')
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="bg-muted mx-auto flex size-16 items-center justify-center rounded-full">
            <IconLock className="text-muted-foreground size-8" />
          </div>
          <CardTitle className="text-xl">{config.title}</CardTitle>
          <CardDescription className="text-base">
            {t('lockedPage.requiresPlan', { plan: targetPlan })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.upgradeFeatures.length > 0 && (
            <div className="text-left">
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                {t('lockedPage.upgradeNow')}
              </p>
              <ul className="space-y-2">
                {config.upgradeFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-start gap-2 text-sm"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleUpgrade} className="w-full" size="lg">
            {prompt.buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// VIEW LIMIT REACHED STATE
// ============================================

interface IViewLimitStateProps {
  /** Current number of views */
  currentCount: number
  /** Maximum allowed views */
  maxViews: number
  /** Callback when manage views is clicked */
  onManageViews?: () => void
}

/**
 * Component shown when user tries to create a view but has reached limit
 *
 * Per docs/26-analytics-views.md:
 * PRO users can create up to 3 custom views per page
 */
export function ViewLimitReachedState({
  currentCount,
  maxViews,
  onManageViews,
}: IViewLimitStateProps) {
  const { t } = useTranslation('analytics')
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/dashboard/settings?tab=subscription')
  }

  return (
    <div className="space-y-4 p-4 text-center">
      <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-full">
        <IconLock className="text-muted-foreground size-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-medium">{UPGRADE_PROMPTS.viewLimit.title}</h3>
        <p className="text-muted-foreground text-sm">
          {t('lockedPage.viewLimitReached', { maxViews })}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={handleUpgrade} className="w-full">
          {UPGRADE_PROMPTS.viewLimit.buttonText}
        </Button>
        {onManageViews && (
          <Button variant="outline" onClick={onManageViews} className="w-full">
            {t('views.manage')}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================
// UPGRADE PROMPT FOR BASIC USERS (VIEWS)
// ============================================

/**
 * Component shown to BASIC users in views dropdown
 *
 * Per docs/26-analytics-views.md:
 * BASIC users cannot create custom views, only use defaults
 */
export function ViewsUpgradePrompt() {
  const { t } = useTranslation('analytics')
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/dashboard/settings?tab=subscription')
  }

  return (
    <div className="border-t p-3 text-center">
      <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        <IconLock className="size-4" />
        <span>{t('views.saveViews')}</span>
      </div>
      <Button
        variant="link"
        size="sm"
        onClick={handleUpgrade}
        className="mt-1 h-auto p-0 text-sm"
      >
        {t('views.upgrade')}
      </Button>
    </div>
  )
}
