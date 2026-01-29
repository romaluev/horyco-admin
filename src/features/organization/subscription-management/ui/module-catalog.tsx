'use client'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { formatPrice } from '@/shared/lib/format'
import { BaseError, BaseLoading } from '@/shared/ui'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Separator } from '@/shared/ui/base/separator'

import {
  type IModuleCatalogItem,
  useAddModule,
  useGetModuleCatalog,
} from '@/entities/organization/subscription'

export const ModuleCatalog = () => {
  const { t } = useTranslation('organization')
  const { data: catalog, isLoading, error } = useGetModuleCatalog()
  const { mutate: handleAddModule, isPending } = useAddModule()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  if (isLoading) return <BaseLoading className="py-10" />
  if (error)
    return (
      <BaseError className="py-10" message={t('moduleCatalog.loadError')} />
    )
  if (!catalog) return null

  const renderModuleItem = (item: IModuleCatalogItem) => (
    <Card key={item.key} className="overflow-hidden">
      <CardHeader className="gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{item.name}</CardTitle>
            {item.description && (
              <p className="text-muted-foreground text-sm">
                {item.description}
              </p>
            )}
          </div>
          {item.isSubscribed && <Badge>{t('moduleCatalog.active')}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {item.priceMonthly === 0
              ? t('moduleCatalog.free')
              : formatPrice(item.priceMonthly)}
          </span>
          {item.trialDays && (
            <Badge variant="secondary">
              {item.trialDays} {t('moduleCatalog.trial')}
            </Badge>
          )}
        </div>

        {item.features && item.features.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">
                {t('moduleCatalog.features')}
              </p>
              <ul className="space-y-1">
                {item.features.map((feature) => (
                  <li key={feature} className="text-foreground text-sm">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {item.dependencies && item.dependencies.length > 0 && (
          <>
            <Separator />
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-950/20">
              <p className="text-xs font-medium text-orange-900 dark:text-orange-200">
                {t('moduleCatalog.dependencies')}:
              </p>
              <p className="mt-1 text-sm text-orange-800 dark:text-orange-300">
                {item.dependencies.join(', ')}
              </p>
            </div>
          </>
        )}

        {item.activationBlockers && item.activationBlockers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1">
              {item.activationBlockers.map((blocker) => (
                <p key={blocker} className="text-destructive text-xs">
                  ⚠ {blocker}
                </p>
              ))}
            </div>
          </>
        )}

        <Separator />
        <Button
          onClick={() =>
            handleAddModule({ moduleKey: item.key, startTrial: true })
          }
          disabled={!item.canActivate || isPending || item.isSubscribed}
          className="w-full"
        >
          {item.isSubscribed
            ? t('moduleCatalog.actions.alreadyActivated')
            : item.canActivate
              ? t('moduleCatalog.actions.add')
              : t('moduleCatalog.actions.unavailable')}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Plans Section */}
      {catalog.plans.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            {t('moduleCatalog.sections.plans')}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {catalog.plans.map(renderModuleItem)}
          </div>
        </div>
      )}

      {/* Core Modules Section */}
      {catalog.core.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            {t('moduleCatalog.sections.coreModules')}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {catalog.core.map(renderModuleItem)}
          </div>
        </div>
      )}

      {/* Add-ons Section */}
      {catalog.addons.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            {t('moduleCatalog.sections.addons')}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {catalog.addons.map(renderModuleItem)}
          </div>
        </div>
      )}
    </div>
  )
}
