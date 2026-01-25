import { useTranslation } from 'react-i18next'
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'

import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/shared/ui/base/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'
import PageContainer from '@/shared/ui/layout/page-container'

import { AreaGraph } from './area-graph'
import { BarGraph } from './bar-graph'
import { PieGraph } from './pie-graph'
import { RecentSales } from './recent-sales'

export default function OverViewPage() {
  const { t } = useTranslation('dashboard')

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('widgets.overview.greeting')}
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <Button>{t('widgets.overview.download')}</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('widgets.overview.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              {t('widgets.overview.tabs.analytics')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>{t('widgets.overview.kpiCards.totalRevenue.title')}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {t('widgets.overview.kpiCards.totalRevenue.value')}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp />
                      {t('widgets.overview.kpiCards.totalRevenue.trend')}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {t('widgets.overview.kpiCards.totalRevenue.description')} <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    {t('widgets.overview.kpiCards.totalRevenue.subdescription')}
                  </div>
                </CardFooter>
              </Card>
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>{t('widgets.overview.kpiCards.newCustomers.title')}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {t('widgets.overview.kpiCards.newCustomers.value')}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingDown />
                      {t('widgets.overview.kpiCards.newCustomers.trend')}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {t('widgets.overview.kpiCards.newCustomers.description')} <IconTrendingDown className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    {t('widgets.overview.kpiCards.newCustomers.subdescription')}
                  </div>
                </CardFooter>
              </Card>
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>{t('widgets.overview.kpiCards.activeAccounts.title')}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {t('widgets.overview.kpiCards.activeAccounts.value')}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp />
                      {t('widgets.overview.kpiCards.activeAccounts.trend')}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {t('widgets.overview.kpiCards.activeAccounts.description')} <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    {t('widgets.overview.kpiCards.activeAccounts.subdescription')}
                  </div>
                </CardFooter>
              </Card>
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>{t('widgets.overview.kpiCards.growthRate.title')}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {t('widgets.overview.kpiCards.growthRate.value')}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp />
                      {t('widgets.overview.kpiCards.growthRate.trend')}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {t('widgets.overview.kpiCards.growthRate.description')}{' '}
                    <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    {t('widgets.overview.kpiCards.growthRate.subdescription')}
                  </div>
                </CardFooter>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <RecentSales />
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}
